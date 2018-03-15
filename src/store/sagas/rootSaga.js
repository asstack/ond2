import { call, put, takeEvery, all, select } from 'redux-saga/effects';
import {
  searchPlayer,
  fetchProfile,
  fetchCharacters,
  fetchActivityHistory,
  fetchPostGameCarnageReport,
  fetchPublicMilestones
} from "../../services/destiny-services";
import * as consts from "../constants";
import { RAIDS } from '../../actions/index';
import normalize from '../normalize';

function* handleSearchPlayerFailure() {
  yield put({ type: consts.SET_PLAYER_PROFILE, data: { notFound: true } });
  yield put({ type: consts.SET_RAID_HISTORY, data: {} });
  yield put({ type: consts.SET_ACTIVITY_HISTORY, data: {} });
  yield put({ type: consts.SET_NF_HISTORY, data: {} });
  yield put({ type: consts.TOGGLE_LOADING });
}

function* fetchPlayerProfile({ data }) {
  try {
    yield put({ type: consts.TOGGLE_LOADING });
    yield put({ type: consts.SET_PLAYER_PRIVACY, data: false });
    const searchResults = yield call(searchPlayer, data);

    if(searchResults === undefined ) {
      return yield call(handleSearchPlayerFailure);
    }

    const [profile, playersCharacters] = yield all([ call(fetchProfile, searchResults), call(fetchCharacters, searchResults)]);

    const playerProfile = normalize.player(searchResults, profile, playersCharacters);

    yield put({ type: consts.SET_PLAYER_PROFILE, data: playerProfile });
    yield put({ type: consts.FETCH_LOG, data: 'Player Profile Fetch Success' });

    const [raidHistory, nightfallHistory] = yield all([call(collectRaidData, playerProfile), call(collectNightFallData, playerProfile)]);

    yield put({ type: consts.SET_RAID_HISTORY, data: raidHistory});
    yield put({ type: consts.SET_NF_HISTORY, data: nightfallHistory});

    yield put({ type: consts.TOGGLE_LOADING });

  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
  }
}

function* collectActivityHistory(historyParam, queryParams={ page: 0, mode: 'raid', count: 250 }) {
  return yield call(fetchActivityHistory, historyParam, queryParams);
}

function* collectProfileCharacters(data) {
    yield call(fetchCharacters, data);
}

function* collectNightFallData(playerProfile) {
  try {
    const nfNormalActivities = yield all(
      [
        ...playerProfile.characterIds.map(curr => collectActivityHistory(playerProfile.characters[curr], { page: 0, mode: 46, count: 250 })),
        ...playerProfile.characterIds.map(curr => collectActivityHistory(playerProfile.characters[curr], { page: 0, mode: 16, count: 250 }))
      ]
    );

    const nfPrestigeActivities = yield all(
      [
        ...playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[curr], { page: 0, mode: 47, count: 250 })),
        ...playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[curr], { page: 0, mode: 17, count: 250 }))
      ]
    );

    //const nfPrestigeActivities = [...prestigeScored.map(item => [...item]), ...prestige.map(item => [...item])];
    //const nfNormalActivities = [...normalScored.map(item => [...item]), ...normal.map(item => [...item])];

    //const compareNormalData = compare.reduce((accum, data) => {
    //   accum = [...accum, ...data];
    //   return accum;
    // }, []);

    const nfNormalData = nfNormalActivities.reduce((accum, data) => {
      accum = [...accum, ...data];
      return accum;
    }, []);

    const nfPrestigeData = nfPrestigeActivities.reduce((accum, data) => {
      accum = [...accum, ...data];
      return accum;
    }, []);


    const nfHistory = normalize.nightfall({ normal: nfNormalData, prestige: nfPrestigeData });

    yield put({ type: consts.FETCH_LOG, data: `Nightfall data successfully collected`});

    return nfHistory;
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `NightFall Data Fetch Error: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
  }
}

function* collectRaidData(playerProfile) {
  try {
    const raidData = yield all(
      playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[curr])),
    );

    if(Object.keys(raidData[0]).indexOf('error') >= 0) {
      yield put({ type: consts.SET_PLAYER_PRIVACY, data: true });
    }

    const activityHistory = playerProfile.characterIds.reduce((accum, charId, idx) => {
      accum[charId] = [...raidData[idx]];
      return accum;
    }, {});

    const normalizedRaidData = normalize.raidHistory(activityHistory);

    yield put({ type: consts.FETCH_LOG, data: 'Raid Data Successfully Collected' });

    return normalizedRaidData;
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Raid Data Fetch Error: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
  }
}

function* collectPGCR({ data }) {
  try {
    const pgcrHistory = yield select(state => state.pgcrHistory);

    if(pgcrHistory[data]) {
      yield put({ type: consts.SET_PGCR, data: pgcrHistory[data] });
    }
    else {
      const pgcr = yield call(fetchPostGameCarnageReport, data);
      const normalizedPGCR = normalize.postGameCarnageReport(pgcr);
      pgcrHistory[data] = normalizedPGCR;

      yield put({ type: consts.SET_PGCR, data: normalizedPGCR });
      yield put({ type: consts.FETCH_LOG, data: 'Post Game Carnage Report Fetch Success' });
   }
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Error fetching report ${data}: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
  }
}


function* collectPublicMilestoneData() {
  try {
    const publicMilestones = yield select(state => state.publicMilestones);
    if(!publicMilestones) {
      const lev_msh = RAIDS.LEVIATHAN.milestoneHash;
      const nf_msh = RAIDS.NIGHTFALL.milestoneHash;

      const milestoneData = yield call(fetchPublicMilestones);
      const normalizedMilestones = normalize.milestoneData(milestoneData, {lev_msh, nf_msh});
      yield put({ type: consts.SET_PUBLIC_MILESTONES, data: normalizedMilestones });
      return normalizedMilestones;
    }
    return publicMilestones;
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Error fetching public milestone data: ${error}`})
    yield put({ type: consts.TOGGLE_LOADING });
  }
}

function* watchProfileCharacters() {
  yield takeEvery(consts.FETCH_PROFILE_CHARACTERS, collectProfileCharacters);
  yield takeEvery(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
  yield takeEvery(consts.FETCH_PGCR, collectPGCR);
  yield takeEvery(consts.LOAD_PUBLIC_MILESTONE_DATA, collectPublicMilestoneData);
}

export default function* rootSaga() {
  yield all([
    watchProfileCharacters()
  ])
}
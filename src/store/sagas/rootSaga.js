import { call, put, takeEvery, take, all, select } from 'redux-saga/effects';
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
  yield put({ type: consts.TOGGLE_LOADING });
}

function* clearSearchData() {
  yield put({ type: consts.SET_RAID_HISTORY, data: { raidCount: { eow: { normal: 0, prestige: 0 }, lev: { normal: 0, prestige: 0 } } } });
  yield put({ type: consts.SET_ACTIVITY_HISTORY, data: { normal: {}, prestige: {}, nfCount: { normal: 0, prestige: 0 } } });
  yield put({ type: consts.SET_NF_HISTORY, data: {} });
}

function* fetchPlayerProfile({ data }) {
  try {
    yield put({ type: consts.TOGGLE_LOADING });
    yield call(clearSearchData);
    yield put({ type: consts.SET_PLAYER_PRIVACY, data: false });

    const searchResults = yield call(searchPlayer, data);

    let playerSearch = searchResults[0];

    if(searchResults.length <= 0) {
      return yield call(handleSearchPlayerFailure);
    }
    //else if( searchResults.length === 1) {
    //  playerSearch = searchResults[0];
    //} else {
    //  yield put({ type: consts.SET_GAMER_TAG_SUGGESTIONS, data: searchResults });
    //}

    //const gamerTagIndex = yield take({ type: consts.SELECT_GAMER_TAG });
    //console.log('gamerTagIndex', gamerTagIndex);

    const playerCache = yield  select(state => state.playerCache);
    const memberId = playerSearch.membershipId;
    const cacheCheck = Object.keys(playerCache).indexOf(memberId) >= 0;

    const [ profile, playersCharacters ] = yield all([ call(fetchProfile, playerSearch), call(fetchCharacters, playerSearch) ]);
    const playerProfile = cacheCheck ? playerCache[memberId] : normalize.player(playerSearch, profile, playersCharacters);

    if(!cacheCheck) {
      playerCache[ memberId ] = playerProfile;
    }

    yield put({type: consts.SET_PLAYER_CACHE, data: playerCache});
    yield put({type: consts.SET_PLAYER_PROFILE, data: playerProfile});
    yield put({type: consts.FETCH_LOG, data: 'Player Profile Fetch Success'});

    yield call(collectNightfallData, playerProfile);
    yield call(collectRaidData, playerProfile);
  }
  catch(error) {
    //TODO: Remove error warn and store log files in s3 bucket or store errors in database.
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
    yield put({ type: consts.TOGGLE_PLAYER_SEARCH });
  }
}

function* collectActivityHistory(historyParam, queryParams={ page: 0, mode: 'raid', count: 250 }) {
  return yield call(fetchActivityHistory, historyParam, queryParams);
}

function* collectProfileCharacters(data) {
    yield call(fetchCharacters, data);
}

function* collectNightfallData(playerProfile) {
  try {

    const nfHistoryCache = yield  select(state => state.nfHistoryCache);
    const memberId = playerProfile.membershipId;
    const cacheCheck = Object.keys(nfHistoryCache).indexOf(memberId) >= 0;

    if(cacheCheck) {
      yield put({ type: consts.SET_NF_HISTORY, data: nfHistoryCache[memberId]});
    } else {
      const nfNormalActivities = yield all(
        [
          ...playerProfile.characterIds.map(curr => collectActivityHistory(playerProfile.characters[ curr ], {
            page: 0,
            mode: 46,
            count: 250
          })),
          ...playerProfile.characterIds.map(curr => collectActivityHistory(playerProfile.characters[ curr ], {
            page: 0,
            mode: 16,
            count: 250
          }))
        ]
      );

      const nfPrestigeActivities = yield all(
        [
          ...playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[ curr ], {
            page: 0,
            mode: 47,
            count: 250
          })),
          ...playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[ curr ], {
            page: 0,
            mode: 17,
            count: 250
          }))
        ]
      );

      const nfNormalData = nfNormalActivities.reduce((accum, data) => {
        accum = [ ...accum, ...data ];
        return accum;
      }, []);

      const nfPrestigeData = nfPrestigeActivities.reduce((accum, data) => {
        accum = [ ...accum, ...data ];
        return accum;
      }, []);

      const nightfallHistory = normalize.nightfall({ normal: nfNormalData, prestige: nfPrestigeData });

      nfHistoryCache[memberId] = nightfallHistory;

      yield put({ type: consts.SET_NF_HISTORY_CACHE, data: nfHistoryCache });
      yield put({ type: consts.SET_NF_HISTORY, data: nightfallHistory});
    }


    yield put({ type: consts.TOGGLE_LOADING });
    yield put({ type: consts.FETCH_LOG, data: `Nightfall data successfully collected`});
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `NightFall Data Fetch Error: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
  }
}

function* collectRaidData(playerProfile) {
  try {
    const raidHistoryCache = yield  select(state => state.raidHistoryCache);
    const memberId = playerProfile.membershipId;
    const cacheCheck = Object.keys(raidHistoryCache).indexOf(memberId) >= 0;

    if(cacheCheck) {
      yield put({type: consts.SET_RAID_HISTORY, data: raidHistoryCache[memberId]});

    } else {
      const raidData = yield all(
        playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[ curr ])),
      );

      if (Object.keys(raidData[ 0 ]).indexOf('error') >= 0) {
        yield put({type: consts.SET_PLAYER_PRIVACY, data: true});
      }

      const activityHistory = playerProfile.characterIds.reduce((accum, charId, idx) => {
        accum[ charId ] = [ ...raidData[ idx ] ];
        return accum;
      }, {});

      const raidHistory = normalize.raidHistory(activityHistory);

      raidHistoryCache[memberId] = raidHistory;

      yield put({ type: consts.SET_RAID_HISTORY_CACHE, data: raidHistoryCache });
      yield put({type: consts.SET_RAID_HISTORY, data: raidHistory});
    }

    yield put({ type: consts.FETCH_LOG, data: 'Raid Data Successfully Collected' });
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Raid Data Fetch Error: ${error}`});
    yield put({ type: consts.TOGGLE_LOADING });
  }
}

function* collectPGCR({ data }) {
  try {
    const pgcrCache = yield select(state => state.pgcrCache);

    if(pgcrCache[data]) {
      yield put({type: consts.SET_PGCR, data: pgcrCache[ data ]});
    }
    else {
      const pgcr = yield call(fetchPostGameCarnageReport, data);
      const normalizedPGCR = normalize.postGameCarnageReport(pgcr);
      pgcrCache[data] = normalizedPGCR;

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
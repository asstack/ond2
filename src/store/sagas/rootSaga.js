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

function* fetchPlayerProfile({ data }) {
  try {
    const searchResults = yield call(searchPlayer, data);
    const [profile, playersCharacters] = yield all([ call(fetchProfile, searchResults), call(fetchCharacters, searchResults)]);
    const playerProfile = normalize.player(searchResults, profile, playersCharacters);

    yield put({ type: consts.SET_PLAYER_PROFILE, data: playerProfile });
    yield put({ type: consts.FETCH_LOG, data: 'Player Profile Fetch Success' });

    const activityHistory = yield call(collectRaidData, playerProfile);
    const activityHashes = yield collectPublicMilestoneData();
    const raidHistory = normalize.raidHistory(activityHistory, activityHashes);
    yield put({ type: consts.SET_RAID_HISTORY, data: raidHistory});

    yield put({ type: consts.FETCH_LOG, data: 'Raid Data Successfully Collected' });
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`})
  }
}

function* collectProfileCharacters(data) {
    yield call(fetchCharacters, data);
}

function* collectRaidData(playerProfile) {
  try {
    const raidHistory = {};

    const activityHistories = yield all(
      playerProfile.characterIds.map(curr => call(fetchActivityHistory, playerProfile.characters[curr]))
    );

    playerProfile.characterIds.map(curr => {
      raidHistory[curr] = activityHistories.shift();
    });

    return raidHistory;
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Raid Data Fetch Error: ${error}`})
  }
}

function* collectPGCR({ data }) {
  try{
    const pgcr = yield call(fetchPostGameCarnageReport, data);
    const normalizedPGCR = normalize.postGameCarnageReport(pgcr);
    yield put({ type: consts.SET_PCGR, data: normalizedPGCR });
    yield put({ type: consts.FETCH_LOG, data: 'Post Game Carnage Report Fetch Success' });
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Error fetching report ${data}: ${error}`})
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
    console.log('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Error fetching public milestone data: ${error}`})
  }
}

function* watchProfileCharacters() {
  yield takeEvery(consts.FETCH_PROFILE_CHARACTERS, collectProfileCharacters);
  yield takeEvery(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
  yield takeEvery(consts.FETCH_PCGR, collectPGCR);
  yield takeEvery(consts.LOAD_PUBLIC_MILESTONE_DATA, collectPublicMilestoneData);
}

export default function* rootSaga() {
  yield all([
    watchProfileCharacters()
  ])
}
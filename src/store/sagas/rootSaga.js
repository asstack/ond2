import { call, put, takeEvery, all, fork } from 'redux-saga/effects';
import {
  searchPlayer,
  fetchProfile,
  fetchCharacters,
  fetchActivityHistory,
  fetchPostGameCarnageReport,
  fetchPublicMilestones
} from "../../services/destiny-services";
import { RAIDS } from "../../actions";
import * as consts from "../constants";
import normalize from '../normalize';

function* fetchPlayerProfile({ data }) {
  try {
    const publicMilestones = yield fetchPublicMilestones();
    yield all([
      normalize.challenges('NIGHTFALL', publicMilestones[RAIDS.NIGHTFALL.milestoneHash]),
      normalize.challenges('LEVIATHAN', publicMilestones[RAIDS.LEVIATHAN.milestoneHash])
    ]);

    const searchResults = yield call(searchPlayer, data);
    const [profile, playersCharacters] = yield all([ call(fetchProfile, searchResults), call(fetchCharacters, searchResults)]);
    const playerProfile = normalize.player(searchResults, profile, playersCharacters);

    yield put({ type: consts.SET_PLAYER_PROFILE, data: playerProfile });
    yield put({ type: consts.FETCH_LOG, data: 'Player Profile Fetch Success' });

    const activityHistory = yield call(collectRaidData, playerProfile);
    const raidHistory = normalize.raidHistory(activityHistory);
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

function* collectCarnageReport(referenceId) {
  try{
    yield fork(fetchPostGameCarnageReport, referenceId);
    yield put({ type: consts.FETCH_LOG, data: 'Post Game Carnage Report Fetch Success' });
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Error fetching report ${referenceId}: ${error}`})
  }
}

function* watchProfileCharacters() {
  yield takeEvery(consts.FETCH_PROFILE_CHARACTERS, collectProfileCharacters);
  yield takeEvery(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
}

export default function* rootSaga() {
  yield all([
    watchProfileCharacters()
  ])
}
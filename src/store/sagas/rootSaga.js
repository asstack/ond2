import { call, put, takeEvery, all, fork } from 'redux-saga/effects';
import {
  searchPlayer,
  fetchProfile,
  fetchCharacters,
  fetchActivityHistory,
  fetchPostGameCarnageReport
} from "../../services/destiny-services";
import * as consts from "../constants";
import normalize from '../normalize';

function* fetchPlayerProfile({ data }) {
  try {
    const searchResults = yield call(searchPlayer, data);
    const profile = yield call(fetchProfile, searchResults);
    const playersCharacters = yield call(fetchCharacters, searchResults);
    const playerProfile = normalize.player(searchResults, profile, playersCharacters);
    yield put({ type: consts.SET_PLAYER_PROFILE, data: profile });

    const activityHistory = yield call(collectRaidData, playerProfile);
    const raidHistory = normalize.raidHistory(activityHistory);
    yield put({ type: consts.SET_RAID_HISTORY, data: raidHistory});
    yield put({ type: consts.FETCH_LOG, data: 'Player Profile Fetch Success' });
  }
  catch(error) {
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`})
  }
}

function* collectProfileCharacters(data) {
    yield call(fetchCharacters, data);
}

function* collectRaidData(data) {
  try {
    const characters = data.characters;
    const raidHistory = {};

    const activityHistories = yield all(data.characterIds.map(curr => call(fetchActivityHistory, characters[curr])));

    data.characterIds.map(curr => {
      raidHistory[curr] = activityHistories.shift();
    });

    yield put({ type: consts.FETCH_LOG, data: 'Raid Data Successfully Collected' });
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
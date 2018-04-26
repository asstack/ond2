import { takeEvery, all } from 'redux-saga/effects';
import * as consts from "../constants";
import collectPGCR from './pgcrSaga';
import fetchPlayerProfile from './playerProfileSaga';
import collectPublicMilestoneData from './publicMilestoneSaga';

function* watchProfileCharacters() {
  yield takeEvery(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
  yield takeEvery(consts.FETCH_PGCR, collectPGCR);
  yield takeEvery(consts.LOAD_PUBLIC_MILESTONE_DATA, collectPublicMilestoneData);
}

export default function* rootSaga() {
  yield all([
    watchProfileCharacters()
  ])
}
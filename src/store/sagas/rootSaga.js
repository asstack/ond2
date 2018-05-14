import { takeEvery, all, call, put, spawn } from 'redux-saga/effects';
import * as consts from "../constants";
import collectPGCR from './pgcrSaga';
import fetchPlayerProfile from './playerProfileSaga';
import collectPublicMilestoneData from './publicMilestoneSaga';
import { fetchPublicMilestones } from "../../services/destiny-services";
import normalize from "../normalize";

function* watchProfileCharacters() {
  yield takeEvery(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
  yield takeEvery(consts.FETCH_PGCR, collectPGCR);
  yield takeEvery(consts.LOAD_PUBLIC_MILESTONE_DATA, collectPublicMilestoneData);
}

function* handleAppVersionCheck(appVersion) {
  yield put({ type: consts.SET_APP_VERSION, data: appVersion });
  const localVersion = localStorage.getItem('appVersion') || 0.0;
  const userUpdate = localStorage.getItem('userUpdate') || false;

  console.log('appVersion', appVersion);
  console.log('localVesion', localVersion);
  if(userUpdate) console.log('userUpdate', userUpdate);

  console.log('check', appVersion > localVersion);
  if(appVersion > localVersion && !userUpdate) {
    yield put({ type: consts.SET_UPDATE_PROMPT, data: true });
  } else {
    localStorage.setItem('appVersion', appVersion);
    localStorage.removeItem('userUpdate');
  }
}

function* getMilestoneData() {
  const data = yield call(fetchPublicMilestones);
  const milestones = normalize.milestoneData(data.milestones);
  yield put({ type: consts.SET_PUBLIC_MILESTONES, data: milestones });
  yield spawn(handleAppVersionCheck, data.appVersion);
}

export default function* rootSaga() {
  yield all([
    watchProfileCharacters(),
    getMilestoneData()
  ])
}
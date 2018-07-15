import { takeEvery, takeLatest, all, take, call, cancel, put, cancelled, spawn } from 'redux-saga/effects';
import * as consts from "../constants";
import collectPGCR from './pgcrSaga';
import fetchPlayerProfile from './playerProfileSaga';
import collectPublicMilestoneData from './publicMilestoneSaga';
import { fetchActivityUpdate, fetchPublicMilestones } from "../../services/destiny-services";
import normalize from "../normalize";
import { delay } from "redux-saga";
import collectActivityHistory from "./activityHistorySaga";

function* watchProfileCharacters() {
  yield takeLatest(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
  yield takeLatest(consts.SYNC_NEW_PLAYER_DATA, syncPlayerNewData);
  yield takeEvery(consts.FETCH_PGCR, collectPGCR);
  yield takeEvery(consts.LOAD_PUBLIC_MILESTONE_DATA, collectPublicMilestoneData);
}

function* syncPlayerNewData({ data }) {
  const {membershipId, delayMS} = data;
  try {
    console.log('params', data);
    let count = 0;
    let hasUpdate = false;

    console.log('membershipId', membershipId);
    console.log('delayMS', delayMS);
    while (count < 12 && !hasUpdate) {
      count += 1;
      yield delay(delayMS);
      hasUpdate = yield call(fetchActivityUpdate, membershipId);
    }
    yield spawn(collectActivityHistory, membershipId);
} finally {
    if(yield cancelled()) {
      console.log('cancel me... you bitch');
    }
  }
}

function* handleAppVersionCheck(appVersion) {
  yield put({ type: consts.SET_APP_VERSION, data: appVersion });
  const localVersion = localStorage.getItem('appVersion') || 0.0;
  const userUpdate = localStorage.getItem('userUpdate') || false;

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
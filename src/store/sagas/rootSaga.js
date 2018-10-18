import { takeEvery, takeLatest, all, select, call, cancel, put, cancelled, spawn } from 'redux-saga/effects';
import * as consts from "../constants";
import collectPGCR from './pgcrSaga';
import fetchPlayerProfile from './playerProfileSaga';
import collectPublicMilestoneData from './publicMilestoneSaga';
import { fetchActivityUpdate, fetchPublicMilestones } from "../../services/destiny-services";
import normalize from "../normalize";
import { delay } from "redux-saga";
import collectActivityHistory from "./activityHistorySaga";
import moment from "moment/moment";

function* watchProfileCharacters() {
  yield takeLatest(consts.FETCH_PLAYER_PROFILE, fetchPlayerProfile);
  yield takeLatest(consts.SYNC_NEW_PLAYER_DATA, syncPlayerNewData);
  yield takeLatest(consts.SCHEDULE_NEW_PLAYER_UPDATE, scheduleNewPlayerUpdate);
  yield takeEvery(consts.FETCH_PGCR, collectPGCR);
  yield takeEvery(consts.LOAD_PUBLIC_MILESTONE_DATA, collectPublicMilestoneData);
  yield takeEvery(consts.CALL_SET_ACTIVITY_HISTORY_CACHE, setActivityCache);
}

function* setActivityCache({ data }) {
  const { displayName, history } = data;
  const activityHistoryCache = yield select(state => state.activityHistoryCache);

  if(displayName) {
    const fiveMinutesFromNow = moment().add(5, 'm');
    activityHistoryCache[displayName.toLowerCase()] = {...history, expires: fiveMinutesFromNow};
    put({type: consts.SET_ACTIVITY_HISTORY_CACHE, data: activityHistoryCache});
  }
}

function* syncPlayerNewData({ data }) {
  const {membershipId, delayMS} = data;
  try {
    let count = 0;
    let hasUpdate = false;

    while (count < 12 && !hasUpdate) {
      count += 1;
      yield delay(delayMS);
      hasUpdate = yield call(fetchActivityUpdate, membershipId);
    }

} finally {
    if(yield cancelled()) {
    }else {
      const memId = yield select(state => state.playerProfile.membershipId);

      if(memId === membershipId) {
        yield spawn(collectActivityHistory, membershipId);
      }
    }
  }
}

function* scheduleNewPlayerUpdate({ data }) {
  const {membershipId, delayMS} = data;
  yield delay(delayMS);

  if(yield cancelled()) {
  } else {
    const memId = yield select(state => state.playerProfile.membershipId);

    if(memId === membershipId) {
      yield spawn(collectActivityHistory, membershipId);
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
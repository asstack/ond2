import { call, put } from 'redux-saga/effects';
import { fetchActivityHistory } from "../../services/destiny-services";
import { delay } from "redux-saga";
import { isObjectEmpty } from "../../services/utilities";
import normalize from "../normalize";
import * as consts from "../constants";

export default function* collectActivityHistory(membershipId) {
  let activityHistory = yield call(fetchActivityHistory, membershipId);
  let activityHistoryFetchAttempts = 0;


  while(activityHistoryFetchAttempts < 3 && isObjectEmpty(activityHistory)) {
    //TODO: Need to cancel this if a new player search is initiated. Don't want data to be overwritten
    console.log('delay for 3500');
    yield delay(3500);
    console.log('delay done');
    activityHistory = yield call(fetchActivityHistory, membershipId);
    console.log('activityHistory', activityHistory);
    activityHistoryFetchAttempts += 1;
    console.log('attempts', activityHistoryFetchAttempts);
  }

  console.log('out of while', activityHistory);
  if(!isObjectEmpty(activityHistory)) {
    yield put({type: consts.SET_NF_HISTORY, data: normalize.nightfall(activityHistory.nightfallHistory)});
    yield put({type: consts.SET_RAID_HISTORY, data: normalize.raidHistory(activityHistory.raidHistory)});
  }

  console.log('Shit we had issues');
  yield put({ type: consts.SET_LOADING, data: false });
}
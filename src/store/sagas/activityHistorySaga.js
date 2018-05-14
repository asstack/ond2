import moment from 'moment';
import { call, put, select, all } from 'redux-saga/effects';
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
   yield delay(3500);
   activityHistory = yield call(fetchActivityHistory, membershipId);
   console.log('activityHistory', activityHistory);
   activityHistoryFetchAttempts += 1;
   console.log('activityHistory fetch attempts', activityHistoryFetchAttempts);
 }

 if(!isObjectEmpty(activityHistory)) {
   const normalizedNF = normalize.nightfall(activityHistory.nightfallHistory);
   const normalizedRH = normalize.raidHistory(activityHistory.raidHistory);

   if (!isObjectEmpty(activityHistory)) {
     yield all([
       put({type: consts.SET_NF_HISTORY, data: normalizedNF}),
       put({type: consts.SET_RAID_HISTORY, data: normalizedRH})
     ]);
   } else {
     console.log('set error');
     yield put({type: consts.SET_SITE_ERROR, data: true});
   }

   const activityHistoryCache = yield select(state => state.activityHistoryCache);
   const fiveMinutesFromNow = moment().add(5, 'm');
   const normalizedActivityHistory = {
     nightfallHistory: normalizedNF,
     raidHistory: normalizedRH,
     expires: fiveMinutesFromNow
   };
   activityHistoryCache[ membershipId ] = normalizedActivityHistory;

   yield put({type: consts.SET_ACTIVITY_HISTORY_CACHE, data: activityHistoryCache});
   yield put({type: consts.SET_RAID_HISTORY, data: normalizedRH});
   yield put({type: consts.SET_NF_HISTORY, data: normalizedNF});
 } else {
    yield put({ type: consts.SET_SITE_ERROR, data: true });
 }

  yield put({ type: consts.SET_LOADING, data: false });
}
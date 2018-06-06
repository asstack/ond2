import moment from 'moment';
import { call, put, select, all, spawn } from 'redux-saga/effects';
import { fetchActivityHistory, fetchFallbackActivityHistory } from "../../services/destiny-services";
import { delay } from "redux-saga";
import normalize from "../normalize";
import * as consts from "../constants";

const isActivityData = (activity) => {
  return activity.length > 0;
};

const activityDataFound = ({ nightfallHistory={ normal: [], prestige: []}, raidHistory={ EOW: [], LEV: { normal: [], prestige: []}} }) =>
  (
    isActivityData(raidHistory.EOW) ||
    isActivityData(raidHistory.LEV.normal) ||
    isActivityData(raidHistory.LEV.prestige) ||
    isActivityData(nightfallHistory.normal) || isActivityData(nightfallHistory.prestige)
  );

export default function* collectActivityHistory(membershipId) {
  let activityHistory = yield call(fetchActivityHistory, membershipId);
  let activityHistoryFetchAttempts = 1;

  while(activityHistoryFetchAttempts < 3 && !activityDataFound(activityHistory)) {
   //TODO: Need to cancel this if a new player search is initiated. Don't want data to be overwritten
    yield delay(2000);
    const { characterIds, membershipType } = yield select(state => state.playerProfile);
    activityHistory = yield call(fetchFallbackActivityHistory, {membershipId, characterIds, membershipType});
    activityHistoryFetchAttempts += 1;
   }

   if(activityHistoryFetchAttempts === 1) {
      //Data exists, so we update behind the scenes. Call update in 10 seconds.
     console.log('Need to update data until lambda to auto update is done');
   }

 if(activityDataFound(activityHistory)) {
   const normalizedNF = normalize.nightfall(activityHistory.nightfallHistory);
   const normalizedRH = normalize.raidHistory(activityHistory.raidHistory);

   if (activityDataFound(activityHistory)) {
     yield all([
       put({type: consts.SET_NF_HISTORY, data: normalizedNF}),
       put({type: consts.SET_RAID_HISTORY, data: normalizedRH})
     ]);
   } else {
     yield put({type: consts.SET_SITE_ERROR, data: true});
   }

   const activityHistoryCache = yield select(state => state.activityHistoryCache);
   const fiveMinutesFromNow = moment().add(5, 'm');

   activityHistoryCache[ membershipId ] = {
        nightfallHistory: normalizedNF,
        raidHistory: normalizedRH,
        expires: fiveMinutesFromNow
      };

   yield put({type: consts.SET_ACTIVITY_HISTORY_CACHE, data: activityHistoryCache});
   yield put({type: consts.SET_RAID_HISTORY, data: normalizedRH});
   yield put({type: consts.SET_NF_HISTORY, data: normalizedNF});
 } else {
    yield put({ type: consts.SET_SITE_ERROR, data: true });
 }

  yield put({ type: consts.SET_LOADING, data: false });
}
import moment from 'moment';
import { call, put, select, all, spawn, cancel } from 'redux-saga/effects';
import { fetchActivityHistory, fetchActivityUpdate, fetchFallbackActivityHistory } from "../../services/destiny-services";
import { delay } from "redux-saga";
import normalize from "../normalize";
import * as consts from "../constants";

const isActivityData = (activity) => {
  return !!activity && activity.length > 0;
};

const activityDataFound = ({ nightfallHistory, raidHistory }) =>
  (
    isActivityData(raidHistory.EOW) ||
    isActivityData(raidHistory.LEV.normal) ||
    isActivityData(raidHistory.LEV.prestige) ||
    isActivityData(raidHistory.SPIRE.normal) ||
    isActivityData(nightfallHistory.normal) || isActivityData(nightfallHistory.prestige)
  );

const playerActivityUpdate = {};
const shouldUpdate = {};
let newSearch = false;

function* syncPlayerNewData(membershipId, delayMs) {
  let activityUpdateReady = false;
  let count = 0;

  while(true) {

    if(shouldUpdate[membershipId]) {
      yield delay(delayMs);

      if(shouldUpdate[membershipId]) {
        const hasUpdate = yield call(fetchActivityUpdate, membershipId);

        if ((hasUpdate || count >= 24) && shouldUpdate[membershipId]) {
          activityUpdateReady = true;
          yield spawn(fetchActivityHistory, membershipId);
          yield cancel();
        }
      }
    } else {
      yield cancel();
    }
  }
}

let previousMembershipId = false;

export default function* collectActivityHistory(membershipId) {

  if(previousMembershipId !== membershipId) {
    newSearch = true;
    shouldUpdate[membershipId] = true;

    if(previousMembershipId) {
      shouldUpdate[previousMembershipId] = false;
    }
  }

  let activityHistory = yield call(fetchActivityHistory, membershipId);
  let activityHistoryFetchAttempts = 1;

  while(activityHistoryFetchAttempts < 3 && !activityDataFound(activityHistory)) {
   //TODO: Need to cancel this if a new player search is initiated. Don't want data to be overwritten
    yield put({ type: consts.SET_NEW_PLAYER, data: true });
    yield delay(2000);
    const { characterIds, membershipType } = yield select(state => state.playerProfile);
    activityHistory = yield call(fetchFallbackActivityHistory, {membershipId, characterIds, membershipType});
    yield put({ type: consts.SET_NEW_PLAYER, data: false });
    activityHistoryFetchAttempts += 1;
   }

   if(!playerActivityUpdate[membershipId] && activityHistoryFetchAttempts === 1 && membershipId !== previousMembershipId) {
      //Data exists, so we update behind the scenes. Call update in 10 seconds.
     console.log('sync new player data');
     yield spawn(syncPlayerNewData, membershipId, 5000);
   }

   // Set current so we can compare to override 'fetching data updates'
  previousMembershipId = membershipId;

 if(activityDataFound(activityHistory)) {
   const normalizedNF = normalize.nightfall(activityHistory.nightfallHistory);
   const normalizedRH = normalize.raidHistory(activityHistory.raidHistory);
   const normalizedEP = {}; //normalize.epHistory(activityHistory.epHistory);

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
   yield put({type: consts.SET_EP_HISTORY, data: normalizedEP});
 } else {
    yield put({ type: consts.SET_SITE_ERROR, data: true });
 }

  yield put({ type: consts.SET_LOADING, data: false });
}
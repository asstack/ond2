import moment from 'moment';
import { call, put, select, all, spawn, cancel } from 'redux-saga/effects';
import { fetchActivityHistory, fetchActivityUpdate, fetchExactActivityHistory } from "../../services/destiny-services";
import { delay } from "redux-saga";
import normalize from "../normalize";
import * as consts from "../constants";
import collectQuickStats from "./quickStatsSaga";

const isActivityData = (activity) => {
  return !!activity && activity.length > 0;
};

const activityDataFound = (activityHistory) =>
  (
    isActivityData(activityHistory.EOW) ||
    isActivityData(activityHistory.LEV.normal) ||
    isActivityData(activityHistory.LEV.prestige) ||
    isActivityData(activityHistory.SPIRE.normal) ||
    isActivityData(activityHistory.NF.normal) ||
    isActivityData(activityHistory.NF.prestige)
  );

const playerActivityUpdate = {};
const shouldUpdate = {};
let newSearch = false;

function* syncPlayerNewData(membershipId, delayMs) {
  let count = 0;

  while(count < 12) {
    count += 1;

    if(shouldUpdate[membershipId]) {
      yield delay(delayMs);

      if(shouldUpdate[membershipId]) {
        const hasUpdate = yield call(fetchActivityUpdate, membershipId);

        if(hasUpdate && shouldUpdate[membershipId]) {
          yield spawn(collectActivityHistory, membershipId);
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

  let fetches = yield all([
    call(fetchExactActivityHistory, membershipId, 'spireOfStars'),
    call(fetchExactActivityHistory, membershipId, 'leviathan'),
    call(fetchExactActivityHistory, membershipId, 'eaterOfWorlds'),
    call(fetchExactActivityHistory, membershipId, 'nightfall'),
  ]);

  const [ spire, lev, eow, nf ] = fetches;
  const activityHistory = {
    SPIRE: { normal: spire.normal || [] },
    LEV: { normal: lev.normal || [], prestige: lev.prestige || [] },
    EOW: eow.normal || [],
    NF: { normal: nf.normal || [], prestige: nf.prestige || [] }
  };

  console.log('activityHistory', activityHistory);
  console.log('found? ', activityDataFound(activityHistory));

  // Send out multiple queries to get each "set" of data.
  if(activityDataFound(activityHistory)) {
    const {history, pgcrData} = normalize.activityHistory(activityHistory, membershipId);

    console.log('history', history);
    if (!activityDataFound({ ...history.raidHistory, NF: history.nightfallHistory })) {
      yield put({type: consts.SET_SITE_ERROR, data: true});
    }

    const normalizedNF = normalize.nightfall(history.nightfallHistory);
    const normalizedRH = normalize.raidHistory(history.raidHistory);
    const normalizedEP = {}; //normalize.epHistory(activityHistory.epHistory);
    const normalizedPGCR = pgcrData;

    yield all([
      put({type: consts.SET_NF_HISTORY, data: normalizedNF}),
      put({type: consts.SET_RAID_HISTORY, data: normalizedRH}),
      put({type: consts.SET_PGCR_HISTORY, data: normalizedPGCR})
    ]);

    const activityHistoryCache = yield select(state => state.activityHistoryCache);
    const pgcrCache = yield select(state => state.pgcrCache);
    const fiveMinutesFromNow = moment().add(5, 'm');

    activityHistoryCache[ membershipId ] = {
      nightfallHistory: normalizedNF,
      raidHistory: normalizedRH,
      expires: fiveMinutesFromNow
    };

    pgcrCache[ membershipId ] = pgcrData;

    yield all([
      put({type: consts.SET_ACTIVITY_HISTORY_CACHE, data: activityHistoryCache}),
      put({type: consts.SET_PGCR_CACHE, data: pgcrCache})
    ]);

    yield put({ type: consts.SET_LOADING, data: false });
    yield put({ type: consts.SET_QUICK_STATS, data: false });
    yield put({ type: consts.SET_NEW_PLAYER, data: false });
  } else {

    yield put({ type: consts.SET_NEW_PLAYER, data: true });
    const { characterIds, membershipType } = yield select(state => state.playerProfile);
    yield spawn(collectQuickStats, membershipId, characterIds, membershipType);
    // activityHistory = yield call(fetchFallbackActivityHistory, {membershipId, characterIds, membershipType});
  }

  if (membershipId !== previousMembershipId) {
    //Data exists, so we update behind the scenes. Call update in 10 seconds.
    console.log('sync new player data');
    yield spawn(syncPlayerNewData, membershipId, 5000);
  }
  previousMembershipId = membershipId;
}
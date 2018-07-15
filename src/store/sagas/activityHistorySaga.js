import moment from 'moment';
import { call, put, select, all, spawn } from 'redux-saga/effects';
import { fetchExactActivityHistory } from "../../services/destiny-services";
import normalize from "../normalize";
import * as consts from "../constants";
import { delay } from "redux-saga";
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

const shouldUpdate = {};
let newSearch = false;

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
    call(fetchExactActivityHistory, membershipId, 'characterActivities'),
  ]);

  const [ spire, lev, eow, nf, characterActivities ] = fetches;
  const activityHistory = {
    SPIRE: { normal: spire.normal || [] },
    LEV: { normal: lev.normal || [], prestige: lev.prestige || [] },
    EOW: eow.normal || [],
    NF: { normal: nf.normal || [], prestige: nf.prestige || [] },
    characterActivities: {}
  };

  if(!!characterActivities.characterOne) {activityHistory.characterActivities.characterOne = characterActivities.characterOne;}
  if(!!characterActivities.characterTwo) {activityHistory.characterActivities.characterTwo = characterActivities.characterTwo;}
  if(!!characterActivities.characterThree) {activityHistory.characterActivities.characterThree = characterActivities.characterThree;}

  // Send out multiple queries to get each "set" of data.
  if(activityDataFound(activityHistory)) {
    const {history, pgcrData } = normalize.activityHistory(activityHistory, membershipId);

    if (!activityDataFound({ ...history.raidHistory, NF: history.nightfallHistory })) {
      yield put({type: consts.SET_SITE_ERROR, data: true});
    }

    const normalizedNF = normalize.nightfall(history.nightfallHistory);
    const normalizedRH = normalize.raidHistory(history.raidHistory);
    // const normalizedEP = {}; //normalize.epHistory(activityHistory.epHistory);
    const normalizedPGCR = pgcrData;


    yield all([
      put({type: consts.SET_NF_HISTORY, data: normalizedNF}),
      put({type: consts.SET_RAID_HISTORY, data: normalizedRH}),
      put({type: consts.SET_PGCR_HISTORY, data: normalizedPGCR}),
      put({type: consts.SET_CHAR_ACTIVITIES, data: activityHistory.characterActivities})
    ]);

    const activityHistoryCache = yield select(state => state.activityHistoryCache);
    const pgcrCache = yield select(state => state.pgcrCache);
    const fiveMinutesFromNow = moment().add(5, 'm');

    activityHistoryCache[ membershipId ] = {
      nightfallHistory: normalizedNF,
      raidHistory: normalizedRH,
      characterActivities,
      expires: fiveMinutesFromNow
    };

    pgcrCache[ membershipId ] = pgcrData;

    yield all([
      put({type: consts.SET_ACTIVITY_HISTORY_CACHE, data: activityHistoryCache}),
      put({type: consts.SET_PGCR_CACHE, data: pgcrCache})
    ]);

    yield put({ type: consts.SET_QUICK_STATS, data: false });
    yield put({ type: consts.SET_NEW_PLAYER, data: false });
    yield delay(500);
    yield put({ type: consts.SET_LOADING, data: false });

  } else {

    yield put({ type: consts.SET_NEW_PLAYER, data: true });
    const { characterIds, membershipType } = yield select(state => state.playerProfile);
    yield spawn(collectQuickStats, membershipId, characterIds, membershipType);
    // activityHistory = yield call(fetchFallbackActivityHistory, {membershipId, characterIds, membershipType});
  }

  if (membershipId !== previousMembershipId) {
    //Data exists, so we update behind the scenes. Call update in 10 seconds.
    console.log('sync new player data');
    yield put({ type: consts.SYNC_NEW_PLAYER_DATA, data: { membershipId, delayMS: 3000 }});
  }
  previousMembershipId = membershipId;
}
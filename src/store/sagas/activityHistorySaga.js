import { call, put, select, all, spawn } from 'redux-saga/effects';
import { fetchExactActivityHistory, fetchFallbackActivityHistory } from "../../services/destiny-services";
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
    isActivityData(activityHistory.SPIRE.prestige) ||
    isActivityData(activityHistory.NF.normal) ||
    isActivityData(activityHistory.NF.prestige)
  );

let previousMembershipId = false;

const handleFirstRaid = function* (membershipId, activity) {
  const raid = yield call(fetchExactActivityHistory, membershipId, 'spireOfStars');
  const history = normalize.activity(activity, { normal: raid.normal, prestige: raid.prestige }, membershipId);

  const nf = normalize.nightfall(history.NF);
  const raids = normalize.raidHistory(history);



  const showNext = activityDataFound({ ...raids, NF: { normal: nf.normal, prestige: nf.prestige }});
  if(showNext) {
    yield all([
      put({type: consts.SET_NF_HISTORY, data: nf }),
      put({type: consts.SET_RAID_HISTORY, data: raids }),
      put({type: consts.SET_LOADING, data: false})
    ]);
    yield
  }
  return raid;
};

export default function* collectActivityHistory(membershipId, fallbackFetch = false) {

  //const spire = yield call(fetchExactActivityHistory, membershipId, 'spireOfStars');

  let spire, lev, eow, nf, characterActivities;

  if(fallbackFetch) {
    const playerProfile = yield select(state => state.playerProfile);
    const activityHistory = yield call(fetchFallbackActivityHistory, {
      membershipId: membershipId,
      characterIds: playerProfile.characterIds,
      membershipType: 1
    });

    console.log('activiityHistory', activityHistory);
    spire = activityHistory.raidHistory.SPIRE;
    lev = activityHistory.raidHistory.LEV;
    eow = activityHistory.raidHistory.EOW;
    nf = activityHistory.nightfallHistory;
    characterActivities = {
      characterOne: [],
      characterTwo: [],
      characterThree: []
    }

  } else {
    const fetches = yield all([
      call(handleFirstRaid, membershipId, 'SPIRE'),
      call(fetchExactActivityHistory, membershipId, 'leviathan'),
      call(fetchExactActivityHistory, membershipId, 'eaterOfWorlds'),
      call(fetchExactActivityHistory, membershipId, 'nightfall'),
      call(fetchExactActivityHistory, membershipId, 'characterActivities'),
    ]);

    [ spire, lev, eow, nf, characterActivities ] = fetches;
  }


  const activityHistory = {
    SPIRE: { normal: spire.normal || [], prestige: spire.prestige || []},
    LEV: { normal: lev.normal || [], prestige: lev.prestige || [] },
    EOW: { normal: eow.normal || [], prestige: eow.prestige || []},
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
    const playerProfile = yield select(state => state.playerProfile);
    console.log('playerProfile', playerProfile);
    const displayName = playerProfile ? playerProfile.displayName : '';

    //console.log('!#!#!#!#!#Set History', normalizedRH);
    yield all([
      put({type: consts.SET_NF_HISTORY, data: normalizedNF}),
      put({type: consts.SET_RAID_HISTORY, data: normalizedRH}),
      put({type: consts.SET_PGCR_HISTORY, data: normalizedPGCR}),
      put({type: consts.SET_CHAR_ACTIVITIES, data: activityHistory.characterActivities}),
      put({type: consts.CALL_SET_ACTIVITY_HISTORY_CACHE, data: { displayName, history: {raidHistory: normalizedRH, nightfallHistory: normalizedNF}}})
    ]);


    const pgcrCache = yield select(state => state.pgcrCache);
    pgcrCache[ membershipId ] = pgcrData;
    yield put({type: consts.SET_PGCR_CACHE, data: pgcrCache});

    yield put({ type: consts.SET_QUICK_STATS, data: false });
    yield put({ type: consts.SET_NEW_PLAYER, data: false });

    yield put({ type: consts.SET_LOADING, data: false });

    if (membershipId !== previousMembershipId && !activityDataFound(activityHistory)) {
      //Data exists, so we update behind the scenes. Call update in 10 seconds.
      yield put({ type: consts.SYNC_NEW_PLAYER_DATA, data: { membershipId, delayMS: 3000 }});
    }
    previousMembershipId = membershipId;

  } else {
    //const { characterIds, membershipType } = yield select(state => state.playerProfile);
    //yield spawn(collectQuickStats, membershipId, characterIds, membershipType);
    yield spawn(collectActivityHistory, membershipId, true);
    yield put({ type: consts.SCHEDULE_NEW_PLAYER_UPDATE, data: { membershipId, delayMS: 10000 }});
  }
}
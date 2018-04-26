import { call, put, all, select } from 'redux-saga/effects';
import normalize from "../normalize";
import * as consts from "../constants";
import collectActivityHistory from './activityHistorySaga';

export default function* collectNightfallData(playerProfile) {
  try {
    const nfHistoryCache = yield  select(state => state.nfHistoryCache);
    const memberId = playerProfile.membershipId;
    const cacheCheck = Object.keys(nfHistoryCache).indexOf(memberId) >= 0;

    if(cacheCheck) {
      yield put({ type: consts.SET_NF_HISTORY, data: nfHistoryCache[memberId]});
    } else {
      const nfNormalActivities = yield all([
        ...playerProfile.characterIds.map(curr => collectActivityHistory(playerProfile.characters[ curr ], {
          page: 0,
          mode: 46,
          count: 250
        })),
        ...playerProfile.characterIds.map(curr => collectActivityHistory(playerProfile.characters[ curr ], {
          page: 0,
          mode: 16,
          count: 250
        }))
      ]);

      const nfPrestigeActivities = yield all([
        ...playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[ curr ], {
          page: 0,
          mode: 47,
          count: 250
        })),
        ...playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[ curr ], {
          page: 0,
          mode: 17,
          count: 250
        }))
      ]);

      const nfNormalData = nfNormalActivities.reduce((accum, data) => {
        accum = [ ...accum, ...data ];
        return accum;
      }, []);

      const nfPrestigeData = nfPrestigeActivities.reduce((accum, data) => {
        accum = [ ...accum, ...data ];
        return accum;
      }, []);

      const nightfallHistory = normalize.nightfall({ normal: nfNormalData, prestige: nfPrestigeData });

      nfHistoryCache[memberId] = nightfallHistory;

      yield put({ type: consts.SET_NF_HISTORY_CACHE, data: nfHistoryCache });
      yield put({ type: consts.SET_NF_HISTORY, data: nightfallHistory});
    }


    yield put({ type: consts.SET_LOADING, data: false });
    yield put({ type: consts.FETCH_LOG, data: `Nightfall data successfully collected`});
  }
  catch(error) {
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `NightFall Data Fetch Error: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
  }
}
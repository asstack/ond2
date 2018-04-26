import { call, put, all, select } from 'redux-saga/effects';
import normalize from "../normalize";
import * as consts from "../constants";
import collectActivityHistory from './activityHistorySaga';

export default function* collectRaidData(playerProfile) {
  try {
    const raidHistoryCache = yield  select(state => state.raidHistoryCache);
    const memberId = playerProfile.membershipId;
    const cacheCheck = Object.keys(raidHistoryCache).indexOf(memberId) >= 0;

    if(cacheCheck) {
      yield put({type: consts.SET_RAID_HISTORY, data: raidHistoryCache[memberId]});
      yield put({ type: consts.SET_LOADING, data: false });

    } else {
      const raidData = yield all(
        playerProfile.characterIds.map(curr => call(collectActivityHistory, playerProfile.characters[ curr ])),
      );

      if (Object.keys(raidData[ 0 ]).indexOf('error') >= 0) {
        yield put({type: consts.SET_PLAYER_PRIVACY, data: true});
      }

      const activityHistory = playerProfile.characterIds.reduce((accum, charId, idx) => {
        accum[ charId ] = [ ...raidData[ idx ] ];
        return accum;
      }, {});

      const raidHistory = normalize.raidHistory(activityHistory);

      raidHistoryCache[memberId] = raidHistory;

      yield put({ type: consts.SET_RAID_HISTORY_CACHE, data: raidHistoryCache });
      yield put({type: consts.SET_RAID_HISTORY, data: raidHistory});
    }

    yield put({ type: consts.FETCH_LOG, data: 'Raid Data Successfully Collected' });
  }
  catch(error) {
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Raid Data Fetch Error: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
  }
}
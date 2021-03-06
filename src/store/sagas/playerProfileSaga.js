import moment from 'moment';
import { call, put, take, spawn, all, select } from 'redux-saga/effects';
import { searchPlayer } from "../../services/destiny-services";
import * as consts from "../constants";
import collectActivityHistory from './activityHistorySaga';
import collectProfile from './profileSaga';
import { getRaidResetData } from '../normalize';
function* handleSearchPlayerFailure() {
  yield put({ type: consts.SET_PLAYER_PROFILE, data: { notFound: true } });
  yield put({ type: consts.SET_LOADING, data: false });
}

function* clearSearchData() {

  const raidResetData = getRaidResetData(consts.RAID_RESET_DATA);
  yield put({ type: consts.SET_RAID_HISTORY, data: raidResetData });
  yield put({ type: consts.SET_NF_HISTORY, data: {} });
  yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: [] });
}

export default function* fetchPlayerProfile({ data }) {
  try {

    yield put({type: consts.SET_LOADING, data: true});
    yield put({type: consts.SET_GAMER_TAG_OPTIONS, data: []});
    let platform = yield select(state => state.platform);

    let displayName = data.displayName || '';
    displayName = displayName.toLowerCase() || '';


    const playerProfileCache = yield select(state => state.playerCache);

    let playerSearch = {};

    if(!(Object.keys(playerProfileCache).indexOf(displayName) >= 0)) {
      yield call(clearSearchData);
      yield put({type: consts.SET_PLAYER_PRIVACY, data: false});

      const searchResults = yield call(searchPlayer, data.displayName);

      if (searchResults.length <= 0) {
        return yield call(handleSearchPlayerFailure);
      }
      else if (searchResults.length === 1) {
        playerSearch = searchResults[ 0 ];
      } else if (platform !== 'false' && !!platform) {
        playerSearch.membershipId = platform;
      }
      else {
        yield put({type: consts.SET_LOADING, data: true});
        yield put({type: consts.SET_GAMER_TAG_OPTIONS, data: searchResults});
        yield put({type: consts.SET_LOADING, data: false});

        const searchSelection = yield take([ consts.SELECT_GAMER_TAG ]);
        yield put({type: consts.SET_GAMER_TAG_OPTIONS, data: []});
        yield put({type: consts.SET_LOADING, data: true});
        playerSearch = searchResults.filter(curr => curr.membershipId === searchSelection.data.key)[0];
        yield put({type: consts.SET_ID_HISTORY, data: searchSelection.data.key});
      }
    }

   const membershipId = playerSearch.membershipId;
   const playerProfileCacheCheck = Object.keys(playerProfileCache).indexOf(displayName) >= 0;

   if (playerProfileCacheCheck && !playerProfileCache[displayName].expires.isAfter(moment)) {
     yield put({type: consts.SET_PLAYER_PROFILE, data: playerProfileCache[displayName]});
   } else {
     yield call(collectProfile, membershipId);
   }

   const activityHistoryCache = yield select(state => state.activityHistoryCache);
   const pgcrCache = yield select(state => state.pgcrCache);
   const activityHistoryCacheCheck = Object.keys(activityHistoryCache).indexOf(displayName) >= 0;

   //const playersPGCR = pgcrCache[];put({type: consts.SET_PGCR_HISTORY, data: playersPGCR}),
    const playersActivityHistory = activityHistoryCache[displayName];

   if (activityHistoryCacheCheck && playersActivityHistory.expires.isAfter(moment())) {
     yield all([
       put({type: consts.SET_RAID_HISTORY, data: playersActivityHistory.raidHistory}),
       put({type: consts.SET_NF_HISTORY, data: playersActivityHistory.nightfallHistory}),
     ]);

     yield put({type: consts.SET_LOADING, data: false});
   } else {
     yield spawn(collectActivityHistory, membershipId);
   }
  }
  catch(error) {
    console.log('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
    yield put({ type: consts.SET_SITE_ERROR, data: true });
    yield put({ type: consts.TOGGLE_PLAYER_SEARCH });
  }
}
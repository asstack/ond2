import moment from 'moment';
import { call, put, take, spawn, select } from 'redux-saga/effects';
import { searchPlayer } from "../../services/destiny-services";
import * as consts from "../constants";
import collectActivityHistory from './activityHistorySaga';
import collectProfile from './profileSaga';

function* handleSearchPlayerFailure() {
  yield put({ type: consts.SET_PLAYER_PROFILE, data: { notFound: true } });
  yield put({ type: consts.SET_LOADING, data: false });
}

function* clearSearchData() {
  yield put({ type: consts.SET_RAID_HISTORY, data: {
    raidCount: {
      eow: {
        prestige: '0',
        normal: '0',
        successCount:  '0',
        farmCount: '0',
      },
      lev: {
        prestige: '0',
        normal: '0',
        successCount: {
          prestige: '0',
          normal: '0'
        },
        farmCount: {
          prestige: '0',
          normal: '0'
        }
      },
      spire: {
        prestige: '0',
        normal: '0',
        successCount: {
          prestige: '0',
          normal: '0'
        },
        farmCount: {
          prestige: '0',
          normal: '0'
        }
      }
  } } });
  yield put({ type: consts.SET_ACTIVITY_HISTORY, data: { normal: {}, prestige: {}, nfCount: { normal: 0, prestige: 0 } } });
  yield put({ type: consts.SET_NF_HISTORY, data: {} });
  yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: [] });
}

export default function* fetchPlayerProfile({ data }) {
  try {
    yield put({ type: consts.SET_LOADING, data: true });
    yield call(clearSearchData);
    yield put({ type: consts.SET_PLAYER_PRIVACY, data: false });

    const searchResults = yield call(searchPlayer, data);

    let playerSearch;

    if(searchResults.length <= 0) {
      return yield call(handleSearchPlayerFailure);
    }
    else if( searchResults.length === 1) {
     playerSearch = searchResults[0];
    }
    else {
      yield put({ type: consts.SET_LOADING, data: true });
      yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: searchResults });
      yield put({ type: consts.SET_LOADING, data: false });

      const searchSelection = yield take([consts.SELECT_GAMER_TAG]);
      yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: [] });
      yield put({ type: consts.SET_LOADING, data: true });
      playerSearch = searchResults.filter(curr => curr.membershipId === searchSelection.data.key)[0];
    }

    const membershipId = playerSearch.membershipId;

    const playerProfileCache = yield select(state => state.playerProfile);
    const playerProfileCacheCheck = Object.keys(playerProfileCache).indexOf(membershipId) >= 0;

    if(playerProfileCacheCheck && playerProfileCache[membershipId].expires.isAfter(moment)) {
      yield put({type: consts.SET_RAID_HISTORY, data: playerProfileCache[membershipId]});
    } else {
      yield spawn(collectProfile, membershipId);
    }

    const activityHistoryCache = yield select(state => state.activityHistoryCache);
    const activityHistoryCacheCheck = Object.keys(activityHistoryCache).indexOf(membershipId) >= 0;

    const playersActivityHistory = activityHistoryCache[membershipId];
    if(activityHistoryCacheCheck && playersActivityHistory.expires.isAfter(moment())) {
      console.log('servedFromCache');
      yield put({type: consts.SET_RAID_HISTORY, data: playersActivityHistory.raidHistory });
      yield put({type: consts.SET_NF_HISTORY, data: playersActivityHistory.nightfallHistory });
      yield put({ type: consts.SET_LOADING, data: false });
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
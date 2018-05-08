import { call, put, take, select, spawn } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import normalize from "../normalize";
import { fetchProfile, searchPlayer, fetchActivityHistory, fetchPublicMilestones } from "../../services/destiny-services";
import * as consts from "../constants";
import { isObjectEmpty } from "../../services/utilities";

function* handleSearchPlayerFailure() {
  yield put({ type: consts.SET_PLAYER_PROFILE, data: { notFound: true } });
  yield put({ type: consts.SET_LOADING, data: false });
}

function* clearSearchData() {
  yield put({ type: consts.SET_RAID_HISTORY, data: { raidCount: { eow: { normal: 0, prestige: 0 }, lev: { normal: 0, prestige: 0 } } } });
  yield put({ type: consts.SET_ACTIVITY_HISTORY, data: { normal: {}, prestige: {}, nfCount: { normal: 0, prestige: 0 } } });
  yield put({ type: consts.SET_NF_HISTORY, data: {} });
  yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: [] });
}

function* getMilestoneData() {
  const data = yield call(fetchPublicMilestones);
  const milestones = normalize.milestoneData(data);
  yield put({ type: consts.SET_PUBLIC_MILESTONES, data: milestones });
}

export default function* fetchPlayerProfile({ data }) {
  try {
    yield put({ type: consts.SET_LOADING, data: true });
    yield call(clearSearchData);
    yield put({ type: consts.SET_PLAYER_PRIVACY, data: false });

    const searchResults = yield call(searchPlayer, data);
    yield spawn(getMilestoneData);

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

      const searchSelection = yield take([consts.SELECT_GAMER_TAG]);
      yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: [] });
      playerSearch = searchResults.filter(curr => curr.membershipId === searchSelection.data.key)[0];
    }

    const playerCache = yield  select(state => state.playerCache);
    const membershipId = playerSearch.membershipId;
    const cacheCheck = Object.keys(playerCache).indexOf(membershipId) >= 0;

    const playerProfile = yield call(fetchProfile, membershipId);

    if(!cacheCheck) {
      playerCache[ membershipId ] = playerProfile;
    }

    yield put({type: consts.SET_PLAYER_CACHE, data: playerCache});
    yield put({type: consts.SET_PLAYER_PROFILE, data: playerProfile});
    yield put({type: consts.FETCH_LOG, data: 'Player Profile Fetch Success'});

    let activityHistory = yield call(fetchActivityHistory, membershipId);
    console.log('activityHistory', activityHistory);

    while(isObjectEmpty(activityHistory)) {
      console.log('delay for 3500');
      yield delay(3500);
      console.log('delay done');
      activityHistory = yield call(fetchActivityHistory, membershipId);
      console.log('activityHistory', activityHistory);
    }

    console.log('out of while', activityHistory);
    yield put({type: consts.SET_NF_HISTORY, data: normalize.nightfall(activityHistory.nightfallHistory)});
    yield put({type: consts.SET_RAID_HISTORY, data: normalize.raidHistory(activityHistory.raidHistory)});

    yield put({ type: consts.SET_LOADING, data: false });
  }
  catch(error) {
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
    yield put({ type: consts.TOGGLE_PLAYER_SEARCH });
  }
}
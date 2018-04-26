import { call, put, take, all, select } from 'redux-saga/effects';
import normalize from "../normalize";
import { fetchProfile, searchPlayer, fetchCharacters } from "../../services/destiny-services";
import collectNightfallData from './nightfallSaga';
import collectRaidData from './raidSaga';
import * as consts from "../constants";

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

      const searchSelection = yield take([consts.SELECT_GAMER_TAG]);
      yield put({ type: consts.SET_GAMER_TAG_OPTIONS, data: [] });
      playerSearch = searchResults.filter(curr => curr.membershipId === searchSelection.data.key)[0];
      yield put({ type: consts.SET_LOADING, data: false });
    }

    const playerCache = yield  select(state => state.playerCache);
    const memberId = playerSearch.membershipId;
    const cacheCheck = Object.keys(playerCache).indexOf(memberId) >= 0;

    const [ profile, playersCharacters ] = yield all([ call(fetchProfile, playerSearch), call(fetchCharacters, playerSearch) ]);
    const playerProfile = cacheCheck ? playerCache[memberId] : normalize.player(playerSearch, profile, playersCharacters);

    if(!cacheCheck) {
      playerCache[ memberId ] = playerProfile;
    }

    yield put({type: consts.SET_PLAYER_CACHE, data: playerCache});
    yield put({type: consts.SET_PLAYER_PROFILE, data: playerProfile});
    yield put({type: consts.FETCH_LOG, data: 'Player Profile Fetch Success'});

    yield call(collectNightfallData, playerProfile);
    yield call(collectRaidData, playerProfile);
  }
  catch(error) {
    //TODO: Remove error warn and store log files in s3 bucket or store errors in database.
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Player Profile Fetch Error: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
    yield put({ type: consts.TOGGLE_PLAYER_SEARCH });
  }
}
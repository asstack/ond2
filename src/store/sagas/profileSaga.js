import { call, put } from 'redux-saga/effects';
import { fetchProfile } from "../../services/destiny-services";
import * as consts from "../constants";

export default function* collectProfile(membershipId) {
  //const playerCache = yield  select(state => state.playerCache);
  //const cacheCheck = Object.keys(playerCache).indexOf(membershipId) >= 0;

  const playerProfile = yield call(fetchProfile, membershipId);

  //if(!cacheCheck) {
  //  playerCache[ membershipId ] = playerProfile;
  //}
  //
  //yield put({type: consts.SET_PLAYER_CACHE, data: playerCache});
  yield put({type: consts.SET_PLAYER_PROFILE, data: playerProfile});
  yield put({type: consts.FETCH_LOG, data: 'Player Profile Fetch Success'});
}
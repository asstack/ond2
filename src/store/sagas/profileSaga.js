import { call, put, select } from 'redux-saga/effects';
import { fetchProfile } from "../../services/destiny-services";
import * as consts from "../constants";
import moment from "moment/moment";

export default function* collectProfile(membershipId) {
  const playerProfileCache = yield  select(state => state.playerCache);

  const playerProfile = yield call(fetchProfile, membershipId);
  console.log('playerProfile', playerProfile);

  const fiveMinutesFromNow = moment().add(5, 'm');
  const profile = {...playerProfile, expires: fiveMinutesFromNow};
  playerProfileCache[membershipId] = profile;

  yield put({type: consts.SET_PLAYER_PROFILE, data: profile});
  yield put({ type: consts.SET_PLAYER_CACHE, data: playerProfileCache });
  yield put({type: consts.FETCH_LOG, data: 'Player Profile Fetch Success'});
}
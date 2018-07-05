import { call, put, select, all, spawn, cancel } from 'redux-saga/effects';
import fetchQuickHistory from '../../services/fetchQuickHistory';
import * as consts from "../constants";

function* collectQuickStats(membershipId, characterIds, membershipType) {

  const quickStats = yield call(fetchQuickHistory, {membershipId, characterIds, membershipType});
  const loading = yield select(state => state.loading);
  console.log('loading', loading);
  if(loading) {
    yield put({type: consts.SET_QUICK_STATS, data: quickStats});
  }
}

export default collectQuickStats;
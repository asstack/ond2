import { call, put, select, all, spawn, cancel } from 'redux-saga/effects';
import fetchQuickHistory from '../../services/fetchQuickHistory';
import * as consts from "../constants";

function* collectQuickStats(membershipId, characterIds, membershipType) {

  const quickStats = yield call(fetchQuickHistory, {membershipId, characterIds, membershipType});

}

export default collectQuickStats;
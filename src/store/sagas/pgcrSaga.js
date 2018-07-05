import { call, put, select } from 'redux-saga/effects';
import normalize from "../normalize";
import { fetchPostGameCarnageReport } from "../../services/destiny-services";
import * as consts from "../constants";

export default function* collectPGCR({ data }) {
  try {
    yield put({ type: consts.SET_LOADING, data: true });

    const pgcr = yield call(fetchPostGameCarnageReport, data);
    const normalizedPGCR = normalize.postGameCarnageReport(pgcr);

    yield put({ type: consts.SET_PGCR, data: normalizedPGCR });
    yield put({ type: consts.SET_LOADING, data: false });
    yield put({ type: consts.FETCH_LOG, data: 'Post Game Carnage Report Fetch Success' });
  }
  catch(error) {
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Error fetching report ${data}: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
  }
}
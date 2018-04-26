import { call } from 'redux-saga/effects';
import { fetchActivityHistory } from "../../services/destiny-services";

export default function* collectActivityHistory(historyParam, queryParams={ page: 0, mode: 'raid', count: 250 }) {
  return yield call(fetchActivityHistory, historyParam, queryParams);
}
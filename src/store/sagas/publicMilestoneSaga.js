import { call, put, select } from 'redux-saga/effects';
import { RAIDS } from "../../consts";
import { fetchPublicMilestones } from "../../services/destiny-services";
import normalize from "../normalize";
import * as consts from "../constants";

export default function* collectPublicMilestoneData() {
  try {
    const publicMilestones = yield select(state => state.publicMilestones);
    if(!publicMilestones) {
      const lev_msh = RAIDS.LEVIATHAN.milestoneHash;
      const nf_msh = RAIDS.NIGHTFALL.milestoneHash;

      const milestoneData = yield call(fetchPublicMilestones);
      const normalizedMilestones = normalize.milestoneData(milestoneData, {lev_msh, nf_msh});
      yield put({ type: consts.SET_PUBLIC_MILESTONES, data: normalizedMilestones });
      return normalizedMilestones;
    }
    return publicMilestones;
  }
  catch(error) {
    console.warn('error', error);
    yield put({ type: consts.FETCH_LOG, data: `Error fetching public milestone data: ${error}`});
    yield put({ type: consts.SET_LOADING, data: false });
  }
}
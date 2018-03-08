import { combineReducers } from 'redux';
import {
  FETCH_LOG,
  SET_PLAYER_PROFILE,
  SET_ACTIVITY_HISTORY,
  SET_RAID_HISTORY,
  SET_NF_HISTORY,
  SET_PGCR,
  SET_PGCR_HISTORY,
  SET_PUBLIC_MILESTONES
} from "../constants";

const fetchLogs = (state=[], action) =>
  action.type === FETCH_LOG ? [...state, action.data] : state;

const setPlayerProfile = (state={}, action) => {
  switch(action.type) {
    case SET_PLAYER_PROFILE:
      return Object.assign({}, state, action.data);

    case SET_ACTIVITY_HISTORY:
      return Object.assign({}, state, { characters: action.data });

    default:
      return state;
  }
};

const setRaidHistory = (state={}, action) => {
  if(action.type === SET_RAID_HISTORY) {
   return action.data;
  }
  return state;
};

const setPostGameCarnageReport = (state = false, action) => {
  if(action.type === SET_PGCR) {
    return action.data;
  }
  return state;
};

const setPGCRHistory = (state = {}, action) => {
  if(action.type === SET_PGCR_HISTORY) {
    return action.data;
  }
  return state;
};

const setPublicMilestones = (state = false, action) => {
  if(action.type === SET_PUBLIC_MILESTONES) {
    return action.data;
  }
  return state;
};

const setNightfallHistory = (state = false, action) => {
  if(action.type === SET_NF_HISTORY) {
    return action.data;
  }
  return state
};

const rootReducer = combineReducers({
  fetchLogs,
  playerProfile: setPlayerProfile,
  raidHistory: setRaidHistory,
  postGameCarnageReport: setPostGameCarnageReport,
  pgcrHistory: setPGCRHistory,
  publicMilestones: setPublicMilestones,
  nightfallHistory: setNightfallHistory
});

export default rootReducer;
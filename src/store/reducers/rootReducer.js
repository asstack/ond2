import { combineReducers } from 'redux';
import {
  FETCH_LOG,
  SET_PLAYER_PROFILE,
  SET_ACTIVITY_HISTORY,
  SET_RAID_HISTORY,
  SET_NF_HISTORY,
  SET_PGCR,
  SET_PUBLIC_MILESTONES,
  TOGGLE_LOADING,
  SET_PLAYER_PRIVACY,
  SET_VIEW_MODE,
  SET_VIEW_RAID,
  TOGGLE_PLAYER_SEARCH,
  SET_PGCR_CACHE,
  SET_NF_HISTORY_CACHE,
  SET_PLAYER_CACHE,
  SET_RAID_HISTORY_CACHE
} from "../constants";

const fetchLogs = (state=[], action) =>
  action.type === FETCH_LOG ? [...state, action.data] : state;

const setLoading = (state=false, action) => {
  return action.type === TOGGLE_LOADING ? !state : state;
};

const setPlayerSearch = (state=false, action) => {
  return action.type === TOGGLE_PLAYER_SEARCH ? !state : state;
};

const setPlayerProfile = (state=false, action) => {
  switch(action.type) {
    case SET_PLAYER_PROFILE:
      return Object.assign({ notFound: false }, action.data);

    case SET_ACTIVITY_HISTORY:
      return Object.assign({}, state, { characters: action.data });

    default:
      return state;
  }
};

const setRaidHistory = (state={ raidCount: { eow: { normal: 0, prestige: 0 }, lev: { normal: 0, prestige: 0 } } }, action) => {
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

const setPublicMilestones = (state = false, action) => {
  if(action.type === SET_PUBLIC_MILESTONES) {
    return action.data;
  }
  return state;
};

const setNightfallHistory = (state = { normal: {}, prestige: {}, nfCount: { normal: 0, prestige: 0 } }, action) => {
  if(action.type === SET_NF_HISTORY) {
    return action.data;
  }
  return state
};

const setPlayerPrivacy = (state = false, action) => {
  if(action.type === SET_PLAYER_PRIVACY) {
    return action.data;
  }
  return state;
};

const setViewMode = (state = 'prestige', action) => {
  if(action.type === SET_VIEW_MODE) {
    return action.data;
  }
  return state;
};

const setViewRaid = (state = 'nf', action) => {
  if(action.type === SET_VIEW_RAID) {
    return action.data;
  }
  return state;
};

const setPGCRCache = (state = {}, action) => {
  if(action.type === SET_PGCR_CACHE) {
    return action.data;
  }
  return state;
};

const setNFHistoryCache = (state = {}, action) => {
  if(action.type === SET_NF_HISTORY_CACHE) {
    return action.data;
  }
  return state;
};

const setRaidHistoryCache = (state = {}, action) => {
  if(action.type === SET_RAID_HISTORY_CACHE) {
    return action.data;
  }
  return state;
};

const setPlayerCache = (state = {}, action) => {
  if(action.type === SET_PLAYER_CACHE) {
    return action.data;
  }
  return state;
};

const rootReducer = combineReducers({
  fetchLogs,
  playerProfile: setPlayerProfile,
  raidHistory: setRaidHistory,
  postGameCarnageReport: setPostGameCarnageReport,
  publicMilestones: setPublicMilestones,
  nightfallHistory: setNightfallHistory,
  loading: setLoading,
  playerPrivacy: setPlayerPrivacy,
  viewMode: setViewMode,
  viewRaid: setViewRaid,
  newPlayerSearch: setPlayerSearch,
  pgcrCache: setPGCRCache,
  nfHistoryCache: setNFHistoryCache,
  raidHistoryCache: setRaidHistoryCache,
  playerCache: setPlayerCache
});

export default rootReducer;
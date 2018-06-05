import { combineReducers } from 'redux';
import {
  FETCH_LOG,
  SET_PLAYER_PROFILE,
  SET_ACTIVITY_HISTORY,
  SET_RAID_HISTORY,
  SET_NF_HISTORY,
  SET_PGCR,
  SET_PUBLIC_MILESTONES,
  SET_LOADING,
  SET_PLAYER_PRIVACY,
  SET_ACTIVITY_TYPE,
  SET_VIEW_MODE,
  SET_VIEW_RAID,
  TOGGLE_PLAYER_SEARCH,
  SET_PGCR_CACHE,
  SET_ACTIVITY_HISTORY_CACHE,
  SET_PLAYER_CACHE,
  SET_GAMER_TAG_OPTIONS,
  SELECT_GAMER_TAG,
  SET_SITE_ERROR, SET_CACHE_TIMEOUT, SET_APP_VERSION, SET_UPDATE_PROMPT, SET_RAID_VIEW_Y_OFFSET
} from "../constants";

// TODO: Need to break this into smaller files.
const fetchLogs = (state=[], action) =>
  action.type === FETCH_LOG ? [...state, action.data] : state;

const setCacheTimeOut = (state = false, action) => action.type === SET_CACHE_TIMEOUT ? action.data : state;

const setLoading = (state=false, action) => {
  return action.type === SET_LOADING ? action.data : state;
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

const setRaidHistory = (state={
  raidCount:
    { eow: { normal: 0, prestige: 0 },
      lev: { normal: 0, prestige: 0 },
      spire: { normal: 0, prestige: 0 }
    }
  }, action) => {
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

const setPublicMilestones = (state = [], action) => {
  if(action.type === SET_PUBLIC_MILESTONES) {
    return action.data;
  }
  return state;
};

const setNightfallHistory = (state ={ normal: {}, prestige: {}, nfCount: { normal: 0, prestige: 0 } }, action) => {
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

const setViewMode = (state = 'normal', action) => {
  if(action.type === SET_VIEW_MODE) {
    return action.data;
  }
  return state;
};

const setViewRaid = (state = 'spire', action) => {
  if(action.type === SET_VIEW_RAID) {
    return action.data;
  }
  return state;
};

const setGamerTagOptions = (state = [], action) => {
  if(action.type === SET_GAMER_TAG_OPTIONS) {
    return action.data;
  }
  return state;
};

const selectGamerTag = (state = '', action) => {
  if(action.type === SELECT_GAMER_TAG) {
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

const setActivityHistoryCache = (state = {}, action) => {
  if(action.type === SET_ACTIVITY_HISTORY_CACHE) {
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

const setAppVersion = (state='1.0.0', action) => {
  if(action.type === SET_APP_VERSION) {
    return action.data;
  }
  return state;
};

const setUpdatePrompt = (state = false, action) => {
  if(action.type === SET_UPDATE_PROMPT) {
    return action.data;
  }
  return state;
};

const setSiteError = (state = false, action) => {
  if(action.type === SET_SITE_ERROR) {
    return action.data;
  }
  return state;
};

const setRaidViewYOffset = (state=0, action) => {
  if(action.type === SET_RAID_VIEW_Y_OFFSET) {
    return action.data;
  }
  return state;
};

const setActivityType = (state='raid', action) => {
  if(action.type === SET_ACTIVITY_TYPE) {
    return action.data;
  }
  return state;
};

const rootReducer = combineReducers({
  fetchLogs,
  cacheTimeout: setCacheTimeOut,
  playerProfile: setPlayerProfile,
  raidHistory: setRaidHistory,
  postGameCarnageReport: setPostGameCarnageReport,
  publicMilestones: setPublicMilestones,
  nightfallHistory: setNightfallHistory,
  loading: setLoading,
  playerPrivacy: setPlayerPrivacy,
  activityType: setActivityType,
  viewMode: setViewMode,
  viewRaid: setViewRaid,
  newPlayerSearch: setPlayerSearch,
  pgcrCache: setPGCRCache,
  activityHistoryCache: setActivityHistoryCache,
  playerCache: setPlayerCache,
  gamerTagOptions: setGamerTagOptions,
  selectedGamerTag: selectGamerTag,
  siteError: setSiteError,
  appVersion: setAppVersion,
  showUpdatePrompt: setUpdatePrompt,
  raidViewYOffset: setRaidViewYOffset
});

export default rootReducer;
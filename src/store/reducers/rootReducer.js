import { combineReducers } from 'redux';
import { FETCH_LOG, SET_PLAYER_PROFILE, SET_ACTIVITY_HISTORY, SET_RAID_HISTORY } from "../constants";

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
   return action.data
  }
  return state;
};

const rootReducer = combineReducers({
  fetchLogs,
  playerProfile: setPlayerProfile,
  raidHistory: setRaidHistory
});

export default rootReducer;
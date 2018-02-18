
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {})
}

export const FETCH_LOG = 'FETCH_LOG';

export const SET_PLAYER_PROFILE = 'set_player_profile';
export const SET_ACTIVITY_HISTORY = 'set_activity_history';

export const SET_RAID_HISTORY = 'set_raid_history';

export const FETCH_PLAYER_PROFILE = createRequestTypes('PROFILE');
export const FETCH_PROFILE_CHARACTERS = 'fetch_profile_characters';

const action = (type, payload = {}) => ({type, ...payload});

console.log('createRequest', createRequestTypes('USER'));
// const searchDestinyPlayer = ({ displayName, membershipType }) => `${apiType.destiny2}/SearchDestinyPlayer/${membershipType}/${displayName}/`;



const activityModes = {
  0: 'none',
  2: 'Story',
  3: 'Strike',
  4: 'Raid',
  5: 'allPvP',
  6: 'patrol',
  7: 'allPvE',
  10: 'control'
};
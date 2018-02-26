
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

// TODO: Need Class Race and Gender Hash
export const CLASS_MAP = {
    3655393761: 'Titan',
    671679327: 'Hunter',
    2271682572: 'Warlock',
};

export const LEVIATHAN_IMAGE = require('../images/leviathan.jpg');
export const EATER_OF_WORLDS_IMAGE = require('../images/eater_of_worlds.jpg');

export const EATER_OF_WORLDS_LAUNCH_WEEK = '2017-12-08T18:00:00.000Z';
export const LEVIATHAN_LAUNCH_WEEK = '2017-09-12T17:00:00.000Z';

 export const EATER_OF_WORLDS = {
   hashId: 809170886,
   raidName: 'Eater of Worlds',
   boss: 'Argos',
   image: EATER_OF_WORLDS_IMAGE,
   launchTime: EATER_OF_WORLDS_LAUNCH_WEEK,
   versions: [
     {
       activityHashes : [ 3089205900 ],
       displayValue : 'Normal',
     },
     {
       activityHashes: [2164432138],
       displayValue: 'Guided Games',
     },
     {
       activityHashes: [809170886],
       displayValue: 'Prestige',
     }
   ]
 };

 export const LEVIATHAN = {
   raidName: 'Leviathan',
   boss: 'Calus',
   image: LEVIATHAN_IMAGE,
   launchTime: LEVIATHAN_LAUNCH_WEEK,
   versions: [
     {
       activityHashes: [417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661],
       displayValue: 'Prestige',
     },
     {
       activityHashes: [2693136600, 2693136601, 2693136602, 2693136603, 2693136604, 2693136605],
       displayValue: 'Normal',
     },
     {
       activityHashes: [89727599, 287649202, 1699948563, 1875726950, 3916343513, 4039317196],
       displayValue: 'Guided Games',
     }
   ],
 };

export const RAIDS = [EATER_OF_WORLDS, LEVIATHAN];

export const activityModes = {
  0: 'none',
  2: 'Story',
  3: 'Strike',
  4: 'Raid',
  5: 'allPvP',
  6: 'patrol',
  7: 'allPvE',
  10: 'control'
};
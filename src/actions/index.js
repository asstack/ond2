
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

// TODO: Need Class Race and Gender Hash
export const CLASS_MAP = {
    3655393761: 'Titan',
    671679327: 'Hunter',
    2271682572: 'Warlock',
};

export const destinyBaseURL = 'https://www.bungie.net';
export const LEVIATHAN_IMAGE = `${destinyBaseURL}/img/destiny_content/pgcr/raid_gluttony.jpg`;
export const EATER_OF_WORLDS_IMAGE = `${destinyBaseURL}/img/destiny_content/pgcr/raids_leviathan_eater_of_worlds.jpg`;

export const EATER_OF_WORLDS_LAUNCH_WEEK = '2017-12-08';
export const LEVIATHAN_LAUNCH_WEEK = '2017-09-12';

 export const EATER_OF_WORLDS = {
   hashId: 809170886,
   raidName: 'Eater of Worlds',
   boss: 'Argos',
   image: EATER_OF_WORLDS_IMAGE,
   launchDate: EATER_OF_WORLDS_LAUNCH_WEEK,
   activityHashes: [3089205900, 2164432138, 809170886],
   versions: [
     {
       activityHashes : [3089205900],
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
   launchDate: LEVIATHAN_LAUNCH_WEEK,
   activityHashes: [
     417231112, 757116822, 1685065161, 2449714930, 3446541099,
     3879860661, 2693136600, 2693136601, 2693136602, 2693136603,
     2693136604, 2693136605, 89727599, 287649202, 1699948563,
     1875726950, 3916343513, 4039317196],
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
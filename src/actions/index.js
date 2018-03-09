
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

export const LOAD_PUBLIC_MILESTONE_DATA = 'load_public_milestone_data';

export const SET_RAID_HISTORY = 'set_raid_history';

export const FETCH_PLAYER_PROFILE = createRequestTypes('PROFILE');
export const FETCH_PROFILE_CHARACTERS = 'fetch_profile_characters';
export const FETCH_PGCR = 'fetch_pgcr';

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

export const tier = {
  0: 'Normal',
  1: 'Guided Games',
  2: 'Prestige',
  normal: 0,
  guidedGames: 1,
  prestige: 2
};

export const NF_HASHES = {
    373475104: {
      "description": "Help Osiris cut back an out-of-control Vex Mind.",
      "name": "Nightfall: A Garden World",
      "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/62bfc4d00ed8e415e6bf02e56a0907de.png",
      "releaseTime": 0,
      "activityLevel": 27,
      "completionUnlockHash": 0,
      "activityLightLevel": 270,
      "destinationHash": 1993421442,
      "placeHash": 1259908504,
      "activityTypeHash": 575572995,
      "tier": 1,
      "pgcrImage": "/img/destiny_content/pgcr/rituals_a_garden_world.jpg",
      "directActivityModeHash": 547513715,
      "directActivityModeType": 46,
      "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
      "activityModeTypes": [ 46, 18, 7 ]
    },
    642256373: {
      "description": "Purge the Fallen infestation of the Exodus Black.",
        "name": "Nightfall: Exodus Crash",
        "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
        "hasIcon": true,
        "releaseIcon": "/img/misc/missing_icon_d2.png",
        "releaseTime": 0,
        "activityLevel": 27,
        "completionUnlockHash": 0,
        "activityLightLevel": 270,
        "destinationHash": 126924919,
        "placeHash": 3526908984,
        "activityTypeHash": 575572995,
        "tier": 1,
        "pgcrImage": "/img/destiny_content/pgcr/strike_exodus_crash.jpg",
        "directActivityModeHash": 547513715,
        "directActivityModeType": 46,
        "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
        "activityModeTypes": [ 46, 18, 7 ]
    },
    642277473: {
      "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm.",
      "name": "Nightfall: The Pyramidion",
      "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "releaseTime": 0,
      "activityLevel": 27,
      "completionUnlockHash": 0,
      "activityLightLevel": 270,
      "destinationHash": 2218917881,
      "placeHash": 4251857532,
      "activityTypeHash": 575572995,
      "tier": 1,
      "pgcrImage": "/img/destiny_content/pgcr/strike_the_pyramdion.jpg",
      "directActivityModeHash": 547513715,
      "directActivityModeType": 46,
      "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
      "activityModeTypes": [ 46, 18, 7 ]
    },
    989294159: {
      "description": "Contain a rampant army of Red Legion within the Infinite Forest.",
      "name": "Nightfall: Tree of Probabilities",
      "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/62bfc4d00ed8e415e6bf02e56a0907de.png",
      "releaseTime": 0,
      "activityLevel": 27,
      "completionUnlockHash": 0,
      "activityLightLevel": 270,
      "destinationHash": 1993421442,
      "placeHash": 1259908504,
      "activityTypeHash": 575572995,
      "tier": 1,
      "pgcrImage": "/img/destiny_content/pgcr/rituals_tree_of_probabilities.jpg",
      "directActivityModeHash": 547513715,
      "directActivityModeType": 46,
      "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
      "activityModeTypes": [ 46, 18, 7 ]
    },
    1863334927: {
      "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams.",
      "name": "Nightfall: Savathûn's Song",
      "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "releaseTime": 0,
      "activityLevel": 27,
      "completionUnlockHash": 0,
      "activityLightLevel": 270,
      "destinationHash": 2388758973,
      "placeHash": 386951460,
      "activityTypeHash": 575572995,
      "tier": 1,
      "pgcrImage": "/img/destiny_content/pgcr/strike_savanthuns_song.jpg",
      "directActivityModeHash": 547513715,
      "directActivityModeType": 46,
      "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
      "activityModeTypes": [ 46, 18, 7 ]
    },
    2046332536: {
      "description": "Contain a rampant army of Red Legion within the Infinite Forest.",
      "name": "Nightfall: Tree of Probabilities",
      "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/62bfc4d00ed8e415e6bf02e56a0907de.png",
      "releaseTime": 0,
      "activityLevel": 27,
      "completionUnlockHash": 0,
      "activityLightLevel": 270,
      "destinationHash": 1993421442,
      "placeHash": 1259908504,
      "activityTypeHash": 575572995,
      "tier": 1,
      "pgcrImage": "/img/destiny_content/pgcr/rituals_tree_of_probabilities.jpg",
      "directActivityModeHash": 547513715,
      "directActivityModeType": 46,
      "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
      "activityModeTypes": [ 46, 18, 7 ]
    },
    3920643231: {
      "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion.",
      "name": "Nightfall: The Arms Dealer",
      "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "releaseTime": 0,
      "activityLevel": 27,
      "completionUnlockHash": 0,
      "activityLightLevel": 270,
      "destinationHash": 1199524104,
      "placeHash": 3747705955,
      "activityTypeHash": 575572995,
      "tier": 1,
      "pgcrImage": "/img/destiny_content/pgcr/strike_the_arms_dealer.jpg",
      "directActivityModeHash": 547513715,
      "directActivityModeType": 46,
      "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
      "activityModeTypes": [ 46, 18, 7 ]
    },
    4054968718: {
    "description": "End the Red Legion expedition that has ripped open the planet's surface.",
    "name": "Nightfall: The Inverted Spire",
    "icon": "/common/destiny2_content/icons/c9d32f40b3a02374dd26b45c702b959a.png",
    "hasIcon": true,
    "releaseIcon": "/img/misc/missing_icon_d2.png",
    "releaseTime": 0,
    "activityLevel": 27,
    "completionUnlockHash": 0,
    "activityLightLevel": 270,
    "destinationHash": 126924919,
    "placeHash": 3526908984,
    "activityTypeHash": 575572995,
    "tier": 1,
    "pgcrImage": "/img/destiny_content/pgcr/strike_inverted_spire.jpg",
    "directActivityModeHash": 547513715,
    "directActivityModeType": 46,
    "activityModeHashes": [ 547513715, 2394616003, 1164760493 ],
    "activityModeTypes": [ 46, 18, 7 ]
    },
    585071442: {
      "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams.",
      "name": "Nightfall: Savathûn's Song",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 30,
      "activityLightLevel": 330,
      "destinationHash": 2388758973,
      "placeHash": 386951460,
      "activityTypeHash": 575572995,
      "tier": 2,
      "pgcrImage": "/img/destiny_content/pgcr/strike_savanthuns_song.jpg",
      "directActivityModeHash": 1350109474,
      "directActivityModeType": 17,
      "activityModeHashes": [ 1350109474, 2394616003, 1164760493 ],
      "activityModeTypes": [ 17, 18, 7 ],
    },
    601540706: {
      "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion.",
      "name": "Nightfall: The Arms Dealer",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 30,
      "activityLightLevel": 330,
      "destinationHash": 1199524104,
      "placeHash": 3747705955,
      "activityTypeHash": 575572995,
      "tier": 2,
      "pgcrImage": "/img/destiny_content/pgcr/strike_the_arms_dealer.jpg",
      "directActivityModeHash": 1350109474,
      "directActivityModeType": 17,
      "activityModeHashes": [ 1350109474, 2394616003, 1164760493 ],
      "activityModeTypes": [ 17, 18, 7 ],
    },
    1129066976: {
      "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm.",
      "name": "Nightfall: The Pyramidion",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 30,
      "activityLightLevel": 330,
      "destinationHash": 2218917881,
      "placeHash": 4251857532,
      "activityTypeHash": 575572995,
      "tier": 2,
      "pgcrImage": "/img/destiny_content/pgcr/strike_the_pyramdion.jpg",
      "directActivityModeHash": 1350109474,
      "directActivityModeType": 17,
      "activityModeHashes": [ 1350109474, 2394616003, 1164760493 ],
      "activityModeTypes": [ 17, 18, 7 ],
    },
    1792985204: {
      "description": "Purge the Fallen infestation of the Exodus Black.",
      "name": "Nightfall: Exodus Crash",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 30,
      "activityLightLevel": 330,
      "destinationHash": 2218917881,
      "placeHash": 4251857532,
      "activityTypeHash": 575572995,
      "tier": 2,
      "pgcrImage": "/img/destiny_content/pgcr/strike_exodus_crash.jpg",
      "directActivityModeHash": 1350109474,
      "directActivityModeType": 17,
      "activityModeHashes": [ 1350109474, 2394616003, 1164760493 ],
      "activityModeTypes": [ 17, 18, 7 ]
    },
    2416546450: {
          description: "Contain a rampant army of Red Legion within the Infinite Forest.",
          name: "Nightfall: Tree of Probabilities",
          icon: "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
          hasIcon: true,
          releaseIcon: "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
          activityLightLevel: 330,
          tier: 2,
          pgcrImage: "/img/destiny_content/pgcr/rituals_tree_of_probabilities.jpg",
          modifiers: [
            {"activityModifierHash": 3215384520},
            {"activityModifierHash": 2558957669},
            {"activityModifierHash": 3362074814},
            {"activityModifierHash": 945795273},
            {"activityModifierHash": 3029674484}
          ],
          minParty: 1,
          maxParty: 3,
          maxPlayers: 3,
          requiresGuardianOath: false,
          directActivityModeHash: 1350109474,
          directActivityModeType: 17,
          activityModeHashes: [ 1350109474, 2394616003, 1164760493 ],
          activityModeTypes: [ 17, 18, 7 ]
        },
    2688061647: {
      "description": "Help Osiris cut back an out-of-control Vex Mind.",
      "name": "Nightfall: A Garden World",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 30,
      "activityLightLevel": 330,
      "destinationHash": 1993421442,
      "placeHash": 1259908504,
      "activityTypeHash": 575572995,
      "tier": 2,
      "pgcrImage": "/img/destiny_content/pgcr/rituals_a_garden_world.jpg",
      "directActivityModeHash": 1350109474,
      "directActivityModeType": 17,
      "activityModeHashes": [ 1350109474, 2394616003, 1164760493 ],
      "activityModeTypes": [ 17, 18, 7 ]
    },
    3050465729: {
      "description": "End the Red Legion expedition that has ripped open the planet's surface.",
      "name": "Nightfall: The Inverted Spire",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 30,
      "activityLightLevel": 330,
      "destinationHash": 126924919,
      "placeHash": 3526908984,
      "activityTypeHash": 575572995,
      "tier": 2,
      "pgcrImage": "/img/destiny_content/pgcr/strike_inverted_spire.jpg",
      "directActivityModeHash": 1350109474,
      "directActivityModeType": 17,
      "activityModeHashes": [ 1350109474, 2394616003, 1164760493 ],
      "activityModeTypes": [ 17, 18, 7 ]
    },
    145302664: {
      "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion.",
      "name": "Nightfall: The Arms Dealer",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "activityLevel": 27,
      "activityLightLevel": 270,
      "destinationHash": 1199524104,
      "placeHash": 3747705955,
      "activityTypeHash": 575572995,
      "tier": 0,
      "pgcrImage": "/img/destiny_content/pgcr/strike_the_arms_dealer.jpg",
      "modifiers": [
        {"activityModifierHash": 3029674484}
      ],
      "directActivityModeHash": 3789021730,
      "directActivityModeType": 16,
      "activityModeHashes": [ 3789021730, 2394616003, 1164760493 ],
      "activityModeTypes": [ 16, 18, 7 ]
    },
    926940962: {
      "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm.",
      "name": "Nightfall: The Pyramidion",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "activityLevel": 27,
      "activityLightLevel": 270,
      "destinationHash": 2218917881,
      "placeHash": 4251857532,
      "activityTypeHash": 575572995,
      "tier": 0,
      "pgcrImage": "/img/destiny_content/pgcr/strike_the_pyramdion.jpg",
      "directActivityModeHash": 3789021730,
      "directActivityModeType": 16,
      "activityModeHashes": [ 3789021730, 2394616003, 1164760493 ],
      "activityModeTypes": [ 16, 18, 7 ],
    },
    1357019430: {
      "description": "Purge the Fallen infestation of the Exodus Black.",
      "name": "Nightfall: Exodus Crash",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "activityLevel": 27,
      "activityLightLevel": 270,
      "destinationHash": 126924919,
      "placeHash": 3526908984,
      "activityTypeHash": 575572995,
      "tier": 0,
      "pgcrImage": "/img/destiny_content/pgcr/strike_exodus_crash.jpg",
      "directActivityModeHash": 3789021730,
      "directActivityModeType": 16,
      "activityModeHashes": [ 3789021730, 2394616003, 1164760493 ],
      "activityModeTypes": [ 16, 18, 7 ]
    },
    1975064760: {
      "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams.",
      "name": "Nightfall: Savathûn's Song",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "activityLevel": 27,
      "activityLightLevel": 270,
      "destinationHash": 2388758973,
      "placeHash": 386951460,
      "activityTypeHash": 575572995,
      "tier": 0,
      "pgcrImage": "/img/destiny_content/pgcr/strike_savanthuns_song.jpg",
      "directActivityModeHash": 3789021730,
      "directActivityModeType": 16,
      "activityModeHashes": [ 3789021730, 2394616003, 1164760493 ],
      "activityModeTypes": [ 16, 18, 7 ],
    },
    2322829199: {
      "description": "Help Osiris cut back an out-of-control Vex Mind.",
      "name": "Nightfall: A Garden World",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/common/destiny2_content/icons/43b8c3624c55631a6ddb0497dcc5bd3a.png",
      "activityLevel": 27,
      "activityLightLevel": 270,
      "destinationHash": 1993421442,
      "placeHash": 1259908504,
      "activityTypeHash": 575572995,
      "tier": 0,
      "pgcrImage": "/img/destiny_content/pgcr/rituals_a_garden_world.jpg",
      "directActivityModeHash": 3789021730,
      "directActivityModeType": 16,
      "activityModeHashes": [ 3789021730, 2394616003, 1164760493 ],
      "activityModeTypes": [ 16, 18, 7 ],
    },
    3368226533: {
      "description": "End the Red Legion expedition that has ripped open the planet's surface.",
      "name": "Nightfall: The Inverted Spire",
      "icon": "/common/destiny2_content/icons/fff30113ebf7a49f7e26152e7b7d95ff.png",
      "hasIcon": true,
      "releaseIcon": "/img/misc/missing_icon_d2.png",
      "activityLevel": 27,
      "activityLightLevel": 270,
      "destinationHash": 126924919,
      "placeHash": 3526908984,
      "activityTypeHash": 575572995,
      "tier": 0,
      "pgcrImage": "/img/destiny_content/pgcr/strike_inverted_spire.jpg",
      "directActivityModeHash": 3789021730,
      "directActivityModeType": 16,
      "activityModeHashes": [ 3789021730, 2394616003, 1164760493 ],
      "activityModeTypes": [ 16, 18, 7 ]
    }
};

export const NIGHTFALL = {
  milestoneHash: 2171429505,
};

 export const EATER_OF_WORLDS = {
   raidName: 'Eater of Worlds',
   boss: 'Argos',
   image: EATER_OF_WORLDS_IMAGE,
   launchDate: EATER_OF_WORLDS_LAUNCH_WEEK,
   allActivityHashes: [ 3089205900, 809170886 ],
   versions: {
     prestige: {
       activityHashes: [ 809170886 ],
       displayValue: 'Prestige',
     },
     normal: {
       activityHashes: [ 3089205900 ],
       displayValue: 'Normal'
     }
   }
 };

 export const LEVIATHAN = {
   raidName: 'Leviathan',
   boss: 'Calus',
   image: LEVIATHAN_IMAGE,
   launchDate: LEVIATHAN_LAUNCH_WEEK,
   milestoneHash: 3660836525,
   allActivityHashes: [
     417231112, 757116822, 1685065161,
     2449714930, 3446541099, 3879860661,
     2693136600, 2693136601, 2693136602,
     2693136603, 2693136604, 2693136605],
   versions: {
     prestige: {
       activityHashes: [ 417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661 ],
       displayValue: 'Prestige',
     },
     normal: {
       activityHashes: [ 2693136600, 2693136601, 2693136602, 2693136603, 2693136604, 2693136605 ],
       displayValue: 'Normal',
     }
   }
 };

 export const RAID_HASHES = {
   LEV: [
     2693136600, 2693136601, 2693136602, 2693136603, 2693136604, 2693136605 ,
     417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661
   ],
   lev: {
     prestige: [ 417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661 ],
     normal: [ 2693136600, 2693136601, 2693136602, 2693136603, 2693136604, 2693136605 ]
   },
   EOW: [ 3089205900, 809170886 ],
   eow: {
     prestige: [ 809170886 ],
     normal: [ 3089205900 ]
   }
 };

export const RAIDS = {EATER_OF_WORLDS, LEVIATHAN, NIGHTFALL};

export const activityModes = {
  0: 'none',
  2: 'Story',
  3: 'Strike',
  4: 'Raid',
  5: 'allPvP',
  6: 'patrol',
  7: 'allPvE',
  10: 'control',
  16: 'Nightfall',
  17: "heroicNightfall"
};
import { EATER_OF_WORLDS_LAUNCH_WEEK, LEVIATHAN_LAUNCH_WEEK } from "../actions";

const _playerProfile = (searchResults, profile, playersCharacters) => {
    return {
      ...searchResults,
      displayName: profile.userInfo.displayName,
      characterIds: profile.characterIds,
      characters: playersCharacters,
    }
  };

const _raid = (raidData) => {
  const raid = {};
  raid.period = raidData.period;
  raid.details = raidData.activityDetails;
  raid.stats = {};

  const statIds = Object.keys(raidData.values);
  statIds.forEach(curr => {
    raid.stats[curr] = raidData.values[curr].basic.value;
  });

  return raid;
};

const _raidHistory = (activityHistory) => {
    const raidHistory = {};

    Object.keys(activityHistory).forEach(
      (charId) => {
        const raids = activityHistory[charId].filter((activity) => activity.activityDetails.mode === 4);
        const charRaids = raidHistory[charId] = { completed: [], failed: [] };

        raids.forEach(raidData =>  {
          const raid = _raid(raidData);

          if (raid.stats.completed === 1) {
            charRaids.completed.push(raid);
          } else {
            charRaids.failed.push(raid);
          }
        });
      });
    return raidHistory;
  };

const normalize = {
  player: _playerProfile,
  raid: _raid,
  raidHistory: _raidHistory
};

export default normalize;
/*
-> Player
  - membershipType
  - membershipId
  - displayName
  - iconPath
  - characterIds

-> Character
  - characterId
    - membershipID
    - characterId
    - light
    - classType : String from classHash lookup
    - emblemPath
    - emblemBackgroundPath
    - emblemColor
    - baseCharacterLevel

-> Characters : [Character]

-> Raid -> Filter by mode needs Raid = 4
  - period : Time
  - name: String from directorActivityHash lookup.
  - mode
  - completed: boolean
  - stats { assists: 28 }

-> Raids : [Raid]
 */
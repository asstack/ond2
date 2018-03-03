import moment from 'moment';
import { RAIDS, EATER_OF_WORLDS as EOW, LEVIATHAN as LEV} from "../actions";

const getRaidWeeks = (raidLaunchDate) => {
  const weeksSinceRelease = moment().diff(moment(raidLaunchDate, 'YYYY-MM-DD'), 'w') + 1;

  const launchDate = moment(raidLaunchDate, 'YYYY-MM-DD');

  const raidWeeks = Array.apply(null, {length: weeksSinceRelease}).map((_, index) => {
    const addedIndexWeeks = moment(launchDate).add(index+1, 'week');
    return addedIndexWeeks;
  });
  return raidWeeks;
};

const splitRaidByWeek = (raidWeeks, raids) => {
  const raidsByWeek = {};
  raidWeeks.forEach((raidWeek, idx, arr) => {
    const nextRaidWeek = arr[idx+1] || {};
    const filteredByWeek = raids.filter((raid) => {
      const raidTime = moment(raid.period.split('T')[0], 'YYYY-MM-DD');
      return raidTime.isSameOrAfter(raidWeek) && raidTime.isBefore(nextRaidWeek);
    });
    raidsByWeek[idx] = filteredByWeek;
  });

  return raidsByWeek;
};

const mergeRaidsByWeek = raidHistory =>
  Object.values(raidHistory).reduce((accum, raids) => {
    Object.entries(raids).forEach(raidGroup => {
      const [raidName, raids] = raidGroup;
      accum[raidName] = accum[raidName] ? accum[raidName] : {};

      Object.entries(raids).forEach(raidEntries => {
        const [week, weekRaids ] = raidEntries;
        accum[raidName][week] = {
          ...accum[raidName][week],
          ...weekRaids
        };
      });
    });
    return accum;
  }, {});

const _playerProfile = (searchResults, profile, playersCharacters) => {
    return {
      ...searchResults,
      displayName: profile.userInfo.displayName,
      characterIds: profile.characterIds,
      characters: playersCharacters,
    }
  };

const _raidData = (raidData) => {
  return Object.entries(raidData).reduce((accum, raidWeek) => {
    const [ week, raids ] = raidWeek;
    accum[`Week ${+week+1}`] = raids.map(raid => ({
        ...raid,
        date: raid.period.split('T')[0],
        values: Object.entries(raid.values).reduce(
          (accum, value) => {
            accum[value[0]] = value[1].basic.value;
            return accum;
          }, {})
      })
    );
    return accum;
  }, {});
};

const _raidHistory = (activityHistory) => {
  const raidHistory = {};
  const EOW_RaidWeeks = getRaidWeeks(EOW.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEV.launchDate);

  Object.keys(activityHistory).forEach(
    (charId) => {
      const raids = activityHistory[charId].filter((activity) => activity.activityDetails.mode === 4);
      const EOW_Raids = raids.filter((curr) => EOW.allActivityHashes.indexOf(curr.activityDetails.directorActivityHash));
      const LEV_Raids = raids.filter((curr) => LEV.allActivityHashes.indexOf(curr.activityDetails.directorActivityHash));

      const EOW_RaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_Raids);
      const LEV_RaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_Raids);

      console.log(EOW_RaidsByWeek);
      //raidHistory['EOW'] = (raidHistory['EOW'] ? [...raidHistory['EOW'], EOW_Raids] : EOW_Raids);
      //raidHistory['LEV'] = (raidHistory['LEV'] ? [...raidHistory['LEV'], LEV_Raids] : LEV_Raids);

      raidHistory[charId] = {
        'EOW': _raidData(EOW_RaidsByWeek),
        'LEV': _raidData(LEV_RaidsByWeek)
      };

      console.log('raidHistory', raidHistory);
      //const charRaids = raidHistory[charId] = { completed: [], failed: [] };
      //raids.forEach(raidData =>  {
      //  const raid = _raid(raidData);
      //  console.log('raid', raid);
      //
      //  if (raid.stats.completed === 1) {
      //    charRaids.completed.push(raid);
      //  } else {
      //    charRaids.failed.push(raid);
      //  }
      //});
    });

  raidHistory['mergedHistory'] = mergeRaidsByWeek(raidHistory);
  return raidHistory;
  };

const _challenges = (activityName, milestones) => {
  const challenges = milestones.availableQuests[0].challenges;
  const activityHashes = challenges.map(curr => curr.activityHash);
  RAIDS[activityName].allActivityHashes = [...activityHashes];
  return activityHashes;
};

const normalize = {
  player: _playerProfile,
  raidData: _raidData,
  raidHistory: _raidHistory,
  challenges: _challenges
};

export default normalize;


/*
  [{
    week: "Week 22"
    []
  }]
 */
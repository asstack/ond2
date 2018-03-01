import moment from 'moment';
import { EATER_OF_WORLDS as EOW, LEVIATHAN as LEV} from "../actions";

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

const mergeRaidsByWeek = raidHistory => {
  const mergedRaids = { EOW: [], LEV: [] };

  Object.keys(raidHistory).map((charId) => {
    Object.keys(raidHistory[charId].EOW).map((curr, idx) => {
      mergedRaids.EOW[idx] = mergedRaids.EOW[idx] ?
        [...mergedRaids.EOW[idx], ...raidHistory[charId].EOW[curr]] : [...raidHistory[charId].EOW[curr]]
    });

    Object.keys(raidHistory[charId].LEV).map((curr, idx) => {
      mergedRaids.LEV[idx] = mergedRaids.LEV[idx] ?
        [...mergedRaids.LEV[idx], ...raidHistory[charId].LEV[curr]] : [...raidHistory[charId].LEV[curr]]
    });
  });
  return mergedRaids;
};

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
  raid.date = raidData.period.split('T')[0];
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
  const EOW_RaidWeeks = getRaidWeeks(EOW.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEV.launchDate);

  Object.keys(activityHistory).forEach(
    (charId) => {
      const raids = activityHistory[charId].filter((activity) => activity.activityDetails.mode === 4);
      const EOW_Raids = raids.filter((curr) => EOW.activityHashes.indexOf(curr.activityDetails.directorActivityHash));
      const LEV_Raids = raids.filter((curr) => LEV.activityHashes.indexOf(curr.activityDetails.directorActivityHash));

      const EOW_RaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_Raids);
      const LEV_RaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_Raids);

      //raidHistory['EOW'] = (raidHistory['EOW'] ? [...raidHistory['EOW'], EOW_Raids] : EOW_Raids);
      //raidHistory['LEV'] = (raidHistory['LEV'] ? [...raidHistory['LEV'], LEV_Raids] : LEV_Raids);

      raidHistory[charId] = {
        'EOW': EOW_RaidsByWeek,
        'LEV': LEV_RaidsByWeek
      };

      //const charRaids = raidHistory[charId] = { completed: [], failed: [] };
      //raids.forEach(raidData =>  {
      //  const raid = _raid(raidData);
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

const normalize = {
  player: _playerProfile,
  raid: _raid,
  raidHistory: _raidHistory
};

export default normalize;


/*
  [{
    week: "Week 22"
    []
  }]
 */
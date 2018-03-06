import moment from 'moment';
import { RAIDS, EATER_OF_WORLDS as EOW, LEVIATHAN as LEV} from "../actions";

const getRaidWeeks = (raidLaunchDate) => {
  const weeksSinceRelease = moment().diff(moment(raidLaunchDate, 'YYYY-MM-DD'), 'w');
  const launchDate = moment(raidLaunchDate, 'YYYY-MM-DD');
  return Array.apply(null, {length: weeksSinceRelease}).map((_, index) => moment(launchDate).add(index+1, 'week'));
};

const splitRaidByWeek = (raidWeeks, raids) => (
  raidWeeks.reduce((accum, raidWeek, idx, arr) => {
    const nextRaidWeek = arr[idx+1] || {};
    accum[idx] = raids.filter((raid) => {
      const raidTime = moment(raid.period.split('T')[0], 'YYYY-MM-DD');
      return raidTime.isSameOrAfter(raidWeek) && raidTime.isBefore(nextRaidWeek);
    });

    return accum;
  }, {})
);

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

const _normalizePlayerProfile = (searchResults, profile, playersCharacters) => {
    return {
      ...searchResults,
      displayName: profile.userInfo.displayName,
      characterIds: profile.characterIds,
      characters: playersCharacters,
    }
  };

const _normalizeRaidValues = (values) => (
  Object.entries(values).reduce(
    (accum, value) => {
      accum[ value[ 0 ] ] = value[ 1 ].basic.value;
      return accum;
    }, {})
);

const _normalizeRaidData = (raidData) => (
  Object.entries(raidData).reduce((accum, raidWeek) => {
    const [ week, raids ] = raidWeek;
    accum[`Week ${+week+1}`] = raids.map(raid => ({
        ...raid,
        date: raid.period.split('T')[0],
        values: _normalizeRaidValues(raid.values)
      })
    );
    return accum;
  }, {})
);

const _normalizeRaidHistory = (activityHistory, activityHashes) => {
  const EOW_RaidWeeks = getRaidWeeks(EOW.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEV.launchDate);

  const raidHistory = Object.entries(activityHistory).reduce(
    (accum, entry) => {
      const [charId, charRaids] = entry;
      const raids = charRaids.filter((activity) => activity.activityDetails.mode === 4);
      const EOW_Raids = raids.filter((curr) => EOW.allActivityHashes.indexOf(curr.activityDetails.directorActivityHash));
      const LEV_Raids = raids.filter((curr) => LEV.allActivityHashes.indexOf(curr.activityDetails.directorActivityHash));

      const EOW_RaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_Raids);
      const LEV_RaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_Raids);

      accum[charId] = {
        'EOW': _normalizeRaidData(EOW_RaidsByWeek),
        'LEV': _normalizeRaidData(LEV_RaidsByWeek)
      };

      return accum;
    }, {});

  raidHistory['mergedHistory'] = mergeRaidsByWeek(raidHistory);
  return raidHistory;
  };

const normalizePGCREntries = (entries) => (
  entries.map((curr) => ({
      player: {
        characterClass: curr.player.characterClass,
        characterLevel: curr.player.characterLevel,
        lightLevel: curr.player.lightLevel,
        classHash: curr.player.classHash,
        raceHash: curr.player.raceHash,
        ...curr.player.destinyUserInfo
      },
      score: curr.score.basic.value,
      values: _normalizeRaidValues(curr.values),
      extended: {...curr.extended },
  }))
);

const _normalizePostGameCarnageReport = (pgcr) => ({
    activityDetails: {...pgcr.activityDetails},
    raidDate: pgcr.period.split('T')[ 0 ],
    entries: normalizePGCREntries(pgcr.entries),
    raid: (() => {
      const activityHash = pgcr.activityDetails.referenceId;
      if(LEV.allActivityHashes.indexOf(activityHash) >= 0) {
        console.log('lev');
        return {
          ...LEV,
          mode: (() => LEV.versions.prestige.activityHashes.indexOf(activityHash) ? 'Prestige' : 'Normal')()
        };
      }
      else if(EOW.allActivityHashes.indexOf(pgcr.activityDetails.referenceId) >= 0) {
        return {
          ...EOW,
          mode: (() => EOW.versions.prestige.activityHashes.indexOf(activityHash) ? 'Prestige' : 'Normal')()
        };
      }
      return false;
    })(),
  }
);

const _normalizeMilestoneData = (milestones, mshObj) => (
  Object.entries(milestones)
    .filter(entry => (entry[0] === mshObj.lev_msh.toString() || entry[0] === mshObj.nf_msh.toString()))
    .reduce((accum, msh) => {
      accum[msh[0]] = msh[1].availableQuests[0].activity.variants.map(curr => curr.activityHash);
      return accum;
    }, {})
);

const normalize = {
  player: _normalizePlayerProfile,
  raidData: _normalizeRaidData,
  raidValues: _normalizeRaidValues,
  raidHistory: _normalizeRaidHistory,
  postGameCarnageReport: _normalizePostGameCarnageReport,
  milestoneData: _normalizeMilestoneData
};

export default normalize;
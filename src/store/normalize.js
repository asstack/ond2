import moment from 'moment';
import { NF_HASHES, RAID_HASHES, NF_START_DATE, EATER_OF_WORLDS, LEVIATHAN } from "../actions";

const getCount = (data) => Object.values(data).reduce((accum, arr) => accum + arr.length, 0);

const getRaidWeeks = (launch) => {
  const launchDate = moment.utc(launch);
  const weeksSinceRelease = moment.utc().diff(launchDate, 'w');
  return Array.apply(null, {length: weeksSinceRelease}).map((_, index) => moment(launchDate).add(index + 1, 'week'));
};

const splitRaidByWeek = (raidWeeks, raids) => {
  return raidWeeks.reduce((accum, raidWeek, idx, arr) => {
    const nextRaidWeek = arr[ idx + 1 ] || {};
    accum[ idx ] = raids.filter((raid) => {
      const raidTime = moment.utc(raid.period);
      return raidTime.isSameOrAfter(raidWeek) && raidTime.isBefore(nextRaidWeek);
    });
    return accum;
  }, {})
};

const splitNightfallByWeek = (weeks, nightfalls) => {

  return weeks.reduce((accum, week) => {
    const nextWeek = moment(week).add(1, 'weeks');

    const weekRange = `${week.format('MM/DD')}`;
    const smallDate = week.format('MM/DD');

    const weekBox = nightfalls.filter(nf => {
      const time = moment.utc(nf.period);
      return time.isSameOrAfter(week) && time.isBefore(nextWeek);
    });

    if (weekBox.length > 0) {
      const constValue = NF_HASHES.all[ weekBox[ 0 ].activityDetails.referenceId ];
      // Each raid week key is made unique by adding the date 'smallDate'
      const nfName = constValue ? `${constValue.name.substring(11)}:D:${smallDate}` : weekRange;

      accum[ nfName ] = weekBox;

    } else {
      accum[ weekRange ] = []
    }
    return accum;
  }, {})
};

const mergeRaidsByWeek = raidHistory => {
  console.log('raidHistory', raidHistory);
  const test = Object.values(raidHistory).reduce((accum, charRaids) => {
    Object.entries(charRaids).map(raidGroup => {
      const [ raidName, raids ] = raidGroup;
      accum[ raidName ] = accum[ raidName ] ? accum[ raidName ] : {};

      Object.entries(raids).forEach(raidEntries => {
        const [ week, weekRaids ] = raidEntries;
        accum[ raidName ][ week ] = accum[ raidName ][ week ] ? [ ...accum[ raidName ][ week ], ...weekRaids ] : [ ...weekRaids ];
      });
    });

    return accum;
  }, {});

  console.log('test', test);
  return test;
};

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
    accum[ `Week ${+week + 1}` ] = raids.map(raid => {
        return ({
          ...raid,
          values: raid.values
        })
      }
    );
    return accum;
  }, {})
);

const _normalizeRaidHistory = ({ EOW, LEV }) => {
  const EOW_RaidWeeks = getRaidWeeks(EATER_OF_WORLDS.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEVIATHAN.launchDate);


  const EOW_Raids = Object.values(EOW);
  const LEV_NormalRaids = Object.values(LEV.normal);
  const LEV_PrestigeRaids = Object.values(LEV.prestige);

  const EOW_RaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_Raids);
  const LEV_NormalRaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_NormalRaids);
  const LEV_PrestigeRaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_PrestigeRaids);

  const raidHistory = { EOW: {}, LEV: { normal: {}, prestige: {} }};

  raidHistory.raidCount = {
    eow: {
      normal: EOW_Raids.length
    },
    lev: {
      prestige: LEV_PrestigeRaids.length,
      normal: LEV_NormalRaids.length
    }
  };

  raidHistory.EOW = _normalizeRaidData(EOW_RaidsByWeek);
  raidHistory.LEV.normal = _normalizeRaidData(LEV_NormalRaidsByWeek);
  raidHistory.LEV.prestige = _normalizeRaidData(LEV_PrestigeRaidsByWeek);

  console.log('raidHistoryasdfasdf', raidHistory);
  raidHistory.mergedHistory = mergeRaidsByWeek(raidHistory);

  return raidHistory;
};

// To get date, add string to header value, and split on some unique character. ::--
const _normalizeNightfallHistory = ({ prestige, normal }) => {
  const NF_Weeks = getRaidWeeks(NF_START_DATE);

  const splitPrestigeWeeks = splitNightfallByWeek(NF_Weeks,  Object.values(prestige));
  const splitNormalWeeks = splitNightfallByWeek(NF_Weeks,  Object.values(normal));

  const prestigeCount = getCount(splitPrestigeWeeks);
  const normalCount = getCount(splitNormalWeeks);

  return ({
    prestige: splitPrestigeWeeks,
    normal: splitNormalWeeks,
    nfCount: {prestige: prestigeCount, normal: normalCount}
  });
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
    extended: {...curr.extended},
  }))
);

const _normalizePostGameCarnageReport = (pgcr) => ({
    activityDetails: {...pgcr.activityDetails},
    raidDate: moment.utc(pgcr.period).format('MM-DD-YYYY'),
    entries: normalizePGCREntries(pgcr.entries),
    raid: (() => {
      const activityHash = pgcr.activityDetails.referenceId;
      if (LEVIATHAN.allActivityHashes.indexOf(activityHash) >= 0) {
        return {
          ...LEVIATHAN,
          mode: (() => LEVIATHAN.versions.prestige.activityHashes.indexOf(activityHash) ? 'Prestige' : 'Normal')()
        };
      }
      else if (EATER_OF_WORLDS.allActivityHashes.indexOf(pgcr.activityDetails.referenceId) >= 0) {
        return {
          ...EATER_OF_WORLDS,
          mode: (() => EATER_OF_WORLDS.versions.prestige.activityHashes.indexOf(activityHash) ? 'Prestige' : 'Normal')()
        };
      }
      return false;
    })(),
  }
);

const _normalizeMilestoneData = (milestones) => {
  return Object.entries(milestones).sort().reverse();
};

const _normalizeRaidWeeks = (raid = '', history = {EOW: {}, LEV: {}}, mode = '') => {
  const slicedRaid = (
    raid === 'eow'
      ? Object.entries(history.EOW).reverse().slice(0, 6)
      : Object.entries(history.LEV).reverse().slice(0, 6)
  );

  if (mode === 'prestige') {
    return (
      slicedRaid.map(curr => [
        curr[ 0 ],
        Object.values(curr[ 1 ])
          .filter(data => RAID_HASHES[raid].prestige.indexOf(data.activityDetails.referenceId) >= 0)
      ])
    )
  }
  else {
    return (
      slicedRaid.map(curr => [
        curr[ 0 ],
        Object.values(curr[ 1 ])
          .filter(data => RAID_HASHES[raid].normal.indexOf(data.activityDetails.referenceId) >= 0)
      ])
    )
  }
};

const normalize = {
  player: _normalizePlayerProfile,
  raidData: _normalizeRaidData,
  raidValues: _normalizeRaidValues,
  raidHistory: _normalizeRaidHistory,
  nightfall: _normalizeNightfallHistory,
  postGameCarnageReport: _normalizePostGameCarnageReport,
  milestoneData: _normalizeMilestoneData,
  raidWeeks: _normalizeRaidWeeks
};

export default normalize;
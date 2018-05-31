import moment from 'moment';
import { NF_HASHES, RAID_HASHES, NF_START_DATE, EATER_OF_WORLDS, LEVIATHAN, SPIRE_OF_STARS } from "../actions";

const getCount = (data) => Object.values(data).reduce((accum, arr) => accum + arr.length, 0);

const getRaidWeeks = (launch) => {
  const launchDate = moment.utc(launch);
  console.log('launchDate', launchDate);
  const weeksSinceRelease = moment.utc().diff(launchDate, 'w');
  console.log('weeksSinceRelease', weeksSinceRelease);
  return Array.apply(null, {length: weeksSinceRelease}).map((_, index) => moment(launchDate).add(index + 1, 'week'));
};

const splitRaidByWeek = (raidWeeks, raids) => {
  return raidWeeks.reduce((accum, raidWeek, idx, arr) => {
    const smallDate = raidWeek.format('MM/DD/YY');

    const nextRaidWeek = arr[ idx + 1 ] || {};
    accum[ smallDate ] = raids.filter((raid) => {
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
  return Object.values(raidHistory).reduce((accum, charRaids) => {
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

const _normalizeRaidHistory = ({ EOW, LEV, SPIRE }) => {
  const EOW_RaidWeeks = getRaidWeeks(EATER_OF_WORLDS.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEVIATHAN.launchDate);
  const SPIRE_RaidWeeks = getRaidWeeks(SPIRE_OF_STARS.launchDate);

  console.log('spire rw', SPIRE_RaidWeeks);

  const EOW_Raids = Object.values(EOW);
  const LEV_NormalRaids = Object.values(LEV.normal);
  const LEV_PrestigeRaids = Object.values(LEV.prestige);
  const SPIRE_NormalRaids = Object.values(SPIRE.normal);
  const SPIRE_PrestigeRaids = Object.values(SPIRE.prestige);

  console.log('spire n raids', SPIRE_NormalRaids);
  console.log('spire p raids', SPIRE_NormalRaids);

  const EOW_RaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_Raids);
  const LEV_NormalRaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_NormalRaids);
  const LEV_PrestigeRaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_PrestigeRaids);
  const SPIRE_NormalRaidsByWeek = splitRaidByWeek(SPIRE_RaidWeeks, SPIRE_NormalRaids);
  const SPIRE_PrestigeRaidsByWeek = splitRaidByWeek(SPIRE_RaidWeeks, SPIRE_PrestigeRaids);

  console.log('spire s n r', SPIRE_NormalRaidsByWeek);
  console.log('spire s p r', SPIRE_PrestigeRaidsByWeek);

  const raidHistory = { EOW: {}, LEV: { normal: {}, prestige: {} }, SPIRE: { normal: {}, prestige: {} }};

  raidHistory.raidCount = {
    eow: {
      normal: Object.values(EOW).filter(curr => curr.values.completed === 1).length
    },
    lev: {
      prestige: Object.values(LEV.prestige).filter(curr => curr.values.completed === 1).length,
      normal: Object.values(LEV.normal).filter(curr => curr.values.completed === 1).length
    },
    spire: {
      prestige: Object.values(SPIRE.prestige).filter(curr => curr.values.completed === 1).length,
      normal: Object.values(SPIRE.normal).filter(curr => curr.values.completed === 1).length,
    }
  };

  raidHistory.EOW = EOW_RaidsByWeek;
  raidHistory.LEV.normal = LEV_NormalRaidsByWeek;
  raidHistory.LEV.prestige = LEV_PrestigeRaidsByWeek;
  raidHistory.SPIRE.normal = SPIRE_NormalRaidsByWeek;
  raidHistory.SPIRE.prestige = SPIRE_PrestigeRaidsByWeek;

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

const _normalizeRaidWeeks = (raid = '', history = {EOW: {}, LEV: {}}, mode = '') =>
      raid === 'eow'
      ? Object.entries(history.EOW).slice(0, 6)
        : mode === 'prestige'
          ? Object.entries(history.LEV.prestige).slice(0, 6)
            : Object.entries(history.LEV.normal).slice(0, 6);

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
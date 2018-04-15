import moment from 'moment';
import { NF_HASHES, RAID_HASHES, NF_START_DATE, EATER_OF_WORLDS as EOW, LEVIATHAN as LEV } from "../actions";

const getCount = (data) => Object.values(data).reduce((accum, arr) => accum + arr.length, 0);

const getRaidWeeks = (launch) => {
  const launchDate = moment.utc(launch);
  const weeksSinceRelease = moment.utc().diff(launchDate, 'w');
  return Array.apply(null, {length: weeksSinceRelease}).map((_, index) => moment(launchDate).add(index + 1, 'week'));
};

const splitRaidByWeek = (raidWeeks, raids) => (
  raidWeeks.reduce((accum, raidWeek, idx, arr) => {
    const nextRaidWeek = arr[ idx + 1 ] || {};
    accum[ idx ] = raids.filter((raid) => {
      const raidTime = moment.utc(raid.period);
      return raidTime.isSameOrAfter(raidWeek) && raidTime.isBefore(nextRaidWeek);
    });
    return accum;
  }, {})
);

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


const splitNightfallByStrike = ({normal, prestige}) => {
  const prestigeData = Object.entries(NF_HASHES.all).reduce((accum, nfHash) => {
    const [ id, nfStrike ] = nfHash;
    const name = nfStrike.name.substring(11);

    const prestigeNightfall = Object.values(prestige).filter((run) => run.activityDetails.referenceId.toString() === id);
    accum[ name ] = !!accum[ name ] ? [ ...accum[ name ], ...prestigeNightfall ] : [ ...prestigeNightfall ];

    return accum;
  }, {});

  const normalData = Object.entries(NF_HASHES.all).reduce((accum, nfHash) => {
    const [ id, rawName ] = nfHash;
    const name = rawName.name.substring(11);

    const normalNightfall = Object.values(normal).filter((run) => run.activityDetails.referenceId.toString() === id);
    accum[ name ] = !!accum[ name ] ? [ ...accum[ name ], ...normalNightfall ] : [ ...normalNightfall ];

    return accum;
  }, {});

  const returnData = {
    normal: normalData,
    prestige: prestigeData
  };

  return returnData;
};

const mergeRaidsByWeek = raidHistory =>
  Object.values(raidHistory).reduce((accum, charRaids) => {
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
        const date = moment.utc(raid.period).format('MM-DD-YYYY');
        return ({
          ...raid,
          date,
          values: _normalizeRaidValues(raid.values)
        })
      }
    );
    return accum;
  }, {})
);

const _normalizeRaidHistory = (activityHistory) => {
  const EOW_RaidWeeks = getRaidWeeks(EOW.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEV.launchDate);

  const raidHistory = Object.entries(activityHistory).reduce(
    (accum, entry) => {
      const [ charId, raids ] = entry;

      const EOW_Raids = raids.filter((curr) => RAID_HASHES.EOW.indexOf(curr.activityDetails.referenceId) >= 0);
      const LEV_Raids = raids.filter((curr) => RAID_HASHES.LEV.indexOf(curr.activityDetails.referenceId) >= 0);

      const EOW_RaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_Raids);
      const LEV_RaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_Raids);

      accum[ charId ] = {
        EOW: _normalizeRaidData(EOW_RaidsByWeek),
        LEV: _normalizeRaidData(LEV_RaidsByWeek)
      };

      const eowSuccessItems = EOW_Raids.filter(curr => curr.values.completed.basic.value === 1);
      const levSuccessItems = LEV_Raids.filter(curr => curr.values.completed.basic.value === 1);

      const eowPrestigeCount = eowSuccessItems.filter(curr => RAID_HASHES.eow.prestige.indexOf(curr.activityDetails.referenceId) >= 0).length;
      const eowNormalCount = eowSuccessItems.filter(curr => RAID_HASHES.eow.normal.indexOf(curr.activityDetails.referenceId) >= 0).length;

      const levPrestigeCount = levSuccessItems.filter(curr => RAID_HASHES.lev.prestige.indexOf(curr.activityDetails.referenceId) >= 0).length;
      const levNormalCount = levSuccessItems.filter(curr => RAID_HASHES.lev.normal.indexOf(curr.activityDetails.referenceId) >= 0).length;


      accum.raidCount = {
        eow: {
          prestige: accum.raidCount.eow.prestige + eowPrestigeCount,
          normal: accum.raidCount.eow.normal + eowNormalCount,
        },
        lev: {
          prestige: accum.raidCount.lev.prestige + levPrestigeCount,
          normal: accum.raidCount.lev.normal + levNormalCount,
        }
      };

      return accum;
    }, {raidCount: {eow: {prestige: 0, normal: 0}, lev: {prestige: 0, normal: 0}}});


  raidHistory[ 'mergedHistory' ] = mergeRaidsByWeek(raidHistory);
  return raidHistory;
};

// To get date, add string to header value, and split on some unique character. ::--
const _normalizeNightfallHistory = ({prestige, normal}) => {
  const nPrestige = Object.values(prestige).map(nf => ({...nf, values: _normalizeRaidValues(nf.values)}));
  const nNormal = Object.values(normal).map(nf => ({...nf, values: _normalizeRaidValues(nf.values)}));

  const NF_Weeks = getRaidWeeks(NF_START_DATE);

  const splitPrestigeWeeks = splitNightfallByWeek(NF_Weeks, nPrestige);
  const splitNormalWeeks = splitNightfallByWeek(NF_Weeks, nNormal);

  const prestigeWeeks = Object.entries(splitPrestigeWeeks).reduce((accum, raidWeeks) => {
    const [ raidName, raidWeek ] = raidWeeks;
    accum[ raidName ] = raidWeek.map((raid) => {
      const period = moment.utc(raid.period);
      return ({...raid, period});
    });
    return accum;
  }, {});

  const normalWeeks = Object.entries(splitNormalWeeks).reduce((accum, raidWeeks) => {
    const [ raidName, raidWeek ] = raidWeeks;
    accum[ raidName ] = raidWeek.map((raid) => {
      const period = moment.utc(raid.period);
      return ({...raid, period});
    });
    return accum;
  }, {});

  const prestigeCount = getCount(prestigeWeeks);
  const normalCount = getCount(normalWeeks);

  return ({
    prestige: {...prestigeWeeks},
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
      if (LEV.allActivityHashes.indexOf(activityHash) >= 0) {
        return {
          ...LEV,
          mode: (() => LEV.versions.prestige.activityHashes.indexOf(activityHash) ? 'Prestige' : 'Normal')()
        };
      }
      else if (EOW.allActivityHashes.indexOf(pgcr.activityDetails.referenceId) >= 0) {
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
    .filter(entry => (entry[ 0 ] === mshObj.lev_msh.toString() || entry[ 0 ] === mshObj.nf_msh.toString()))
    .reduce((accum, msh) => {
      accum[ msh[ 0 ] ] = msh[ 1 ].availableQuests[ 0 ].activity.variants.map(curr => curr.activityHash);
      return accum;
    }, {})
);

const _normalizeRaidWeeks = (raid = '', history = {EOW: {}, LEV: {}}, mode = '') => {
  const slicedRaid = (
    raid === 'eow'
      ? Object.entries(history.EOW).reverse().slice(0, 5)
      : Object.entries(history.LEV).reverse().slice(0, 5)
  );

  if (mode === 'prestige') {
    return (
      slicedRaid.map(curr => [
        curr[ 0 ],
        Object.values(curr[ 1 ])
          .filter(data => RAID_HASHES[ raid ].prestige.indexOf(data.activityDetails.referenceId) >= 0)
      ])
    )
  }
  else {
    return (
      slicedRaid.map(curr => [
        curr[ 0 ],
        Object.values(curr[ 1 ])
          .filter(data => RAID_HASHES[ raid ].normal.indexOf(data.activityDetails.referenceId) >= 0)
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
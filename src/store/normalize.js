import moment from 'moment';
import {
  NF_HASHES,
  RAID_HASHES,
  NF_START_DATE,
  EATER_OF_WORLDS,
  LEVIATHAN,
  SPIRE_OF_STARS,
  ESCALATION_PROTOCOL
} from "../actions";

const getCount = (data) => Object.values(data).reduce((accum, arr) => accum + arr.length, 0);
const getSuccessCount = (data) => Object.values(data).reduce((accum, curr) => {
  const successCount = curr.filter(raid => raid.values.completionReason === 0 && raid.values.completed === 1).length || 0;
  return accum += successCount;
}, 0);

const getEPSuccessCount = (data) => Object.values(data).reduce((accum, curr) => {
  const successCount = curr.filter(raid => raid.values.completionReason === 0 && raid.values.completed === 1);
  return accum += successCount.length;
}, 0);

const getRaidWeeks = (launch) => {
  const launchDate = moment.utc(launch);
  const weeksSinceRelease = moment.utc().diff(launchDate, 'w');
  return Array.apply(null, {length: weeksSinceRelease}).map((_, index) => moment(launchDate).add(index + 1, 'week'));
};

const splitRaidByWeek = (raidWeeks, raids) => {
  return raidWeeks.reduce((accum, raidWeek, idx, arr) => {
    const smallDate = raidWeek.format('MM/DD/YY');

    const nextRaidWeek = arr[ idx + 1 ] || {};

    accum[ smallDate ] = raids.filter((raid) => {
      const raidTime = moment.utc(raid.raidDate, 'MM-DD-YYYY HH:mm a');
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
      const time = moment.utc(nf.raidDate, 'MM-DD-YYYY HH:mm a');
      return time.isSameOrAfter(week) && time.isBefore(nextWeek);
    });

    if (weekBox.length > 0) {
      const constValue = NF_HASHES.all[weekBox[0].referenceId];
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

const extractDuplicatesLikeServer = (data) => {
  const parsed = data.reduce((accum, curr) => {
      const instanceId = curr.activityDetails.instanceId;
      if(!!accum[instanceId]) {
        if(curr.values.startSeconds > accum[instanceId].values.startSeconds) {
          accum[instanceId] = curr;
        }
      } else {
        accum[instanceId] = curr;
      }

      return accum;
    }, {});
  return Object.values(parsed);
};

const extractDuplicates = (data) => {
  const parsed = Object.values(data).reduce((accum, curr) => {
      const instanceId = curr.instanceId;
      if(!!accum[instanceId]) {
        if(curr.values.startSeconds > accum[instanceId].values.startSeconds) {
          accum[instanceId] = curr;
        }
      } else {
        accum[instanceId] = curr;
      }

      return accum;
    }, {});
  return Object.values(parsed);
};

const isApplicableRaid = (raid) => {
  return (
    raid.teamCount >= 6 ||
    raid.values.activityDurationSeconds >= (60 * 5) ||
    raid.values.kills > 0
  )
};

const getRaidCount = (EOW, LEV, SPIRE) => {

  const eowNSuccessCount = Object.values(EOW.normal).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);
  const eowPSuccessCount = Object.values(EOW.prestige).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);
  const levPSuccessCount = Object.values(LEV.prestige).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);
  const levNSuccessCount = Object.values(LEV.normal).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);
  const spireNSuccessCount = Object.values(SPIRE.normal).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);
  const spirePSuccessCount = Object.values(SPIRE.prestige).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);

  const eowNFarmCount = eowNSuccessCount.reduce((accum, currRaid) => currRaid.totalKills < 400 ? accum += 1 : accum, 0);
  const eowPFarmCount = eowPSuccessCount.reduce((accum, currRaid) => currRaid.totalKills < 400 ? accum += 1 : accum, 0);
  const levPFarmCount = levPSuccessCount.reduce((accum, currRaid) => currRaid.totalKills < 400 ? accum += 1 : accum, 0);
  const levNFarmCount = levNSuccessCount.reduce((accum, currRaid) => currRaid.totalKills < 400 ? accum += 1 : accum, 0);
  const spireNFarmCount = spireNSuccessCount.reduce((accum, currRaid) => currRaid.totalKills < 600 ? accum += 1 : accum, 0);
  const spirePFarmCount = spireNSuccessCount.reduce((accum, currRaid) => currRaid.totalKills < 600 ? accum += 1 : accum, 0);


  const eowNFailCount = Object.values(EOW.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid)).length;

  const eowPFailCount = Object.values(EOW.prestige).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid)).length;

  const levPFailCount = Object.values(LEV.prestige).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid)).length;

  const levNFailCount = Object.values(LEV.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid)).length;

  const spireNFailCount = Object.values(SPIRE.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid)).length;

  const spirePFailCount = Object.values(SPIRE.prestige).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid)).length;

  return {
    eow: {
      successCount: {
        normal: eowNSuccessCount.length,
        prestige: eowPSuccessCount.length
      },
      farmCount: {
        normal: eowNFarmCount,
        prestige: eowPFarmCount
      },
      failCount: {
        normal: eowNFailCount,
        prestige: eowPFailCount
      }
    },
    lev: {
      successCount: {
        prestige: levPSuccessCount.length,
        normal: levNSuccessCount.length
      },
      farmCount: {
        prestige: levPFarmCount,
        normal: levNFarmCount
      },
      failCount: {
        prestige: levPFailCount,
        normal: levNFailCount
      }
    },
    spire: {
      successCount: {
        normal: spireNSuccessCount.length,
        prestige: spirePSuccessCount.length
      },
      farmCount: {
        normal: spireNFarmCount,
        prestige: spirePFarmCount
      },
      failCount: {
        normal: spireNFailCount,
        prestige: spirePFailCount
      }
    }
  };
};

const _normalizeRaidHistory = ({ EOW, LEV, SPIRE }) => {
  const EOW_RaidWeeks = getRaidWeeks(EATER_OF_WORLDS.launchDate).reverse().slice(0, 6).reverse();
  const LEV_RaidWeeks = getRaidWeeks(LEVIATHAN.launchDate).reverse().slice(0, 6).reverse();
  const SPIRE_RaidWeeks = getRaidWeeks(SPIRE_OF_STARS.launchDate).reverse().slice(0, 6).reverse();

  const EOW_NormalRaids = extractDuplicates(EOW.normal);
  const EOW_PrestigeRaids = extractDuplicates(EOW.prestige);
  const LEV_NormalRaids = extractDuplicates(LEV.normal);
  const LEV_PrestigeRaids = extractDuplicates(LEV.prestige);
  const SPIRE_NormalRaids = extractDuplicates(SPIRE.normal);
  const SPIRE_PrestigeRaids = extractDuplicates(SPIRE.prestige);


  const EOW_NormalRaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_NormalRaids);
  const EOW_PrestigeRaidsByWeek = splitRaidByWeek(EOW_RaidWeeks, EOW_PrestigeRaids);
  const LEV_NormalRaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_NormalRaids);
  const LEV_PrestigeRaidsByWeek = splitRaidByWeek(LEV_RaidWeeks, LEV_PrestigeRaids);
  const SPIRE_NormalRaidsByWeek = splitRaidByWeek(SPIRE_RaidWeeks, SPIRE_NormalRaids);
  const SPIRE_PrestigeRaidsByWeek = splitRaidByWeek(SPIRE_RaidWeeks, SPIRE_PrestigeRaids);


  const raidHistory = { EOW: { normal: {}, prestige: {}}, LEV: { normal: {}, prestige: {} }, SPIRE: { normal: {}, prestige: {} }};

  raidHistory.raidCount = getRaidCount(EOW, LEV, SPIRE);
  raidHistory.EOW.normal = EOW_NormalRaidsByWeek;
  raidHistory.EOW.prestige = EOW_PrestigeRaidsByWeek;
  raidHistory.LEV.normal = LEV_NormalRaidsByWeek;
  raidHistory.LEV.prestige = LEV_PrestigeRaidsByWeek;
  raidHistory.SPIRE.normal = SPIRE_NormalRaidsByWeek;
  raidHistory.SPIRE.prestige = SPIRE_PrestigeRaidsByWeek;
  raidHistory.mergedHistory = mergeRaidsByWeek(raidHistory);

  return raidHistory;
};

//const failedRaids =
//  viewRaid === 'nf' ?
//    raidValues.filter(raid => raid.values.completionReason !== 0 && raid.values.completed !== 1)
//      : raidValues.filter(raid => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0 && isApplicableRaid(raid));



// To get date, add string to header value, and split on some unique character. ::--
const _normalizeNightfallHistory = ({ prestige, normal }) => {
  const NF_Weeks = getRaidWeeks(NF_START_DATE).reverse().splice(0, 6).reverse();

  const prestigeFailCount = Object.values(prestige).filter(raid => raid.values.completionReason !== 0 && raid.values.completed !== 1).length || 0;
  const normalFailCount = Object.values(normal).filter(raid => raid.values.completionReason !== 0 && raid.values.completed !== 1).length || 0;

  const prestigeCount = Object.values(prestige).filter(raid => raid.values.completionReason === 0 && raid.values.completed === 1).length || 0;
  const normalCount = Object.values(normal).filter(raid => raid.values.completionReason === 0 && raid.values.completed === 1).length || 0;

  const splitPrestigeWeeks = splitNightfallByWeek(NF_Weeks,  Object.values(prestige));
  const splitNormalWeeks = splitNightfallByWeek(NF_Weeks,  Object.values(normal));

  return ({
    prestige: splitPrestigeWeeks,
    normal: splitNormalWeeks,
    nfSuccessCount: {prestige: prestigeCount, normal: normalCount},
    nfFailCount: { prestige: prestigeFailCount, normal: normalFailCount}
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
    raidDate: moment.utc(pgcr.period).format('MM-DD-YYYY h:mm a'),
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
      else if(SPIRE_OF_STARS.allActivityHashes.indexOf(pgcr.activityDetails.referenceId) >= 0) {
        return {
          ...SPIRE_OF_STARS,
          mode: (() => SPIRE_OF_STARS.allActivityHashes.indexOf(pgcr.activityDetails.referenceId) ? 'Prestige' : 'Normal')()
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
      ? mode === 'prestige'
        ? Object.entries(history.EOW.prestige).slice(0, 6)
          : Object.entries(history.EOW.normal).slice(0, 6)
        : mode === 'prestige'
          ? Object.entries(history.LEV.prestige).slice(0, 6)
            : Object.entries(history.LEV.normal).slice(0, 6);

const _normalizeEP = (history) => {
  const EP_RaidWeeks = getRaidWeeks(ESCALATION_PROTOCOL.launchDate);
  const splitEP = splitRaidByWeek(EP_RaidWeeks, history);

  const successCount = getEPSuccessCount(splitEP);

  return {
    EP: splitEP,
    epSuccessCount: successCount
  }
};

const getQuickStatsCount = (EOW, LEV, SPIRE) => {

  const eowNSuccessCount = Object.values(EOW.normal).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0).length;
  const eowPSuccessCount = Object.values(EOW.prestige).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0).length;
  const levPSuccessCount = Object.values(LEV.prestige).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0).length;
  const levNSuccessCount = Object.values(LEV.normal).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0).length;
  const spireNSuccessCount = Object.values(SPIRE.normal).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0).length;
  const spirePSuccessCount = Object.values(SPIRE.prestige).filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0).length;

  const eowNFailCount = Object.values(EOW.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0).length;

  const eowPFailCount = Object.values(EOW.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0).length;

  const levPFailCount = Object.values(LEV.prestige).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0).length;

  const levNFailCount = Object.values(LEV.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0).length;

  const spireNFailCount = Object.values(SPIRE.normal).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0).length;

  const spirePFailCount = Object.values(SPIRE.prestige).filter(
    (raid) => raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0).length;

  return {
    eow: {
      success: {
        normal: eowNSuccessCount,
        prestige: eowPSuccessCount
      },
      fails: {
        normal: eowNFailCount,
        prestige: eowPFailCount
      }
    },
    lev: {
      success: {
        normal: levNSuccessCount,
        prestige: levPSuccessCount
      },
      fail: {
        normal: levNFailCount,
        prestige: levPFailCount
      }
    },
    spire: {
      success: {normal: spireNSuccessCount, prestige: spirePSuccessCount},
      fail: {normal: spireNFailCount, prestige: spirePFailCount}
    }
  };
};

const _splitLevByMode = (raidData, key) => {
  const levPrestige = raidData.filter(data => RAID_HASHES[key].prestige.indexOf(data.activityDetails.referenceId) >= 0);
  const levNormal = raidData.filter(data => RAID_HASHES[key].normal.indexOf(data.activityDetails.referenceId) >= 0);

  return [levPrestige, levNormal];
};

const serverNormalizeRaidData = (raidData) => raidData.map(raid => ({ ...raid, values: _normalizeRaidValues(raid.values)}));

const normalizeRaidsLikeServer = (activityHistory, dateLastUpdated) => {

  const EOW_N = activityHistory.filter((curr) => RAID_HASHES.eow.normal.indexOf(curr.activityDetails.referenceId) >= 0);
  const EOW_P = activityHistory.filter((curr) => RAID_HASHES.eow.prestige.indexOf(curr.activityDetails.referenceId) >= 0);
  const LEV = activityHistory.filter((curr) => RAID_HASHES.LEV.indexOf(curr.activityDetails.referenceId) >= 0);
  const SPIRE_N = activityHistory.filter(curr => RAID_HASHES.spire.normal.indexOf(curr.activityDetails.referenceId) >= 0);
  const SPIRE_P = activityHistory.filter(curr => RAID_HASHES.spire.prestige.indexOf(curr.activityDetails.referenceId) >= 0);

  const [levPrestige, levNormal] = _splitLevByMode(LEV, 'lev');

  const EOW_NormalRaids = extractDuplicatesLikeServer(EOW_N);
  const EOW_PrestigeRaids = extractDuplicatesLikeServer(EOW_P);
  const LEV_NormalRaids = extractDuplicatesLikeServer(levNormal);
  const LEV_PrestigeRaids = extractDuplicatesLikeServer(levPrestige);
  const SPIRE_NormalRaids = extractDuplicatesLikeServer(SPIRE_N);
  const SPIRE_PrestigeRaids = extractDuplicates(SPIRE_P);

  const eow = { normal: serverNormalizeRaidData(EOW_NormalRaids), prestige: serverNormalizeRaidData(EOW_PrestigeRaids)};
  const lev = { normal: serverNormalizeRaidData(LEV_NormalRaids), prestige: serverNormalizeRaidData(LEV_PrestigeRaids) };
  const spire = { normal: serverNormalizeRaidData(SPIRE_NormalRaids), prestige: serverNormalizeRaidData(SPIRE_PrestigeRaids) };


  const raidCount = getQuickStatsCount(
    { normal: eow.normal, prestige: eow.prestige},
    { normal: lev.normal, prestige: lev.prestige },
    { normal: spire.normal, prestige: spire.prestige }
  );

  return { raidCount: raidCount }
};

const normalizeNightfallLikeServer = ({ prestige=[], normal=[] }) => {

  const normalizePrestige = Object.values(prestige).map(nf => ({...nf, values: _normalizeRaidValues(nf.values)}));
  const normalizedNormal = Object.values(normal).map(nf => ({...nf, values: _normalizeRaidValues(nf.values)}));

  const nfNSuccess = normalizedNormal.filter((raid) => raid.values.completionReason === 0 && raid.values.completed === 1).length;
  const nfPSuccess = normalizePrestige.filter((raid) => raid.values.completionReason === 0 && raid.values.completed === 1).length;

  const nfNFails = normalizedNormal.filter(raid => raid.values.completionReason !== 0 && raid.values.completed !== 1).length;
  const nfPFails = normalizePrestige.filter(raid => raid.values.completionReason !== 0 && raid.values.completed !== 1).length;

  return ({
    raidCount: {
      success: {
        normal: nfNSuccess,
        prestige: nfPSuccess
      },
      fail: {
        normal: nfNFails,
        prestige: nfPFails
      }
    }
  });
};

const formatPGCRData = (history) => {
  const normalizedData = history.reduce((accum, data) => [ ...accum, ...data ], []).map(curr => curr.Item);

  return normalizedData.reduce((accum, data) => {
    const instanceId = data.instanceId;
    if (!accum[ instanceId ]) {
      accum[ instanceId ] = data;
    }
    return accum;
  }, {});
};

const calculateDerivedData = (entries, membershipId) => {
  const teamCount = entries.length;
  const totalKills = entries.reduce((teamKills, entry) => {
    return teamKills + entry.values.kills;
  }, 0);

  const killRank = entries.sort((entryOne, entryTwo) => {
    entryOne.values.kills > entryTwo.kills
  }).findIndex(entry => entry.player.membershipId === membershipId) + 1;

  return { teamCount, totalKills, killRank };
};

const activityExtractor = membershipId => history => {
  //TODO: Since history can have null values, that means we are missing something.
  // Not sure how we respond that that when it happens. Some sort of update?
  const cleanHistory = history.filter(curr => !!curr && curr !== null);
  return cleanHistory.map((curr = { entries: []}) => {
    const playerEntry = curr.entries.filter(entry => entry.membershipId === membershipId)[ 0 ];
    const derivedData = calculateDerivedData(curr.entries, membershipId);
    return {
      ...curr.activityDetails,
      ...playerEntry,
      raidDate: curr.raidDate,
      ...derivedData,
      startingPhaseIndex: curr.startingPhaseIndex
    }
  })
};

const normalizeActivity = (activity, activities, membershipId) => {
  const extractActivity = activityExtractor(membershipId);
  const RAIDS = ['LEV', 'EOW', 'SPIRE', 'NF'];

  return RAIDS.reduce((accum, curr) => {
    curr === activity
      ? accum[`${curr}`] = { normal: extractActivity(activities.normal), prestige: extractActivity(activities.prestige) }
        : accum[`${curr}`] = { normal: {}, prestige: {} };

    return accum;
  }, {});
};

const normalizeActivityHistory = (activityHistory, membershipId) => {

  const pgcrData = [
    ...activityHistory.LEV.normal,
    ...activityHistory.LEV.prestige,
    ...activityHistory.EOW.normal,
    ...activityHistory.EOW.prestige,
    ...activityHistory.SPIRE.normal,
    ...activityHistory.SPIRE.prestige,
    ...activityHistory.NF.normal,
    ...activityHistory.NF.prestige
  ];

  const extractActivity = activityExtractor(membershipId);

  const history = {
    raidHistory: {
      LEV: {
        normal: extractActivity(activityHistory.LEV.normal),
        prestige: extractActivity(activityHistory.LEV.prestige)
      },
      EOW: {
        normal: extractActivity(activityHistory.EOW.normal),
        prestige: extractActivity(activityHistory.EOW.prestige)
      },
      SPIRE: {
        normal: extractActivity(activityHistory.SPIRE.normal),
        prestige: extractActivity(activityHistory.SPIRE.prestige)
      }
    },
    nightfallHistory: {
      normal: extractActivity(activityHistory.NF.normal),
      prestige: extractActivity(activityHistory.NF.prestige)
    },
    characterActivities: activityHistory.characterActivities
  };

  return {
    history,
    pgcrData
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
  raidWeeks: _normalizeRaidWeeks,
  epHistory: _normalizeEP,
  raids: normalizeRaidsLikeServer,
  nf: normalizeNightfallLikeServer,
  activityHistory: normalizeActivityHistory,
  activity: normalizeActivity
};

export default normalize;
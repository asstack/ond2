import moment from 'moment';
import { NF_HASHES, RAID_HASHES, EATER_OF_WORLDS as EOW, LEVIATHAN as LEV} from "../actions";

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

const splitNightfallByStrike = ({ normal, prestige }) => {
  console.log('normal clean', normal);
  console.log('prestige clean', prestige);

  const back = Object.entries(NF_HASHES).reduce((accum, nfHash) => {
    const [ id, nfStrike ] = nfHash;
    const name = nfStrike.name.substring(11);

    const normalNightfall = Object.values(normal).filter((run) => run.activityDetails.referenceId == id);
    accum['normal'][name] = accum['normal'][name] ? [...accum['normal'][name], ...normalNightfall]: [...normalNightfall];


    const prestigeNightfall = Object.values(prestige).filter((run) => run.activityDetails.referenceId == id);
    accum['prestige'][name] = accum['prestige'][name] ? [...accum['prestige'][name], ...prestigeNightfall] : [...prestigeNightfall];

    return accum;
  }, {normal: [], prestige: []});

  console.log('normal l', Object.values(normal).length);

  console.log('back n l', Object.values(back.normal).length);

  console.log('back', back);

  return back;
};

const mergeRaidsByWeek = raidHistory =>
  Object.values(raidHistory).reduce((accum, charRaids) => {
    Object.entries(charRaids).map(raidGroup => {
      const [ raidName, raids ] = raidGroup;
      accum[raidName] = accum[raidName] ? accum[raidName] : {};

      Object.entries(raids).forEach(raidEntries => {
        const [ week, weekRaids ] = raidEntries;
        accum[raidName][week] = accum[raidName][week] ? [...accum[raidName][week], ...weekRaids ] : [ ...weekRaids ];
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
      accum[value[0]] = value[1].basic.value;
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

const _normalizeRaidHistory = (activityHistory) => {
  const EOW_RaidWeeks = getRaidWeeks(EOW.launchDate);
  const LEV_RaidWeeks = getRaidWeeks(LEV.launchDate);

  const raidHistory = Object.entries(activityHistory).reduce(
    (accum, entry) => {
      const [charId, raids] = entry;

      const EOW_Raids = raids.filter((curr) => RAID_HASHES.EOW.indexOf(curr.activityDetails.referenceId) >= 0);
      const LEV_Raids = raids.filter((curr) => RAID_HASHES.LEV.indexOf(curr.activityDetails.referenceId) >= 0);

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

const _normalizeNightfallHistory = (nightfallHistory) => {
  const allNightfall = Object.values(nightfallHistory).reduce((accum, history) => {
    Object.entries(history).forEach((data) => {
      const [ mode, strikeData ] = data;
      accum[mode] = !!accum[mode] ? [ ...accum[mode], ...strikeData ] : [ ...strikeData ];
    });

    return accum;
  }, {});

  const combinedNightfall = Object.entries(allNightfall).reduce((accum, normalized) => {
    const [key, nf] = normalized;
    const nightfallRaids = nf.map(strike => ({...strike, values: _normalizeRaidValues(strike.values)}));
    accum[key] = {...nightfallRaids};
    return accum;
  }, {});

  return splitNightfallByStrike(combinedNightfall);
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

const _normalizeRaidWeeks = (raid, history, mode) => {
  const slicedRaid = (
    raid === 'eow'
      ? Object.entries(history.EOW).reverse().slice(0, 5).reverse()
      : Object.entries(history.LEV).reverse().slice(0, 5).reverse()
  );

  if(mode === 'prestige') {
    return (
      slicedRaid.map(curr => [
        curr[0],
        Object.values(curr[1])
          .filter(data => RAID_HASHES[raid].prestige.indexOf(data.activityDetails.referenceId) >= 0)
      ])
    )
  }
  else {
    return (
      slicedRaid.map(curr => [
        curr[0],
        Object.values(curr[1])
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
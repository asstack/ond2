import { fetchBungieActivityHistory } from "./destiny-services";
import { isObjectEmpty } from "./utilities";
import normalize from '../store/normalize';

const fetchQuickHistory = async ({membershipId, characterIds, membershipType}) => {
  try {

    const raidPromises = Promise.all([
      ...characterIds.map(characterId => fetchBungieActivityHistory({characterId, membershipId, membershipType}, {
        page: 0,
        mode: 'raid',
        count: 250
      }))
    ]);

    const nfNormalPromises = Promise.all([
      ...characterIds.map(characterId => fetchBungieActivityHistory({characterId, membershipId, membershipType}, {
        page: 0,
        mode: 46,
        count: 250
      })),
      ...characterIds.map(characterId => fetchBungieActivityHistory({characterId, membershipId, membershipType}, {
        page: 0,
        mode: 16,
        count: 250
      })),
    ]);

    const nfPrestigePromises = Promise.all([
      ...characterIds.map(characterId => fetchBungieActivityHistory({characterId, membershipId, membershipType}, {
        page: 0,
        mode: 47,
        count: 250
      })),
      ...characterIds.map(characterId => fetchBungieActivityHistory({characterId, membershipId, membershipType}, {
        page: 0,
        mode: 17,
        count: 250
      })),
    ]);

    const epPromises = await Promise.all([
      ...characterIds.map(characterId => fetchBungieActivityHistory({characterId, membershipId, membershipType}, { page: 0, mode: 6, count: 250 }))
    ]);

    const [ raidActivity, nfNormalActivities, nfPrestigeActivities, epActivities ] = await Promise.all([ raidPromises, nfNormalPromises, nfPrestigePromises, epPromises ]);

    const [characterOne, characterTwo, characterThree] = raidActivity;

    console.log('characterOne', characterOne);
    console.log('characterTwo', characterTwo);
    console.log('characterThree', characterThree);

    const nfNormalData = isObjectEmpty(nfNormalActivities) ? [] : nfNormalActivities.reduce((accum, data) => [ ...accum, ...data ], []);
    const nfPrestigeData = isObjectEmpty(nfPrestigeActivities) ? [] : nfPrestigeActivities.reduce((accum, data) => [ ...accum, ...data ], []);
    const epData = isObjectEmpty(epActivities) ? [] : epActivities.reduce((accum, data) => [ ...accum, ...data ], []);

    const nightfallHistory = normalize.nf({normal: nfNormalData, prestige: nfPrestigeData});
    const raidHistory = normalize.raids(raidActivity.reduce((accum, data) => [ ...accum, ...data ], []));
    const epHistory = {}; // normalize.ep(epData);


    console.log('nightfallHistory', nightfallHistory);
    console.log('raidHistory', raidHistory);

    return {
      raidCount: raidHistory.raidCount,
      nfCount: nightfallHistory.raidCount
  };

  } catch(error) {
    console.log('Caught Error', error);
    return {};
  }
};

export default fetchQuickHistory;
import { LEADERBOARD_TYPES } from '../../types/leaderboard';
import { EATER_OF_WORLDS, LEVIATHAN } from '../destiny';
import { FIRST_EATER_OF_WORLDS } from './first-eater-of-worlds';
import { FIRST_LEVIATHAN } from './first-leviathan';
import { FIRST_LEVIATHAN_PC } from './first-leviathan-pc';
import { FIRST_LEVIATHAN_PRESTIGE } from './first-prestige-leviathan';

export const LEADERBOARD_VALUES = [{
  raid: LEVIATHAN,
  urlPath: 'leviathan',
  version: 'Normal',
  type: LEADERBOARD_TYPES.FIRST,
  entries: FIRST_LEVIATHAN,
  launchTime: '2017-09-13T17:00:00.000Z',
}, {
  raid: LEVIATHAN,
  urlPath: 'leviathan',
  version: 'Prestige',
  type: LEADERBOARD_TYPES.FIRST,
  entries: FIRST_LEVIATHAN_PRESTIGE,
  launchTime: '2017-10-18T17:00:00.000Z',
}, {
  raid: LEVIATHAN,
  urlPath: 'leviathan',
  version: 'PC',
  type: LEADERBOARD_TYPES.FIRST,
  entries: FIRST_LEVIATHAN_PC,
  launchTime: '2017-11-01T17:00:00.000Z',
}, {
  raid: EATER_OF_WORLDS,
  urlPath: 'eater-of-worlds',
  version: 'Normal',
  type: LEADERBOARD_TYPES.FIRST,
  entries: FIRST_EATER_OF_WORLDS,
  launchTime: '2017-12-08T18:00:00.000Z',
}];
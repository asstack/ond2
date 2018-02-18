export const BUNGIE_URL = 'https://www.bungie.net';
export const SITE_NAME = 'Destiny Raid Report';
export const SITE_SHORT_NAME = 'DRR';
// tslint:disable:no-var-requires no-require-imports
export const SITE_CARD_EMBLEM_IMAGE = require('../images/raid_emblem.jpg');
export const SITE_CARD_BACKGROUND_IMAGE = require('../images/raid_background.jpg');
export const SITE_CARD_BACKGROUND_URL = `url(${SITE_CARD_BACKGROUND_IMAGE})`;
export const SITE_HEADER_IMAGE = require('../images/raid_icon_white.png');
// tslint:enable:no-var-requires no-require-imports

export const MEMBERSHIP_ID_REGEX = new RegExp('^\\d{19}$');

export const RECENT_RAIDS_DISPLAYED = 10;
export const RECENT_RAIDS_DOT_WIDTH = 17.5;
export const RECENT_RAIDS_CONTAINER_HEIGHT = 50;
export const RECENT_RAIDS_CHART_HEIGHT = '90%';

export const MATERIAL_ICONS = {
    cancel: 'cancel',
    check_circle: 'check_circle',
    close: 'close',
    error: 'error',
    search: 'search',
};raid

export const SUCCESS_COLOR = '#4CAF50';
export const ERROR_COLOR = '#F44336';

export const MEMBERSHIP_TYPE_MAP = {
    1: {
        displayName: 'xb',
        displayColor: 'xbox-green',
        icon: XboxIcon,
        displayUrl: true,
    },
    2: {
        displayName: 'ps',
        displayColor: 'ps-blue',
        icon: PSIcon,
        displayUrl: true,
    },
    4: {
        displayName: 'pc',
        displayColor: 'pc-blue',
        icon: PCIcon,
        displayUrl: false,
    },
};

export const REVERSE_MEMBERSHIP_TYPE_MAP = {
    xb: 1,
    ps: 2,
    pc: 4,
};

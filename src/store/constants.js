export const CONTACT_REDDIT = '' +
  'https://www.reddit.com/message/compose/?to=videoflux&subject=OND2%20&message=Please%20include%20your%20Gamertag,%20System,%20and%20contact%20info.';

export const FETCH_LOG = 'FETCH_LOG';
export const SET_CACHE_TIMEOUT = 'set_cache_timeout';
export const SET_PLAYER_PROFILE = 'set_player_profile';
export const SET_ACTIVITY_HISTORY = 'set_activity_history';
export const SET_PGCR = 'set_pgcr';
export const SET_RAID_HISTORY = 'set_raid_history';
export const SET_NF_HISTORY = 'set_nightfall_history';
export const SET_PUBLIC_MILESTONES = 'set_public_milestones';
export const SET_PLAYER_PRIVACY = 'set_player_privacy';
export const SET_ACTIVITY_TYPE = 'set_activity_type';
export const SET_NEW_PLAYER = 'set_new_player';
export const SET_VIEW_MODE = 'set_view_mode';
export const SET_VIEW_RAID = 'set_view_raid';
export const SET_GAMER_TAG_OPTIONS = 'set_gamer_tag_suggestions';
export const SELECT_GAMER_TAG = 'select_gamer_tag';
export const SET_EP_HISTORY = 'set_ep_history';
export const SET_QUICK_STATS = 'set_quick_stats';
export const SET_ID_HISTORY = 'set_id_history';
export const SET_PGCR_HISTORY = 'set_pgcr_history';

export const SET_PGCR_CACHE = 'set_pgcr_cache';
export const SET_ACTIVITY_HISTORY_CACHE = 'set_activity_history_cache';
export const SET_APP_VERSION = 'set_app_version';
export const SET_UPDATE_PROMPT = 'set_update_prompt';
export const SET_PLAYER_CACHE = 'set_player_cache';
export const SET_RAID_VIEW_Y_OFFSET = 'set_raid_view_y_offset';

export const FETCH_PLAYER_PROFILE = 'fetch_player_profile';
export const FETCH_PGCR = 'fetch_pgcr';

export const LOAD_PUBLIC_MILESTONE_DATA = 'load_public_milestone_data';

export const SET_LOADING = 'toggle_loading';
export const TOGGLE_PLAYER_SEARCH = 'set_player_search';
export const SET_SITE_ERROR = 'set_site_error';

export const PLATFORM_MODES = {
  xbox: 1,
  psn: 2,
  blizzard: 4,
  1: 'Xbox',
  2: 'PSN',
  4: 'Blizzard'
};

export const PLATFORM_ICONS = {
  1: '/assets/xbox.png',
  2: '/assets/psn.png',
  4: '/assets/blizzard.jpeg',
  xbox: '/assets/xbox.png',
  psn: '/assets/psn.png',
  blizzard: '/assets/blizzard.jpeg',
};

//None: 0
//TigerXbox: 1
//TigerPsn: 2
//TigerBlizzard: 4
//TigerDemon: 10
//BungieNext: 254
//All: -1

export const activityModes = {
  0: 'none',
  2: 'Story',
  3: 'Strike',
  4: 'Raid',
  5: 'allPvP',
  6: 'patrol',
  7: 'allPvE',
  10: 'control',
  16: 'nightfall',
  17: 'heroicNightfall'
};
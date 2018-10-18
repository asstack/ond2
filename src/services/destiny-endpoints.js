import { destinyBaseURL } from "../consts";

const apiType = {
  destiny2: `${destinyBaseURL}/Platform/Destiny2`,
  group: `${destinyBaseURL}/Platform/GroupV2`
};

const searchDestinyPlayer = ({ displayName, membershipType }) =>
  `${apiType.destiny2}/SearchDestinyPlayer/${membershipType}/${displayName}/`;

const getProfile = ({ membershipId, membershipType, }) =>
  `${apiType.destiny2}/${membershipType}/Profile/${membershipId}/`;

const getGroupsForMember = (pathParams) => {
  const { filter, groupType, userInfo: { membershipId, membershipType } } = pathParams;
  return `${apiType.group}/User/${membershipType}/${membershipId}/${filter}/${groupType}/`;
};

const getDestinyAsset = (path) => {
  return `${destinyBaseURL}${path}`
};

/*
Query String Params
  - count: Number of Rows to return
  - mode: Filter for activity mode to be returned
  - page: Page number to return, starting with 0
*/

const getActivityHistory = (pathParams) => {
  const { characterId, membershipId, membershipType } = pathParams;
  return `${apiType.destiny2}/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/`;
};

const getAggregateActivityStats = (pathParams) => {
  const { characterId, membershipId, membershipType } = pathParams;
  return `${apiType.destiny2}/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/AggregateActivityStats/`;
};

const getPostGameCarnageReport = (instanceId) => `${apiType.destiny2}/Stats/PostGameCarnageReport/${instanceId}/`;

const getPublicMilestones = () => `${apiType.destiny2}/Milestones/`;

export {
  destinyBaseURL,
  searchDestinyPlayer,
  getProfile,
  getGroupsForMember,
  getActivityHistory,
  getAggregateActivityStats,
  getPostGameCarnageReport,
  getPublicMilestones,
  getDestinyAsset
}
import { awsURL } from '../actions';
import { applyQueryStringParams } from "./utilities";
import {
  searchDestinyPlayer,
  getProfile,
  getGroupsForMember,
  getActivityHistory,
  getAggregateActivityStats,
  getPostGameCarnageReport,
} from "./destiny-endpoints";
import { isObjectEmpty } from "./utilities";

const destinyHeaders = new Headers({
  'Content-Type': 'application/json',
  'X-API-KEY': '06aa4878af6c4eee88f5c0292dcf4df6'
});

const destinyInit = {
  method: 'GET',
  headers: destinyHeaders,
  mode: 'cors',
  credentials: 'include'
};

const searchPlayer = async pathParams => {
  const url = applyQueryStringParams(searchDestinyPlayer(pathParams), { components: 100 });
  const res = await fetch(url, destinyInit);
  const playerData = await res.json();
  return playerData.Response;
};

const fetchProfile = async membershipId => {
  const res = await fetch(`${awsURL}/profile/${membershipId}`,  { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchCharacters = async pathParams => {
  const url = applyQueryStringParams(getProfile(pathParams), { components: 200 });
  const res = await fetch(url, destinyInit);
  const characters = await res.json();
  return isObjectEmpty(characters.Response) ? {} : characters.Response.characters.data;
};

const fetchGroupsForMembers = async pathParams => {
  const res = await fetch(getGroupsForMember(pathParams), destinyInit);
  const groups = await res.json();
  return isObjectEmpty(groups.Response) ? {} : groups.Response.results
};

// count, mode, page
const fetchActivityHistory = async (pathParams, queryParams) => {
  const url = applyQueryStringParams(getActivityHistory(pathParams), queryParams);
  const res = await fetch(url, destinyInit);
  const activityHistory = await res.json();
  return (
    !!activityHistory.Response
    ? isObjectEmpty(activityHistory.Response) ? [] : activityHistory.Response.activities
    : { error: activityHistory.Message }
  )
};

const fetchActivityStatsAggregate = async (pathParams) => {
  const url = applyQueryStringParams(getAggregateActivityStats(pathParams));
  const res = await fetch(url, destinyInit);
  const activityHistory = await res.json();
  return isObjectEmpty(activityHistory.Response) ? {} : activityHistory.Response.activities;
};

const fetchPostGameCarnageReport = async (activityId) => {
  const url = getPostGameCarnageReport(activityId);
  const res = await fetch(url, destinyInit);
  const carnageReport = await res.json();
  return carnageReport.Response;
};

const fetchPublicMilestones = async () => {
  const res = await fetch(`${awsURL}/milestones`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

export {
  searchPlayer,
  fetchProfile,
  fetchCharacters,
  fetchGroupsForMembers,
  fetchActivityHistory,
  fetchActivityStatsAggregate,
  fetchPostGameCarnageReport,
  fetchPublicMilestones
};
import { applyQueryStringParams } from "./utilities";
import {
  searchDestinyPlayer,
  getProfile,
  getGroupsForMember,
  getActivityHistory,
  getAggregateActivityStats,
  getPostGameCarnageReport
} from "./destiny-endpoints";


const destinyHeaders = new Headers({
  'Content-Type': 'application/json',
  'X-API-KEY': 'b4c2d019990f452e8c3d40f5d279ac04'
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
  console.log('playerData', playerData);
  return playerData.Response[0];
};

const fetchProfile = async pathParams => {
  const url = applyQueryStringParams(getProfile(pathParams), { components: 100 });
  const res = await fetch(url, destinyInit);
  const playerProfile = await res.json();
  return playerProfile.Response.profile.data;
};

const fetchCharacters = async pathParams => {
  const url = applyQueryStringParams(getProfile(pathParams), { components: 200 });
  const res = await fetch(url, destinyInit);
  const characters = await res.json();
  console.log('chars', characters);
  return characters.Response.characters.data;
};

const fetchGroupsForMembers = async pathParams => {
  const res = await fetch(getGroupsForMember(pathParams), destinyInit);
  const groups = await res.json();
  return groups.Response.results;
};

// count, mode, page
const fetchActivityHistory = async (pathParams, queryParams={ page: 0, mode: 'raid', count: 250 }) => {
  const url = applyQueryStringParams(getActivityHistory(pathParams), queryParams);
  const res = await fetch(url, destinyInit);
  const activityHistory = await res.json();
  return activityHistory.Response.activities;
};

const fetchActivityStatsAggregate = async (pathParams) => {
  const url = applyQueryStringParams(getAggregateActivityStats(pathParams));
  const res = await fetch(url, destinyInit);
  const activityHistory = await res.json();
  return activityHistory.Response.activities;
};

const fetchPostGameCarnageReport = async (activityId) => {
  const url = getPostGameCarnageReport(activityId);
  const res = await fetch(url, destinyInit);
  const carnageReport = await res.json();
  return carnageReport.Response;
};

export {
  searchPlayer,
  fetchProfile,
  fetchCharacters,
  fetchGroupsForMembers,
  fetchActivityHistory,
  fetchActivityStatsAggregate,
  fetchPostGameCarnageReport
};
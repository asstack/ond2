import { awsURL } from '../actions';
import { applyQueryStringParams } from "./utilities";
import {
  searchDestinyPlayer,
  getProfile,
  getGroupsForMember,
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
  const res = await fetch(`${awsURL}/profile/${membershipId}`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchActivityHistory = async membershipId => {
  const res = await fetch(`${awsURL}/activityHistory/${membershipId}`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchFallbackActivityHistory = async (data) => {
  const bodyData = JSON.stringify(data);
  const res = await fetch(`${awsURL}/fallbackActivityHistory`, { method: 'POST', headers: destinyHeaders, mode: 'cors', body: bodyData });
  return await res.json();
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
  fetchActivityHistory,
  fetchFallbackActivityHistory,
  fetchPostGameCarnageReport,
  fetchPublicMilestones
};
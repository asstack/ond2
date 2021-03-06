import { awsURL } from '../consts';
import { applyQueryStringParams } from "./utilities";
import {
  searchDestinyPlayer,
  getActivityHistory,
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

const searchPlayer = async (userName) => {
  const res = await fetch(`${awsURL}/player/${userName}`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchProfile = async membershipId => {
  const res = await fetch(`${awsURL}/profile/${membershipId}`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchBungieActivityHistory = async (pathParams, queryStringParams) => {
  const url = applyQueryStringParams(getActivityHistory(pathParams), queryStringParams);
  const res = await fetch(url, destinyInit);
  const activityHistory = await res.json();
  return (
    !!activityHistory.Response
      ? isObjectEmpty(activityHistory.Response)
        ? []
          : activityHistory.Response.activities
      : { error: res.Message }
  );
};

const fetchActivityHistory = async membershipId => {
  const res = await fetch(`${awsURL}/activityHistory/${membershipId}`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchExactActivityHistory = async (membershipId, activityName) => {
  const res = await fetch(`${awsURL}/activityHistory/${membershipId}/${activityName}`, { method: 'GET', mode: 'cors' });
  return await res.json();
};

const fetchFallbackActivityHistory = async (data) => {
  const bodyData = JSON.stringify(data);
  const res = await fetch(`${awsURL}/fallbackActivityHistory`, { method: 'POST', headers: destinyHeaders, mode: 'cors', body: bodyData });
  return await res.json();
};

const fetchActivityUpdate = async membershipId => {
  const res = await fetch(`${awsURL}/getActivityUpdate/${membershipId}`, { method: 'GET', mode: 'cors' });
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
  fetchPublicMilestones,
  fetchActivityUpdate,
  fetchBungieActivityHistory,
  fetchExactActivityHistory
};
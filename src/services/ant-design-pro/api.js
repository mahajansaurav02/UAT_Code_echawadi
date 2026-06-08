// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
const servarthId = localStorage.getItem('servarthId');

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// usage

/** get current user GET /api/currentUser */
//8091 - portal
// export async function currentUser(options) {
//   // return request('api/currentUser', {
//   // return request('https://testechawadi.mahabhumi.gov.in/echawdi/auth/currentUser', {
//   // return request('https://115.124.105.230:8091/echawdi/auth/currentUser', {
//   // return request('http://115.124.110.193:8089/echawdi/auth/currentUser', {
//   //---UAT
//   // return request('http://115.124.110.193:8091/echawdi/auth/currentUser', {
//   //---LIVE
//   return request('https://echawadi.mahabhumi.gov.in/echawdi/auth/currentUser', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// FOr UAT refer this code

// export async function currentUser(options) {
// const token = getCookie('token');
// console.log(token);
//   //---UAT
//   return request('http://115.124.110.193:8091/echawdi/auth/currentUser', {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,   // 🔥 important
//     },
//     ...(options || {}),
//   });
// }

/** Log out of the login interface POST /api/login/outLogin */

// export async function outLogin(options) {
//   // return request('api/login/outLogin', {
//   // return request('https://testechawadi.mahabhumi.gov.in/echawdi/auth/login/outLogin', {
//   // return request('https://115.124.105.230:8091/echawdi/auth/login/outLogin', {
//   //return request('http://115.124.110.193:8089/echawdi/auth/login/outLogin', {
//   //---UAT
//   // return request('http://115.124.110.193:8091/echawdi/auth/login/outLogin', {
//   //---LIVE
//   return request('https://echawadi.mahabhumi.gov.in/echawdi/auth/login/outLogin', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }
/** login interface POST /api/login/account */

export async function outLogin(options) {
  // return request('api/login/outLogin', {
  // return request('https://testechawadi.mahabhumi.gov.in/echawdi/auth/login/outLogin', {
  // return request('https://115.124.105.230:8091/echawdi/auth/login/outLogin', {
  //return request('http://115.124.110.193:8089/echawdi/auth/login/outLogin', {
  //---UAT
  // return request('http://115.124.110.193:8091/echawdi/auth/login/outLogin', {
  //---LIVE
  // return request('https://echawadi.mahabhumi.gov.in/echawdi/auth/login/outLogin', {
  return request(`http://115.124.110.193:8091/echawdi/auth/logout?servarthId=${servarthId}`, {
    //
    method: 'POST',

    ...(options || {}),
  });
}

export async function login(body, options) {
  const token = getCookie('token');
  console.log(token);
  // return request('api/login/account', {
  // return request('https://testechawadi.mahabhumi.gov.in/echawdi/auth/login/account', {
  // return request('https://115.124.105.230:8091/echawdi/auth/login/account', {
  // return request('http://115.124.110.193:8089/echawdi/auth/login/account', {
  //---UAT
  // return request('http://115.124.110.193:8091/echawdi/auth/login/account', {
  //---LIVE
  return request('http://115.124.110.193:8091/echawdi/auth/login/account', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // 🔥 important
    },
    data: body,
    ...(options || {}),
  });
}
/** There are no annotations provided by the backend here GET /api/notices */

export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
/** Get a list of rules GET /api/rule */

export async function rule(params, options) {
  return request('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** New rule PUT /api/rule */

export async function updateRule(options) {
  return request('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}
/** New Rule POST /api/rule */

export async function addRule(options) {
  return request('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}
/** delete Rule DELETE /api/rule */

export async function removeRule(options) {
  return request('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

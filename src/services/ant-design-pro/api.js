// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** get current user GET /api/currentUser */
//8091 - portal
export async function currentUser(options) {
  // return request('api/currentUser', {
  // return request('http://115.124.110.193:8089/echawdi/auth/currentUser', {
  //---UAT
  //return request('http://115.124.110.193:8091/echawdi/auth/currentUser', {
  //---LIVE
  return request('https://echawadi.mahabhumi.gov.in/echawdi/auth/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}
/** Log out of the login interface POST /api/login/outLogin */

export async function outLogin(options) {
  // return request('api/login/outLogin', {
  //return request('http://115.124.110.193:8089/echawdi/auth/login/outLogin', {
  //---UAT
  //return request('http://115.124.110.193:8091/echawdi/auth/login/outLogin', {
  //---LIVE
  return request('https://echawadi.mahabhumi.gov.in/echawdi/auth/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
/** login interface POST /api/login/account */

export async function login(body, options) {
  // return request('api/login/account', {
  // return request('http://115.124.110.193:8089/echawdi/auth/login/account', {
  //---UAT
  //return request('http://115.124.110.193:8091/echawdi/auth/login/account', {
  //---LIVE
  return request('https://echawadi.mahabhumi.gov.in/echawdi/auth/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

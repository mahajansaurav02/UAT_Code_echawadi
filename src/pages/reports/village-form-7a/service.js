import { request } from 'umi';
export async function fakeSubmitForm(params) {
  return request('/api/report', {
    method: 'POST',
    data: params,
  });
}

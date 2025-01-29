import { request } from 'umi';
export async function fakeGRevenue_Submit() {
  return request('/api/receipt(view)');
}

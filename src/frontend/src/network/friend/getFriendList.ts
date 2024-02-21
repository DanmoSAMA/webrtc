/**
 * description: 获取好友列表
 * date: 2022-11-03 17:57:12 +0800
 */

import request from '../request';

export async function getFriendList(): Promise<any> {
  const url = '/api/friend/list';
  const { code, data } = await request(url, { method: 'GET', useToken: true });
  return { code, data };
}

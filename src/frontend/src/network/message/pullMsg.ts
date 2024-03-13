/**
 * description: 拉取消息
 * date: 2022-11-02 21:10:38 +0800
 */

import request from '../request';

export async function pullMsg(): Promise<any> {
  const url = '/api/msg/pull';
  const { code, data } = await request(url, { method: 'GET', useToken: true });
  return { code, data };
}

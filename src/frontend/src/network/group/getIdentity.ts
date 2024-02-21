/**
 * description: 获取权限等级
 * date: 2024-02-15 09:41:07 +0800
 */

import request from '../request';

export interface IGetIdentity {
  gid: number;
}

export async function getIdentity(reqData: IGetIdentity): Promise<any> {
  const url = '/api/group/identity';
  const { code, data } = await request(
    url,
    { method: 'POST', useToken: true },
    reqData,
  );
  return { code, data };
}

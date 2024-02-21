/**
 * description: 获取群成员列表
 * date: 2024-02-16 13:31:25 +0800
 */

import request from '../request';

export interface IgetGroupInfo {
  gid: number;
}

export async function getGroupInfo(reqData: IgetGroupInfo): Promise<any> {
  const url = '/api/group/info';
  const { code, data } = await request(
    url,
    { method: 'POST', useToken: true },
    reqData,
  );
  return { code, data };
}

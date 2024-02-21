/**
 * description: 获取用户信息
 * date: 2022-10-28 23:35:52 +0800
 */

import request from '../request';

export async function getUserInfo(): Promise<any> {
  const url = '/api/user/info';
  const { code, data } = await request(url, { method: 'GET', useToken: true });
  return { code, data };
}

interface IGetUserInfoById {
  uid: number;
}

export async function getUserInfoById(reqData: IGetUserInfoById): Promise<any> {
  const url = '/api/user/info';
  const { code, data } = await request(
    url,
    {
      method: 'POST',
      useToken: true,
    },
    reqData,
  );
  return { code, data };
}

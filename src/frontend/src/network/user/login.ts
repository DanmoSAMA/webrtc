/**
 * description: 登录
 * author: Yuming Cui
 * date: 2022-10-28 23:35:52 +0800
 */

import { socket } from '@/App';
import request from '../request';

export interface ILogin {
  uid: number;
  password: string;
}

export async function login(reqData: ILogin): Promise<any> {
  const url = '/api/user/login';
  const { code, data } = await request(
    url,
    { method: 'POST', useToken: false },
    reqData,
  );

  socket.emit('login', {
    uid: reqData.uid,
  });

  return { code, data };
}

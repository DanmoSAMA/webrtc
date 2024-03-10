/**
 * description: 重新建立连接
 * date: 2024-03-10 14:47:15 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IReconnect {
  gid: any;
}

export function reconnect(reqData: IReconnect): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'reconnect group video request',
      {
        senderToken: getToken(),
        gid: reqData.gid,
      },
      (code: HttpCode, data: any) => {
        resolve({ code, data });
      },
    );
  });
}

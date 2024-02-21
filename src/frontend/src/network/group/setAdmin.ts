/**
 * description: 设置/取消管理员
 * date: 2024-02-17 16:09:43 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ISetAdmin {
  gid: number;
  uid: number;
}

export async function setAdmin(reqData: ISetAdmin): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'set group admin request',
      {
        senderToken: getToken(),
        gid: reqData.gid,
        uid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

export async function cancelAdmin(reqData: ISetAdmin): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'cancel group admin request',
      {
        senderToken: getToken(),
        gid: reqData.gid,
        uid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

/**
 * description: 移出群聊
 * date: 2024-02-17 16:09:43 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IGivePlaneTicket {
  gid: number;
  uid: number;
}

export async function givePlaneTicket(reqData: IGivePlaneTicket): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'give plane ticket request',
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

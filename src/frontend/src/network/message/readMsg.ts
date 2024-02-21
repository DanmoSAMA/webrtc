/**
 * description: 消息已读
 * date: 2022-11-05 16:18:30 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IReadMsg {
  mid: number;
}

export async function readMsg(reqData: IReadMsg): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'read message request',
      {
        receiverToken: getToken(),
        mid: reqData.mid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

/**
 * description: 开始视频/语音通话
 * date: 2024-02-21 23:07:08 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ICall {
  uid: any;
}

export function call(reqData: ICall): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'call request',
      {
        senderToken: getToken(),
        receiverUid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

/**
 * description: 转换为接收者
 * date: 2024-03-09 20:15:10 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ISwitchToReceiver {
  uid: any;
}

export function switchToReceiver(reqData: ISwitchToReceiver): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'switch to receiver request',
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

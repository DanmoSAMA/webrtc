/**
 * description: 从接收者转换为发送者
 * date: 2024-03-02 16:55:18 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ISwitchToSender {
  uid: any;
}

export function switchToSender(reqData: ISwitchToSender): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'switch to sender request',
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

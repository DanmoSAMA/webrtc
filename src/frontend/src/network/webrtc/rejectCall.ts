/**
 * description: 拒绝通话
 * date: 2024-03-02 15:32:55 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IRejectCall {
  uid: any;
}

export function rejectCall(reqData: IRejectCall): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'reject call request',
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

/**
 * description: 同意通话
 * date: 2024-03-09 19:48:16 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IAcceptCall {
  uid: any;
}

export function acceptCall(reqData: IAcceptCall): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'accept call request',
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

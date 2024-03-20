/**
 * description: 拒绝桌面共享
 * date: 2024-03-20 00:06:12 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IRejectShareDesktop {
  uid: any;
}

export function rejectShareDesktop(reqData: IRejectShareDesktop): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'reject share desktop request',
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

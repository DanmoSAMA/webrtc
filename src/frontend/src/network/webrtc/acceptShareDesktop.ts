/**
 * description: 同意桌面共享
 * date: 2024-03-20 00:04:53 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IAcceptShareDesktop {
  uid: any;
}

export function acceptShareDesktop(reqData: IAcceptShareDesktop): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'accept share desktop request',
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

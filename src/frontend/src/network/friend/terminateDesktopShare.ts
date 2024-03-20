/**
 * description: 结束桌面共享
 * date: 2024-03-20 22:01:29 +0800
 */

import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ITerminateDesktopShare {
  uid: any;
}

export function terminateDesktopShare(
  reqData: ITerminateDesktopShare,
): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'terminate desktop share request',
      {
        receiverUid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

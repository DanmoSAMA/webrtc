/**
 * description: 开始共享桌面
 * date: 2024-03-19 23:58:56 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IShareDesktop {
  uid: any;
}

export function shareDesktop(reqData: IShareDesktop): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'share desktop request',
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

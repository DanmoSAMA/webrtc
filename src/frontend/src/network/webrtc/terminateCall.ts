/**
 * description: 开始视频/语音通话
 * date: 2024-02-21 23:07:08 +0800
 */

import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ITerminateCall {
  uid: any;
}

export function terminateCall(reqData: ITerminateCall): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'terminate call request',
      {
        receiverUid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

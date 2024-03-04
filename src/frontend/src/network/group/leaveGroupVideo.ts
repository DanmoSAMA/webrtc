/**
 * description: 退出群语音
 * date: 2024-03-03 14:01:53 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ILeaveGroupVideo {
  gid: any;
}

export function leaveGroupVideo(reqData: ILeaveGroupVideo): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'leave group video request',
      {
        senderToken: getToken(),
        gid: reqData.gid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

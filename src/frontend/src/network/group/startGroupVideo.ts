/**
 * description: 群语音
 * date: 2024-03-03 12:05:54 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IStartGroupVideo {
  gid: any;
}

export function startGroupVideo(reqData: IStartGroupVideo): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'start group video request',
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

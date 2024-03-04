/**
 * description: 加入群语音
 * date: 2024-03-03 15:38:38 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IJoinGroupVideo {
  gid: any;
}

export function joinGroupVideo(reqData: IJoinGroupVideo): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'join group video request',
      {
        senderToken: getToken(),
        gid: reqData.gid,
      },
      (code: HttpCode) => {
        console.log('😄', code);
        resolve({ code, data: null });
      },
    );
  });
}

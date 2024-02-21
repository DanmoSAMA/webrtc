/**
 * description: 退群
 * date: 2022-11-01 15:23:05 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IQuitGroup {
  gid: any;
}

export async function quitGroup(reqData: IQuitGroup): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'quit group request',
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

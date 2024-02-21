/**
 * description: 同意添加好友
 * author: Yuming Cui
 * date: 2022-11-01 19:56:41 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IAcceptFriend {
  targetUid: number; // 对方的uid
  mid: number;
}

export async function acceptFriend(reqData: IAcceptFriend): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'accept friend request',
      {
        senderToken: getToken(),
        targetUid: reqData.targetUid,
        mid: reqData.mid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

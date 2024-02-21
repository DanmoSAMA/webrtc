/**
 * description: 删除好友
 * date: 2024-02-18 14:00:15 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IDeleteFriend {
  uid: any;
}

export function deleteFriend(reqData: IDeleteFriend): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'delete friend request',
      {
        senderToken: getToken(),
        uid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

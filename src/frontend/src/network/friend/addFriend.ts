/**
 * description: 请求添加好友
 * date: 2022-11-01 19:51:42 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IAddFriend {
  receiver: string;
  messageContent: string;
}

export function addFriend(reqData: IAddFriend): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'add friend request',
      {
        senderToken: getToken(),
        receiverUid: reqData.receiver,
        content: reqData.messageContent,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

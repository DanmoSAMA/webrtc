/**
 * description: 添加好友
 * date: 2024-02-18 14:19:11 +0800
 */

import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageType } from '../../../../shared/enums';
import {
  hasSameAddFriendReq,
  isFriend,
  isUserExist,
  saveMsgToDb,
} from '../socketUtils';

export function onAddFriend(io: any, socket: Socket) {
  socket.on(
    'add friend request',
    async ({ senderToken, receiverUid, content }, callback) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      // 如果已经有好友请求并且没处理，新的请求不再受理
      if (await hasSameAddFriendReq(senderUid, receiverUid)) {
        callback(HttpCode.REQ_HAS_EXISTED);
        return;
      }

      if (await isFriend(senderUid, receiverUid)) {
        callback(HttpCode.HAS_BEEN_FRIEND);
        return;
      }

      if (!(await isUserExist(receiverUid))) {
        callback(HttpCode.USER_NOT_EXIST);
        return;
      }

      const msg = await saveMsgToDb({
        senderUid,
        receiver: receiverUid,
        content,
        type: MessageType.FriendRequestNotify,
      });

      io.emit('add friend received', msg);

      callback(HttpCode.OK);
    },
  );
}

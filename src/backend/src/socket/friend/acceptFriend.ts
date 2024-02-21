/**
 * description: 同意好友申请
 * date: 2024-02-18 15:32:16 +0800
 */

import { FriendshipModel } from '@models/friendship';
import { MsgModel } from '@models/msg';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageStatus } from '../../../../shared/enums';
import { Socket } from 'socket.io';

export function onAcceptFriend(io: any, socket: Socket) {
  socket.on(
    'accept friend request',
    async ({ senderToken, targetUid, mid }, callback) => {
      let myUid = '';
      if (isTokenValid(senderToken)) {
        myUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      try {
        const newFriendship = new FriendshipModel({
          uid1: myUid,
          uid2: targetUid,
        });
        await newFriendship.save();

        const friendReqMsg = await MsgModel.findOne({ mid });
        friendReqMsg.status = MessageStatus.Accepted;
        await friendReqMsg.save();

        io.emit('accept friend received', targetUid);

        callback(HttpCode.OK);
      } catch (err) {
        callback(HttpCode.ACCEPT_MSG_ERROR);
      }
    },
  );
}

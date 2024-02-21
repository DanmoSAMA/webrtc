/**
 * description: 同意加群
 * date: 2024-02-18 15:37:31 +0800
 */

import { GroupModel } from '@models/group';
import { MsgModel } from '@models/msg';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageStatus } from '../../../../shared/enums';

export function onAcceptJoinGroup(io: any, socket: Socket) {
  socket.on(
    'accept join group request',
    async ({ senderToken, applicantUid, gid, mid }, callback) => {
      let myUid = '';
      if (isTokenValid(senderToken)) {
        myUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      try {
        const group = await GroupModel.findOne({ gid });
        if (!group.members.includes(applicantUid)) {
          group.members.push(applicantUid);
          await group.save();
        }

        const joinGroupReqMsg = await MsgModel.findOne({ mid });
        joinGroupReqMsg.status = MessageStatus.Accepted;
        await joinGroupReqMsg.save();

        io.emit('accept join group received', {
          operatorUid: myUid,
          gid,
          applicantUid,
        });

        callback(HttpCode.OK);
      } catch (err) {
        callback(HttpCode.ACCEPT_MSG_ERROR);
      }
    },
  );
}

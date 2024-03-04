/**
 * description: 离开群语音
 * date: 2024-03-03 15:51:58 +0800
 */

import { Socket } from 'socket.io';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { groupVideoChatRooms } from '..';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onLeaveGroupVideo(io: any, socket: Socket) {
  socket.on(
    'leave group video request',
    async ({ senderToken, gid }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const sender = await UserModel.findOne({ uid: senderUid });
      const temp = groupVideoChatRooms.find((item) => item.gid === gid);

      if (temp) {
        temp.memberList = temp.memberList.filter(
          (user) => user.uid !== senderUid,
        );

        io.emit('leave group video received', sender, gid, temp.memberList);
        callback(HttpCode.OK);
      } else {
        callback(HttpCode.LEAVE_GROUP_VIDEO_ERROR);
      }
    },
  );
}

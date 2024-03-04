/**
 * description: 群语音
 * date: 2024-03-03 12:15:50 +0800
 */

import { Socket } from 'socket.io';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { UserModel } from '@models/user';
import { groupVideoChatRooms } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onStartGroupVideo(io: any, socket: Socket) {
  socket.on(
    'start group video request',
    async ({ senderToken, gid }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const sender = await UserModel.findOne({ uid: senderUid });
      const temp = groupVideoChatRooms.find((item) => item.gid === gid);
      if (!temp) {
        groupVideoChatRooms.push({ gid, memberList: [sender] });
      } else if (temp.memberList.length === 0) {
        temp.memberList.push(sender);
      }

      io.emit('start group video received', sender, gid);
      callback(HttpCode.OK);
    },
  );
}

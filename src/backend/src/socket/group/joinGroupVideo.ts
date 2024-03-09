/**
 * description: 加入群语音
 * date: 2024-03-03 15:51:46 +0800
 */

import { Socket } from 'socket.io';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { groupVideoChatRooms } from '..';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onJoinGroupVideo(io: any, socket: Socket) {
  socket.on(
    'join group video request',
    async ({ senderToken, gid }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const sender = await UserModel.findOne({ uid: senderUid });
      const temp = groupVideoChatRooms.find((item) => item.gid === gid);

      if (temp && !temp.memberList.includes(sender)) {
        console.log('🐱');
        temp.memberList.push(sender);
      }

      io.emit('join group video received', gid, temp.memberList, sender);
      callback(HttpCode.OK, temp.memberList);
    },
  );
}

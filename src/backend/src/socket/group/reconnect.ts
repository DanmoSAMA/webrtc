/**
 * description: 重新建立连接
 * date: 2024-03-10 14:48:32 +0800
 */

import { Socket } from 'socket.io';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { groupVideoChatRooms } from '..';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onReconnect(io: any, socket: Socket) {
  socket.on(
    'reconnect group video request',
    async ({ senderToken, gid }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const sender = await UserModel.findOne({ uid: senderUid });
      const temp = groupVideoChatRooms.find((item) => item.gid === gid);

      io.emit('reconnect group video received', gid, sender);
      callback(HttpCode.OK, temp.memberList);
    },
  );
}

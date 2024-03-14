/**
 * description: 发送文件
 * date: 2024-03-13 22:49:28 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onSendFile(io: any, socket: Socket) {
  socket.on(
    'send file request',
    async ({ senderToken, receiverUid, fileName }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const socketId = socketIdMap.get(receiverUid);
      const sender = await UserModel.findOne({ uid: senderUid });

      socket.to(socketId).emit('send file received', sender, fileName);
      callback(HttpCode.OK);
    },
  );
}

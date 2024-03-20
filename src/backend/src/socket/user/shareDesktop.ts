/**
 * description: 共享桌面
 * date: 2024-03-20 00:00:38 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onShareDesktop(io: any, socket: Socket) {
  socket.on(
    'share desktop request',
    async ({ senderToken, receiverUid }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const socketId = socketIdMap.get(receiverUid);
      const sender = await UserModel.findOne({ uid: senderUid });

      socket.to(socketId).emit('share desktop received', sender);
      callback(HttpCode.OK);
    },
  );
}

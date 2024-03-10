/**
 * description: 转换为发送者
 * date: 2024-03-02 16:57:10 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { UserModel } from '@models/user';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onSwitchToSender(io: any, socket: Socket) {
  socket.on(
    'switch to sender request',
    async ({ senderToken, receiverUid }, callback) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const socketId = socketIdMap.get(receiverUid);
      const sender = await UserModel.findOne({ uid: senderUid });

      socket.to(socketId).emit('switch to sender received', sender);
      callback(HttpCode.OK);
    },
  );
}

/**
 * description: 同意通话
 * date: 2024-03-09 19:51:57 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onAcceptCall(io: any, socket: Socket) {
  socket.on(
    'accept call request',
    async ({ senderToken, receiverUid }, callback) => {
      const socketId = socketIdMap.get(receiverUid);

      socket.to(socketId).emit('accept call received');
      callback(HttpCode.OK);
    },
  );
}

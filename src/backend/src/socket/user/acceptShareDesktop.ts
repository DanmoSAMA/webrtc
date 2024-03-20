/**
 * description: 同意桌面共享
 * date: 2024-03-20 00:08:07 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onAcceptShareDesktop(io: any, socket: Socket) {
  socket.on(
    'accept share desktop request',
    async ({ senderToken, receiverUid }, callback) => {
      const socketId = socketIdMap.get(receiverUid);

      socket.to(socketId).emit('accept share desktop received');
      callback(HttpCode.OK);
    },
  );
}

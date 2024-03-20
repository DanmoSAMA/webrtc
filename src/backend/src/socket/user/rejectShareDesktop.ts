/**
 * description: 拒绝通话
 * date: 2024-03-02 15:33:45 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onRejectShareDesktop(io: any, socket: Socket) {
  socket.on(
    'reject share desktop request',
    async ({ senderToken, receiverUid }, callback) => {
      const socketId = socketIdMap.get(receiverUid);

      socket.to(socketId).emit('reject share desktop received');
      callback(HttpCode.OK);
    },
  );
}

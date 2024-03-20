/**
 * description: 终止桌面共享
 * date: 2024-03-20 22:03:31 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onTerminateDesktopShare(io: any, socket: Socket) {
  socket.on(
    'terminate desktop share request',
    async ({ receiverUid }, callback) => {
      const socketId = socketIdMap.get(receiverUid);

      socket.to(socketId).emit('terminate desktop share received');
      callback(HttpCode.OK);
    },
  );
}

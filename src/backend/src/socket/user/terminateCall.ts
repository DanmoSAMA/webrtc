/**
 * description: 通话
 * date: 2024-02-21 23:03:51 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onTerminateCall(io: any, socket: Socket) {
  socket.on('terminate call request', async ({ receiverUid }, callback) => {
    const socketId = socketIdMap.get(receiverUid);

    socket.to(socketId).emit('terminate call received');
    callback(HttpCode.OK);
  });
}

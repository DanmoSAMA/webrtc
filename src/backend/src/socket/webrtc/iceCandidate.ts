/**
 * description: ice candidate
 * date: 2024-02-21 23:00:52 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';

export function onIceCandidate(io: any, socket: Socket) {
  socket.on('ice candidate request', (candidate, receiverUid) => {
    const socketId = socketIdMap.get(receiverUid);

    socket.to(socketId).emit('ice candidate received', candidate);
  });
}

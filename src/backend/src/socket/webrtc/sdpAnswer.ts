/**
 * description: sdp answer
 * date: 2024-02-21 23:00:52 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';

export function onSdpAnswer(io: any, socket: Socket) {
  socket.on('sdp answer request', (answer, senderUid) => {
    const socketId = socketIdMap.get(senderUid);

    socket.to(socketId).emit('sdp answer received', answer);
  });
}

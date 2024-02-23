/**
 * description: sdp offer
 * date: 2024-02-21 23:00:52 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';

export function onSdpOffer(io: any, socket: Socket) {
  socket.on('sdp offer request', (offer, receiverUid) => {
    const socketId = socketIdMap.get(receiverUid);

    socket.to(socketId).emit('sdp offer received', offer);
  });
}

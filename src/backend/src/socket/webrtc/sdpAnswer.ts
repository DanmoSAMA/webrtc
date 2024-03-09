/**
 * description: sdp answer
 * date: 2024-02-21 23:00:52 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { UserModel } from '@models/user';
import { isTokenValid, decodeToken } from '@utils/jwt';

export function onSdpAnswer(io: any, socket: Socket) {
  socket.on('sdp answer request', async (answer, senderUid, receiverToken) => {
    let receiverUid;
    if (isTokenValid(receiverToken)) {
      receiverUid = decodeToken(receiverToken);
    }
    const socketId = socketIdMap.get(senderUid);
    const receiver = await UserModel.findOne({ uid: receiverUid });

    socket.to(socketId).emit('sdp answer received', answer, receiver);
  });
}

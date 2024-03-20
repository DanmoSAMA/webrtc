/**
 * description: 通话
 * date: 2024-02-21 23:03:51 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onCall(io: any, socket: Socket) {
  socket.on('call request', async ({ senderToken, receiverUid }, callback) => {
    let senderUid;
    if (isTokenValid(senderToken)) {
      senderUid = decodeToken(senderToken);
    }

    const socketId = socketIdMap.get(receiverUid);
    const sender = await UserModel.findOne({ uid: senderUid });

    socket.to(socketId).emit('call received', sender);
    callback(HttpCode.OK);
  });
}

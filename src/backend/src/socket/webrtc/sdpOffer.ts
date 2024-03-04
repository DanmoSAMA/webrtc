/**
 * description: sdp offer
 * date: 2024-02-21 23:00:52 +0800
 */

import { Socket } from 'socket.io';
import { groupVideoChatRooms, socketIdMap } from '..';
import { UserModel } from '@models/user';
import { isTokenValid, decodeToken } from '@utils/jwt';

export function onSdpOffer(io: any, socket: Socket) {
  socket.on(
    'sdp offer request',
    async (offer, receiverUid, senderToken, gid) => {
      let senderUid;
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      }

      const sender = await UserModel.findOne({ uid: senderUid });

      if (receiverUid) {
        const socketId = socketIdMap.get(receiverUid);
        socket.to(socketId).emit('sdp offer received', offer, sender);
      } else {
        const temp = groupVideoChatRooms.find((item) => item.gid === gid);
        for (const user of temp.memberList) {
          const socketId = socketIdMap.get(user.uid);
          socket.to(socketId).emit('sdp offer received', offer, sender);
        }
      }
    },
  );
}

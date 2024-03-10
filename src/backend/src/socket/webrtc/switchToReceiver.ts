/**
 * description: 转换为接收者
 * date: 2024-03-09 20:17:05 +0800
 */

import { Socket } from 'socket.io';
import { socketIdMap } from '..';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onSwitchToReceiver(io: any, socket: Socket) {
  socket.on(
    'switch to receiver request',
    async ({ senderToken, receiverUid }, callback) => {
      const socketId = socketIdMap.get(receiverUid);

      socket.to(socketId).emit('switch to receiver received');
      callback(HttpCode.OK);
    },
  );
}

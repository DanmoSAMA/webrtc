/**
 * description: 发送单聊消息
 * date: 2024-02-18 15:33:53 +0800
 */

import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { saveMsgToDb } from '../socketUtils';

export function onSendMsg(io: any, socket: Socket) {
  socket.on(
    'send message request',
    async ({ senderToken, receiverUid, content, type }, callback) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
      }

      try {
        const msg = await saveMsgToDb({
          senderUid,
          receiver: receiverUid,
          content,
          type,
        });

        io.emit('send message received', msg);

        callback(HttpCode.OK);
      } catch (err) {
        callback(HttpCode.SEND_MSG_ERROR);
      }
    },
  );
}

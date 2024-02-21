/**
 * description: 发送群聊消息
 * date: 2024-02-18 15:40:43 +0800
 */

import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { saveMsgToDb } from '../socketUtils';

export function onSendGroupMsg(io: any, socket: Socket) {
  socket.on(
    'send group message request',
    async ({ senderToken, gid, content, type }, callback) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      try {
        const msg = await saveMsgToDb(
          {
            senderUid,
            receiver: gid,
            content,
            type,
          },
          true,
        );

        io.emit('send group message received', msg);

        callback(HttpCode.OK);
      } catch (err) {
        callback(HttpCode.SEND_MSG_ERROR);
      }
    },
  );
}

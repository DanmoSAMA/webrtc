/**
 * description: 消息已读
 * date: 2024-02-18 15:35:13 +0800
 */

import { MsgModel } from '@models/msg';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { transformMsg } from '@utils/msg';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onReadMsg(io: any, socket: Socket) {
  socket.on(
    'read message request',
    async ({ receiverToken, mid }, callback) => {
      let receiverUid = '';
      if (isTokenValid(receiverToken)) {
        receiverUid = decodeToken(receiverToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      try {
        const msg = await MsgModel.findOne({ mid });
        if (!msg.readUids.includes(receiverUid)) {
          msg.readUids.push(receiverUid);
        }
        msg.save();

        io.emit('read message received', await transformMsg(msg));

        callback(HttpCode.OK);
      } catch (err) {}
      callback(HttpCode.READ_MSG_ERROR);
    },
  );
}

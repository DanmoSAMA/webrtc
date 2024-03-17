/**
 * description: 发送单聊消息
 * date: 2024-02-18 15:33:53 +0800
 */

import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { saveMsgToDb } from '../socketUtils';
import * as path from 'path';
import * as fs from 'fs';

export enum ContentType {
  Text,
  Image,
  File,
}

export function onSendMsg(io: any, socket: Socket) {
  socket.on(
    'send message request',
    async (
      { senderToken, receiverUid, content, type, contentType },
      callback,
    ) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
      }

      try {
        if (contentType !== ContentType.Image) {
          const msg = await saveMsgToDb({
            senderUid,
            receiver: receiverUid,
            content,
            type,
          });

          io.emit('send message received', msg);

          callback(HttpCode.OK);
        } else {
          const { file, filename } = content;
          const buffer = Buffer.from(file);
          const filepath = path.join(__dirname, 'uploads', filename);

          fs.writeFile(filepath, buffer, async (err) => {
            if (err) {
              callback(HttpCode.SEND_MSG_ERROR);
              console.log(err);
            } else {
              console.log('文件保存成功');

              const msg = await saveMsgToDb({
                senderUid,
                receiver: receiverUid,
                content: 'http://localhost:8080/' + filename,
                type,
                contentType,
              });

              io.emit('send message received', msg);

              callback(HttpCode.OK);
            }
          });
        }
      } catch (err) {
        callback(HttpCode.SEND_MSG_ERROR);
        console.log(err);
      }
    },
  );
}

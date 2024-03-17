/**
 * description: 发送群聊消息
 * date: 2024-02-18 15:40:43 +0800
 */

import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { saveMsgToDb } from '../socketUtils';
import { ContentType } from '../friend/sendMsg';
import { UPLOAD_PATH } from '@consts/index';
import * as path from 'path';
import * as fs from 'fs';

export function onSendGroupMsg(io: any, socket: Socket) {
  socket.on(
    'send group message request',
    async ({ senderToken, gid, content, type, contentType }, callback) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      try {
        if (contentType === ContentType.Text) {
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
        } else {
          const { file, filename } = content;
          const buffer = Buffer.from(file);
          const filepath = path.join(UPLOAD_PATH, filename);

          try {
            fs.writeFile(filepath, buffer, async (err) => {
              if (err) {
                callback(HttpCode.SEND_MSG_ERROR);
                console.log(err);
              } else {
                console.log('文件保存成功');

                let msg;

                if (
                  contentType === ContentType.Image ||
                  contentType === ContentType.Audio
                ) {
                  msg = await saveMsgToDb(
                    {
                      senderUid,
                      receiver: gid,
                      content: 'http://localhost:8080/' + filename,
                      type,
                      contentType,
                    },
                    true,
                  );
                } else if (contentType === ContentType.File) {
                  msg = await saveMsgToDb(
                    {
                      senderUid,
                      receiver: gid,
                      content: filename,
                      type,
                      contentType,
                    },
                    true,
                  );
                }

                io.emit('send group message received', msg);

                callback(HttpCode.OK);
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        callback(HttpCode.SEND_MSG_ERROR);
      }
    },
  );
}

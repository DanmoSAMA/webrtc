/**
 * description: 退群
 * date: 2024-02-18 15:42:58 +0800
 */

import { GroupModel } from '@models/group';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageType } from '../../../../shared/enums';
import { saveMsgToDb } from '../socketUtils';

export function onQuitGroup(io: any, socket: Socket) {
  socket.on('quit group request', async ({ senderToken, gid }, callback) => {
    let uid = '';
    if (isTokenValid(senderToken)) {
      uid = decodeToken(senderToken);
    } else {
      callback(HttpCode.INVALID_TOKEN);
      return;
    }

    try {
      const group = await GroupModel.findOne({ gid });

      if (uid === group.owner) {
        callback(HttpCode.OWNER_QUIT_GROUP);
        return;
      }
      group.administrators = group.administrators.filter((id) => id !== uid);
      group.members = group.members.filter((id) => id !== uid);

      await group.save();

      const msg = await saveMsgToDb(
        {
          senderUid: uid,
          receiver: gid,
          content: '该字段不能为空，否则无法存入数据库',
          type: MessageType.QuitGroupNotify,
        },
        true,
      );

      io.emit('quit group received', msg);

      callback(HttpCode.OK);
    } catch (err) {
      callback(HttpCode.QUIT_GROUP_ERROR);
    }
  });
}

/**
 * description: 取消管理
 * date: 2024-02-18 15:40:23 +0800
 */

import { GroupModel } from '@models/group';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageType } from '../../../../shared/enums';
import { saveMsgToDb } from '../socketUtils';

export function onCancelAdmin(io: any, socket: Socket) {
  socket.on(
    'cancel group admin request',
    async ({ senderToken, uid, gid }, callback) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      try {
        const group = await GroupModel.findOne({ gid });

        group.administrators = group.administrators.filter((id) => id !== uid);

        await group.save();

        const msg = await saveMsgToDb(
          {
            senderUid,
            receiver: uid,
            content: '该字段不能为空，否则无法存入数据库',
            type: MessageType.CancelAdminNotify,
            gid,
          },
          true,
        );

        io.emit('cancel group admin received', msg);

        callback(HttpCode.OK);
      } catch (err) {
        callback(HttpCode.JOIN_GROUP_ERROR);
      }
    },
  );
}

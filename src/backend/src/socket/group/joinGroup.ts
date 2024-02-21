/**
 * description: 加入群
 * date: 2024-02-18 15:36:20 +0800
 */

import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageType } from '../../../../shared/enums';
import {
  hasSameJoinGroupReq,
  isGroupExist,
  hasJoinedGroup,
  saveMsgToDb,
} from '../socketUtils';

export function onJoinGroup(io: any, socket: Socket) {
  socket.on(
    'join group request',
    async ({ senderToken, gid, content }, callback) => {
      let senderUid = '';
      if (isTokenValid(senderToken)) {
        senderUid = decodeToken(senderToken);
      } else {
        callback(HttpCode.INVALID_TOKEN);
        return;
      }

      if (await hasSameJoinGroupReq(senderUid, gid)) {
        callback(HttpCode.REQ_HAS_EXISTED);
        return;
      }

      if (!(await isGroupExist(gid))) {
        callback(HttpCode.GROUP_NOT_EXIST);
        return;
      }

      if (await hasJoinedGroup(gid, senderUid)) {
        callback(HttpCode.HAS_JOINED_GROUP);
        return;
      }

      try {
        const msg = await saveMsgToDb(
          {
            senderUid,
            receiver: gid,
            content,
            type: MessageType.JoinGroupRequestNotify,
          },
          true,
        );

        io.emit('join group received', msg);

        callback(HttpCode.OK);
      } catch (err) {
        callback(HttpCode.JOIN_GROUP_ERROR);
      }
    },
  );
}

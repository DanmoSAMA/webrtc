/**
 * description: 获取群语音中的成员
 * date: 2024-03-03 13:22:57 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { isTokenValid } from '@utils/jwt';
import { groupVideoChatRooms } from '../../../src/socket';

export const getGroupVideoChatMembers: Middleware = async (ctx) => {
  const reqBody = ctx.request.body;
  const token = ctx.request.headers.authorization;
  const gid = reqBody.gid;

  if (!isTokenValid(token)) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.INVALID_TOKEN,
      data: null,
    };
    return;
  }

  const temp = groupVideoChatRooms.find((item) => item.gid === gid);
  let memberList = [];

  if (temp) {
    memberList = temp.memberList;
  } else {
    memberList = [];
  }

  console.log(groupVideoChatRooms, memberList);

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { memberList },
  };
};

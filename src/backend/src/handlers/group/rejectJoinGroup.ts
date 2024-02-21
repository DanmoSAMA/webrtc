/**
 * description: 拒绝入群申请
 * date: 2024-02-13 15:14:48 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { isTokenValid } from '@utils/jwt';
import { MsgModel } from '@models/msg';
import { MessageStatus } from '../../../../shared/enums';

export const rejectJoinGroup: Middleware = async (ctx) => {
  const token = ctx.request.headers.authorization;

  if (!isTokenValid(token)) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.INVALID_TOKEN,
      data: null,
    };
    return;
  }

  const msg = await MsgModel.findOne({ mid: ctx.request.body.mid });
  msg.status = MessageStatus.Rejected;
  await msg.save();

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: null,
  };
};

/**
 * description: 获取好友列表
 * date: 2024-02-13 21:15:00 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { isTokenValid } from '@utils/jwt';
import { SECRET_KEY } from '@consts/index';
import { GroupModel } from '@models/group';
import * as jwt from 'jsonwebtoken';

export const getGroupList: Middleware = async (ctx) => {
  const token = ctx.request.headers.authorization;
  let uid = '';

  if (isTokenValid(token)) {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    uid = decodedToken.uid;
  } else {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.INVALID_TOKEN,
      data: null,
    };
    return;
  }

  const groups = await GroupModel.find({
    members: { $in: [uid] },
  });

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { groups },
  };
};

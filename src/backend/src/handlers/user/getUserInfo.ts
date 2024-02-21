/**
 * description: 获取用户信息
 * date: 2024-02-13 20:44:14 +0800
 */

import { Middleware } from 'koa';
import { UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { SECRET_KEY } from '@consts/index';
import { isTokenValid } from '@utils/jwt';
import * as jwt from 'jsonwebtoken';

export const getUserInfo: Middleware = async (ctx) => {
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

  const user = await UserModel.findOne({ uid });

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { user },
  };
};

export const getUserInfoById: Middleware = async (ctx) => {
  const uid = ctx.request.body.uid;
  const user = await UserModel.findOne({ uid });

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { user },
  };
};

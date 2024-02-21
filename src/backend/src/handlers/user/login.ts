/**
 * description: 登陆
 * date: 2024-02-07 20:18:56 +0800
 */

import { Middleware } from 'koa';
import { createError } from '@middleware/handleError';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { UserModel } from '@models/user';
import { SECRET_KEY } from '@consts/index';
import * as jwt from 'jsonwebtoken';

export const login: Middleware = async (ctx) => {
  const reqBody = ctx.request.body;

  if (!reqBody.uid)
    createError({
      status: 400,
      msg: '用户 uid 为空',
    });

  if (!reqBody.password)
    createError({
      status: 400,
      msg: '用户 password 为空',
    });

  const existingUser = await UserModel.findOne({ uid: reqBody.uid });
  if (!existingUser) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.USER_NOT_EXIST,
      data: null,
    };
  } else if (existingUser.password !== reqBody.password) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.INCORRECT_PASSWD,
      data: null,
    };
  } else {
    const token = jwt.sign({ uid: reqBody.uid }, SECRET_KEY, {
      expiresIn: '7d',
    });

    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.OK,
      data: {
        token,
      },
    };
  }
};

/**
 * description: 获取权限等级
 * date: 2024-02-14 23:48:11 +0800
 */

import { SECRET_KEY } from '@consts/index';
import { isTokenValid } from '@utils/jwt';
import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { GroupModel } from '@models/group';
import { AuthorityLevel } from '../../../../shared/enums';
import * as jwt from 'jsonwebtoken';

export const getIdentity: Middleware = async (ctx) => {
  const reqData = ctx.request.body;
  const token = ctx.request.headers.authorization;
  const gid = reqData.gid;
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

  const group = await GroupModel.findOne({ gid });

  if (group.owner === uid) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.OK,
      data: {
        identity: AuthorityLevel.Owner,
      },
    };
    return;
  }

  for (const user of group.administrators) {
    if (user === uid) {
      ctx.body = {
        status: 200,
        msg: 'ok',
        code: HttpCode.OK,
        data: {
          identity: AuthorityLevel.Administrator,
        },
      };
      return;
    }
  }

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: {
      identity: AuthorityLevel.Member,
    },
  };
};

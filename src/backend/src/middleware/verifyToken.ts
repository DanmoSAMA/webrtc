/**
 * description: 检验 token
 * date: 2024-02-13 12:13:20 +0800
 */

import { Middleware } from 'koa';
import { SECRET_KEY } from '@consts/index';
import * as jwt from 'jsonwebtoken';

const verifyToken: Middleware = (ctx, next) => {
  const authHeader = ctx.header.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { message: '未提供有效的 token' };
    return;
  }

  const token = authHeader.substring(7);

  try {
    // 验证 token 的合法性
    const decoded = jwt.verify(token, SECRET_KEY);

    // 将解码后的信息存储在上下文中，以便后续处理中可以使用
    ctx.state.user = decoded;
    return next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { message: '无效的 token' };
    return;
  }
};

export default verifyToken;

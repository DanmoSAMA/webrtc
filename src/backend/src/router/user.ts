/**
 * description: 用户路由
 * date: 2024-02-07 21:08:16 +0800
 */

import * as Router from 'koa-router';

import { register } from '@handlers/user/register';
import { login } from '@handlers/user/login';
import { getUserInfo, getUserInfoById } from '@handlers/user/getUserInfo';

export const userRouter = new Router();

userRouter
  .post('/register', register)
  .post('/login', login)
  .get('/info', getUserInfo)
  .post('/info', getUserInfoById);

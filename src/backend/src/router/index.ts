/**
 * description: 路由
 * date: 2024-02-07 21:08:29 +0800
 */

import { friendRouter } from './friend';
import { groupRouter } from './group';
import { msgRouter } from './msg';
import { userRouter } from './user';
import * as Router from 'koa-router';

const router = new Router();

router
  .use('/user', userRouter.routes())
  .use('/msg', msgRouter.routes())
  .use('/friend', friendRouter.routes())
  .use('/group', groupRouter.routes());

export default router;

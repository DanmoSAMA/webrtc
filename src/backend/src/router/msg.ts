/**
 * description: 消息路由
 * date: 2024-02-13 11:40:04 +0800
 */

import { pullMsg } from '@handlers/msg/pullMsg';
import * as Router from 'koa-router';

export const msgRouter = new Router();

msgRouter.get('/pull', pullMsg);

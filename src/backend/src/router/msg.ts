/**
 * description: 消息路由
 * date: 2024-02-13 11:40:04 +0800
 */

import { downloadFile } from '@handlers/msg/downloadFile';
import { pullMsg } from '@handlers/msg/pullMsg';
import * as Router from 'koa-router';

export const msgRouter = new Router();

msgRouter.get('/pull', pullMsg).get('/file/download/:filename', downloadFile);

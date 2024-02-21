/**
 * description: 朋友路由
 * date: 2024-02-13 15:13:11 +0800
 */

import { getFriendList } from '@handlers/friend/getFriendList';
import { rejectFriendReq } from '@handlers/friend/rejectFriendReq';
import * as Router from 'koa-router';

export const friendRouter = new Router();

friendRouter.post('/reject', rejectFriendReq).get('/list', getFriendList);

/**
 * description: 群路由
 * date: 2024-02-14 19:16:58 +0800
 */

import * as Router from 'koa-router';
import { createGroup } from '@handlers/group/createGroup';
import { getGroupList } from '../handlers/group/getGroupList';
import { getIdentity } from '@handlers/group/getIdentity';
import { getGroupInfo } from '@handlers/group/getGroupInfo';
import { rejectJoinGroup } from '@handlers/group/rejectJoinGroup';
import { getGroupVideoChatMembers } from '@handlers/group/getGroupVideoChatMembers';

export const groupRouter = new Router();

groupRouter
  .post('/create', createGroup)
  .get('/list', getGroupList)
  .post('/identity', getIdentity)
  .post('/info', getGroupInfo)
  .post('/reject', rejectJoinGroup)
  .post('/video_chat_members', getGroupVideoChatMembers);

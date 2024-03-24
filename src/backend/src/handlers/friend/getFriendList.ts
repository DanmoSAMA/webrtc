/**
 * description: 获取好友列表
 * date: 2024-02-13 21:15:00 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { isTokenValid } from '@utils/jwt';
import { SECRET_KEY } from '@consts/index';
import { FriendshipModel } from '@models/friendship';
import { UserModel } from '@models/user';
import { checkOnline } from '../../../src/socket';
import * as jwt from 'jsonwebtoken';

export const getFriendList: Middleware = async (ctx) => {
  let uid = '';
  const token = ctx.request.headers.authorization;

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

  const leftFriends = await FriendshipModel.find({ uid1: uid });
  const rightFriends = await FriendshipModel.find({ uid2: uid });

  const leftFriendList = await Promise.all(
    leftFriends.map(async ({ uid2 }) => {
      const user = await UserModel.findOne({ uid: uid2 });
      return {
        uid: uid2,
        name: user.name,
        avatarUrl: user.avatarUrl,
        online: checkOnline(user.uid),
      };
    }),
  );

  const rightFriendList = await Promise.all(
    rightFriends.map(async ({ uid1 }) => {
      const user = await UserModel.findOne({ uid: uid1 });
      return {
        uid: uid1,
        name: user.name,
        avatarUrl: user.avatarUrl,
        online: checkOnline(user.uid),
      };
    }),
  );

  const friendList: any = [...leftFriendList, ...rightFriendList].sort(
    (user1, user2) => user1.uid - user2.uid,
  );

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { friends: friendList },
  };
};

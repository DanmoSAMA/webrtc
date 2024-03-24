/**
 * description: 获取群成员
 * date: 2024-02-16 13:33:52 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { isTokenValid } from '@utils/jwt';
import { GroupModel } from '@models/group';
import { UserModel } from '@models/user';
import { checkOnline } from '../../../src/socket';

export const getGroupInfo: Middleware = async (ctx) => {
  const reqBody = ctx.request.body;
  const token = ctx.request.headers.authorization;

  if (!isTokenValid(token)) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.INVALID_TOKEN,
      data: null,
    };
    return;
  }

  const gid = reqBody.gid;
  const group = await GroupModel.findOne({ gid });
  const {
    members: memberUids,
    administrators: adminUids,
    owner: ownerUid,
    name,
  } = group;

  const realMemberUids = memberUids.filter((uid) => {
    return uid !== ownerUid && !adminUids.includes(uid);
  });

  const _owner = await UserModel.findOne({ uid: ownerUid });
  const owner = {
    uid: ownerUid,
    name: _owner.name,
    avatarUrl: _owner.avatarUrl,
    online: checkOnline(ownerUid),
  };

  const admins = await Promise.all(
    adminUids.map(async (uid) => {
      const user = await UserModel.findOne({ uid });
      return {
        uid,
        name: user.name,
        avatarUrl: user.avatarUrl,
        online: checkOnline(uid),
      };
    }),
  );

  const members = await Promise.all(
    realMemberUids.map(async (uid) => {
      const user = await UserModel.findOne({ uid });
      return {
        uid,
        name: user.name,
        avatarUrl: user.avatarUrl,
        online: checkOnline(uid),
      };
    }),
  );

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { owner, admins, members, name },
  };
};

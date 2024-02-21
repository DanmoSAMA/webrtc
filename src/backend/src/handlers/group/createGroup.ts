/**
 * description: 创建群
 * date: 2024-02-14 19:18:45 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { isTokenValid } from '@utils/jwt';
import { SECRET_KEY } from '@consts/index';
import { GidCounter, GroupModel } from '@models/group';
import * as jwt from 'jsonwebtoken';

async function getMaxGid() {
  const startGid = 100000;
  const existingCounter = await GidCounter.findOne({});

  if (!existingCounter) {
    const newCounter = new GidCounter({ maxGid: startGid });
    await newCounter.save();

    return startGid;
  } else {
    const { maxGid } = await GidCounter.findOneAndUpdate(
      {},
      { $inc: { maxGid: 1 } },
      { new: true, upsert: true },
    );

    return maxGid;
  }
}

export const createGroup: Middleware = async (ctx) => {
  const reqBody = ctx.request.body;
  const token = ctx.request.headers.authorization;
  const { name } = reqBody;
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

  const existingGroup = await GroupModel.findOne({ name });
  if (existingGroup) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.GROUP_HAS_EXISTED,
      data: null,
    };
    return;
  }

  const group = new GroupModel({
    gid: await getMaxGid(),
    name,
    owner: uid,
    members: [uid],
  });
  await group.save();

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: null,
  };
};

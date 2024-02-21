/**
 * description: 注册
 * date: 2024-02-07 20:18:46 +0800
 */

import { Middleware } from 'koa';
import { createError } from '@middleware/handleError';
import { UidCounter, UserModel } from '@models/user';
import { HttpCode } from '../../../../shared/consts/httpCode';
import * as sha256 from 'sha256';

async function getMaxUid() {
  const startUid = 100000;
  const existingCounter = await UidCounter.findOne({});

  if (!existingCounter) {
    const newCounter = new UidCounter({ maxUid: startUid });
    await newCounter.save();

    return startUid;
  } else {
    const { maxUid } = await UidCounter.findOneAndUpdate(
      {},
      { $inc: { maxUid: 1 } },
      { new: true, upsert: true },
    );

    return maxUid;
  }
}

async function checkSameUserName(name: string) {
  const existingUser = await UserModel.findOne({ name });

  if (existingUser) {
    return false;
  }
  return true;
}

export const register: Middleware = async (ctx) => {
  const reqBody = ctx.request.body;

  if (!reqBody.name)
    createError({
      status: 400,
      msg: '用户 name 为空',
    });

  if (!reqBody.password)
    createError({
      status: 400,
      msg: '用户 password 为空',
    });

  const checkRes = await checkSameUserName(reqBody.name);
  if (!checkRes) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.USER_HAS_EXISTED,
      data: null,
    };
    return;
  }

  reqBody.uid = await getMaxUid();
  reqBody.password = sha256(reqBody.password);

  const newUser = new UserModel(reqBody);
  await newUser.save();

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { uid: reqBody.uid },
  };
};

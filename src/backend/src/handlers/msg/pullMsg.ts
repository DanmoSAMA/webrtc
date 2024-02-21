/**
 * description: 拉取消息
 * date: 2024-02-13 11:42:54 +0800
 */

import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MsgModel } from '@models/msg';
import { isTokenValid } from '@utils/jwt';
import { SECRET_KEY } from '@consts/index';
import { transformMsg } from '@utils/msg';
import { GroupModel } from '@models/group';
import { MessageType } from '../../../../shared/enums';
import * as jwt from 'jsonwebtoken';

export const pullMsg: Middleware = async (ctx) => {
  const token = ctx.request.headers.authorization;
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

  // 单聊、添加好友
  const friendMsgs = await MsgModel.find({
    $and: [
      {
        $or: [
          { type: MessageType.FriendRequestNotify },
          { type: MessageType.SingleMessage },
        ],
      },
      { $or: [{ 'sender.uid': uid }, { 'receiver.uid': uid }] },
    ],
  });

  const groupsOwned = await GroupModel.find({ owner: uid });
  const groupsOwnedIds = groupsOwned.map((group) => group.gid);
  const groupsAdmined = await GroupModel.find({
    administrators: { $in: [uid] },
  });
  const groupsAdminedIds = groupsAdmined.map((group) => group.gid);
  const groupsJoined = await GroupModel.find({
    members: { $in: [uid] },
  });
  const groupJoinedIds = groupsJoined.map((group) => group.gid);

  // 加入群 退群(设定是管理员也能看到其他管理员退群)
  const joinQuitGroupMsgs = await MsgModel.find({
    $and: [
      {
        $or: [
          { type: MessageType.JoinGroupRequestNotify },
          { type: MessageType.QuitGroupNotify },
        ],
      },
      {
        $or: [
          {
            'receiver.gid': {
              $in: groupsOwnedIds,
            },
          },
          {
            'receiver.gid': {
              $in: groupsAdminedIds,
            },
          },
        ],
      },
    ],
  });

  // 群聊
  const groupMsgs = await MsgModel.find({
    $and: [
      {
        type: MessageType.GroupMessage,
      },
      {
        'receiver.gid': {
          $in: groupJoinedIds,
        },
      },
    ],
  });

  // 设置管理员
  const setAdminMsgs = await MsgModel.find({
    $and: [
      {
        type: MessageType.SetAdminNotify,
      },
      {
        'receiver.gid': {
          $in: groupJoinedIds,
        },
      },
    ],
  });

  // 取消管理员
  const cancelAdminMsgs = await MsgModel.find({
    $and: [
      {
        type: MessageType.CancelAdminNotify,
      },
      {
        'receiver.gid': {
          $in: groupJoinedIds, // 已经被取消了管理员
        },
      },
    ],
  });

  const allMsgs = [
    ...friendMsgs,
    ...joinQuitGroupMsgs,
    ...groupMsgs,
    ...setAdminMsgs,
    ...cancelAdminMsgs,
  ];

  const transformedMsgs = await Promise.all(
    allMsgs.map(async (msg) => await transformMsg(msg)),
  );

  ctx.body = {
    status: 200,
    msg: 'ok',
    code: HttpCode.OK,
    data: { msgs: transformedMsgs },
  };
};

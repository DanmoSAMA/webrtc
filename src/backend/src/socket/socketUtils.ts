/**
 * description: socket 用到的一些函数
 * date: 2024-02-12 15:23:47 +0800
 */

import { MidCounter, MsgModel } from '@models/msg';
import { MessageStatus } from '../../../shared/enums';
import { transformMsg } from '@utils/msg';
import { UserModel } from '@models/user';
import { GroupModel } from '@models/group';
import { FriendshipModel } from '@models/friendship';

async function getMaxMid() {
  const startMid = 100000;
  const existingCounter = await MidCounter.findOne({});

  if (!existingCounter) {
    const newCounter = new MidCounter({ maxMid: startMid });
    await newCounter.save();

    return startMid;
  } else {
    const { maxMid } = await MidCounter.findOneAndUpdate(
      {},
      { $inc: { maxMid: 1 } },
      { new: true, upsert: true },
    );

    return maxMid;
  }
}

export async function hasSameAddFriendReq(senderUid, receiverUid) {
  const existingMsg = await MsgModel.findOne({
    'sender.uid': senderUid,
    'receiver.uid': receiverUid,
    status: MessageStatus.Unhandled,
  });

  if (existingMsg) {
    return true;
  }

  return false;
}

export async function hasSameJoinGroupReq(senderUid, gid) {
  const existingMsg = await MsgModel.findOne({
    'sender.uid': senderUid,
    'receiver.gid': gid,
    status: MessageStatus.Unhandled,
  });

  if (existingMsg) {
    return true;
  }

  return false;
}

export async function isFriend(senderUid, receiverUid) {
  const existingFriendship = await FriendshipModel.findOne({
    $or: [
      { $and: [{ uid1: senderUid }, { uid2: receiverUid }] },
      { $and: [{ uid1: receiverUid }, { uid2: senderUid }] },
    ],
  });

  if (existingFriendship) {
    return true;
  }

  return false;
}

export async function saveMsgToDb(
  { senderUid, receiver, content, type, gid = null },
  isGroup = false,
) {
  const mid = await getMaxMid();
  const time = Date.now();
  const status = MessageStatus.Unhandled;
  const msg = {
    mid,
    sender: { uid: senderUid },
    content,
    time,
    type,
    status,
    readUids: [],
  } as any;

  if (!isGroup) {
    msg.receiver = { uid: receiver };
  } else {
    // 设计失误，不应该让 uid 和 gid 都耦合在 receiver 这个属性的
    // 现在我同时想使用 uid 和 gid，只能出此下策
    msg.receiver = { uid: receiver, gid: gid ?? receiver };
  }

  const newMsg = new MsgModel(msg);

  await newMsg.save();

  return await transformMsg(msg);
}

export async function isUserExist(uid: any) {
  const existingUser = await UserModel.findOne({ uid });

  if (existingUser) {
    return true;
  }

  return false;
}

export async function isGroupExist(gid: any) {
  const existingGroup = await GroupModel.findOne({ gid });

  if (existingGroup) {
    return true;
  }

  return false;
}

export async function hasJoinedGroup(gid: any, uid: any) {
  const existingGroup = await GroupModel.findOne({ gid });

  for (const id of existingGroup.members) {
    if (id === uid) {
      return true;
    }
  }

  return false;
}

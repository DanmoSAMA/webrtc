/**
 * description: 消息相关工具函数
 * date: 2024-02-13 14:56:14 +0800
 */

import { UserModel } from '@models/user';

export async function transformMsg(msg: any) {
  const sender = await UserModel.findOne({ uid: msg.sender.uid });

  return {
    messageId: msg.mid,
    senderId: msg.sender.uid, // 这几个字段属于一开始没有设计好
    receiverId: msg.receiver.uid, // 应该直接返回对象的
    groupId: msg.receiver.gid,
    messageContent: msg.content,
    sendTime: msg.time,
    messageType: msg.type,
    status: msg.status,
    readUids: msg.readUids,
    sender, // 根据开闭原则，只好在后面补上
    contentType: msg.contentType,
  };
}

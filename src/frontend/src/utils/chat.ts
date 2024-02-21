/**
 * description: Chat 相关的工具函数
 * date: 2024-02-14 13:46:52 +0800
 */

import { getUid } from './uid';
import ChatStore from '@/mobx/chat';

// 是否单聊
export function isSingleChat() {
  return (ChatStore.currentChat?.uid as number) > 0;
}

// 是否是该消息的接收者
export function asReceiver(senderUid: any) {
  return senderUid === ChatStore.currentChat?.uid;
}

// 是否是该消息的发送者
export function asSender(senderUid: any, receiverUid: any) {
  const uid = getUid();
  return uid === senderUid && receiverUid === ChatStore.currentChat?.uid;
}

// 消息对方是否已读
export function isMsgRead(readUids: any) {
  return readUids.includes(`${ChatStore.currentChat?.uid}`);
}

// 是否为当前群聊
export function isThisGroup(gid: any) {
  return gid === ChatStore.currentChat?.gid;
}

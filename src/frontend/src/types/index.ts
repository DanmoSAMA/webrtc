/**
 * description: 类型
 * author: Yuming Cui
 * date: 2022-10-31 20:39:10 +0800
 */

import { ContentType, MessageType } from '@/enums';
import { MessageStatus } from '../../../shared/enums';

export interface IUser {
  uid: number;
  name: string;
  avatarUrl: string;
  online: boolean;
}

export interface IGroup {
  gid: number;
  avatarUrl: string;
  name: string;
  count?: number;
}

export interface IMessage {
  messageId: number;
  senderId: number;
  receiverId: number;
  groupId: number;
  messageType: MessageType;
  messageContent: string;
  sendTime: string;
  name: string;
  avatarUrl: string;
  readUids: any[];
  status: MessageStatus;
  sender: IUser;
  contentType: ContentType;
}

export type IMessageOutline = Omit<
  IMessage,
  'messageId' | 'readUids' | 'sendTime'
> & {
  messageNum: number;
  lastMessageTime: string;
};

export interface IMessageContent {
  senderId: number;
  groupId: number;
  messageId: number;
  messageType: MessageType;
  messageContent: string;
  readUids: string;
}

export type IChat = IUser & IGroup & IMessageOutline;

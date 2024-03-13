import { makeAutoObservable } from 'mobx';
import { MessageType } from '@/enums';
import { IMessage } from '@/types';
import { pullMsg } from '@/network/message/pullMsg';
import { getUid } from '@/utils/uid';
import GroupStore from './group';
import AuthorityStore from './authority';
import { isInGroup } from '@/utils/chat';

class MsgState {
  // 好友请求
  public friendRequest: Partial<IMessage>[] = [];
  // 加群
  public groupNotify: Partial<IMessage>[] = [];
  // 好友消息
  public friendMsg: Partial<IMessage>[] = [];
  // 群消息
  public groupMsg: Partial<IMessage>[] = [];
  // 设为管理员
  public setAdminNotify: Partial<IMessage>[] = [];
  // 取消管理员
  public cancelAdminNotify: Partial<IMessage>[] = [];
  // 踢人
  public planeTicketNotify: Partial<IMessage>[] = [];
  // 退群
  public quitGroupNotify: Partial<IMessage>[] = [];

  public constructor() {
    makeAutoObservable(this);
  }

  public async init() {
    this.friendRequest = [];
    this.groupNotify = [];
    this.friendMsg = [];
    this.groupMsg = [];
    this.setAdminNotify = [];
    this.cancelAdminNotify = [];
    this.planeTicketNotify = [];
    this.quitGroupNotify = [];
  }

  public async initMsg() {
    this.init();

    pullMsg().then(({ data }) => {
      console.log(data);

      for (const msg of data.msgs) {
        this.handleMsg(msg.messageType, msg);
      }
    });
  }

  public async setFriendMsgRead(receiverUid: any, mid: any) {
    for (const msg of this.friendMsg) {
      if (msg.messageId === mid) {
        msg.readUids?.push(`${receiverUid}`);
        return;
      }
    }
  }

  /**
   * 处理不同类型的消息
   * @param msgType 消息类型
   * @param msg 消息
   * @returns void
   */

  /* eslint-disable complexity */
  public async handleMsg(msgType: MessageType, msg: any) {
    console.log(msg, msgType, msgType === MessageType.GroupMessage);
    switch (msgType) {
      case MessageType.FriendRequestNotify: {
        if (msg.receiverId === getUid()) {
          this.sendMsg(MessageType.FriendRequestNotify, msg);
        }
        break;
      }
      case MessageType.JoinGroupRequestNotify: {
        if (
          (await AuthorityStore.isAdministrator(msg.groupId)) ||
          (await AuthorityStore.isOwner(msg.groupId))
        ) {
          this.sendMsg(MessageType.JoinGroupRequestNotify, msg);
        }
        break;
      }
      case MessageType.SingleMessage: {
        if (msg.receiverId === getUid() || msg.senderId === getUid()) {
          this.sendMsg(MessageType.SingleMessage, msg);
        }
        break;
      }
      case MessageType.GroupMessage: {
        if (await isInGroup(msg.groupId)) {
          this.sendMsg(MessageType.GroupMessage, msg);
        }
        break;
      }
      case MessageType.SetAdminNotify: {
        if (msg.receiverId === getUid()) {
          this.sendMsg(MessageType.SetAdminNotify, msg);
          GroupStore.init(msg.groupId);
        }
        break;
      }
      case MessageType.CancelAdminNotify: {
        if (msg.receiverId === getUid()) {
          this.sendMsg(MessageType.CancelAdminNotify, msg);
          GroupStore.init(msg.groupId);
        }
        break;
      }
      case MessageType.PlaneTicketNotify: {
        // 是消息的接收者
        // 不是消息的发送者，但是是管理员 / 群主
        if (
          msg.receiverId === getUid() ||
          (msg.senderId !== getUid() &&
            ((await AuthorityStore.isOwner(msg.groupId)) ||
              (await AuthorityStore.isAdministrator(msg.groupId))))
        ) {
          this.sendMsg(MessageType.PlaneTicketNotify, msg);
          GroupStore.init(msg.groupId);
        }
        break;
      }
      case MessageType.QuitGroupNotify: {
        if (
          msg.senderId !== getUid() &&
          ((await AuthorityStore.isOwner(msg.groupId)) ||
            (await AuthorityStore.isAdministrator(msg.groupId)))
        ) {
          this.sendMsg(MessageType.QuitGroupNotify, msg);
          GroupStore.init(msg.groupId);
        }
        break;
      }
    }
  }

  /**
   * 发送消息
   * @param message 发送的消息
   * @param msgType 消息类型
   * @returns void
   */
  public sendMsg(msgType: MessageType, msg: any) {
    switch (msgType) {
      case MessageType.SingleMessage:
        this.friendMsg.push(msg);
        break;
      case MessageType.GroupMessage:
        this.groupMsg.push(msg);
        break;
      case MessageType.FriendRequestNotify:
        this.friendRequest.push(msg);
        break;
      case MessageType.JoinGroupRequestNotify:
        this.groupNotify.push(msg);
        break;
      case MessageType.SetAdminNotify:
        this.setAdminNotify.push(msg);
        break;
      case MessageType.CancelAdminNotify:
        this.cancelAdminNotify.push(msg);
        break;
      case MessageType.PlaneTicketNotify:
        this.planeTicketNotify.push(msg);
        break;
      case MessageType.QuitGroupNotify:
        this.quitGroupNotify.push(msg);
    }
  }
}

const MsgStore = new MsgState();

export default MsgStore;

/**
 * description: 消息状态管理
 * date: 2022-11-01 12:54:59 +0800
 */

import { makeAutoObservable } from 'mobx';
import { ChatType } from '@/enums';
import { IGroup, IMessage, IUser } from '@/types';
import { getGroupList } from '@/network/group/getGroupList';
import { getFriendList } from '@/network/friend/getFriendList';

class ChatListState {
  public chatType: ChatType = ChatType.Message;
  public groupData: IGroup[] = [];
  public msgData: IMessage[] = [];
  public friendData: IUser[] = [];

  public constructor() {
    makeAutoObservable(this);
  }

  /**
   * 设置类型
   * @param val 要设置的值
   * @returns void
   */
  public setChatType(val: ChatType) {
    this.chatType = val;
  }

  /**
   * 请求群列表
   * @param val 要设置的值
   * @returns void
   */
  public updateGroup() {
    getGroupList().then(({ data }) => {
      const { groups } = data;
      this.groupData = groups;
    });
  }

  /**
   * 请求好友列表
   * @param val 要设置的值
   * @returns void
   */
  public updateFriend() {
    getFriendList().then(({ data }) => {
      const { friends } = data;
      this.friendData = friends;
    });
  }

  public setFriendData(friends: any[]) {
    this.friendData = friends;
  }
}

const ChatListStore = new ChatListState();

export default ChatListStore;

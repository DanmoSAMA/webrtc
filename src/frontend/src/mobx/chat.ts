/**
 * description: 当前聊天
 * date: 2022-11-01 14:33:52 +0800
 */

import { makeAutoObservable } from 'mobx';
import { IChat } from '@/types';

class ChatState {
  public currentChat: Partial<IChat> | null = null;

  public constructor() {
    makeAutoObservable(this);
  }

  /**
   * 设置当前显示的聊天
   * @param val 要设置的值
   * @returns void
   */
  public setCurrentChat(val: Partial<IChat> | null) {
    this.currentChat = val;
  }

  /**
   * 更新单聊对象的 online 属性
   * @param val 要设置的值
   * @returns void
   */
  public updateOnline(friends: any[]) {
    for (const friend of friends) {
      if (this.currentChat && friend.uid === this.currentChat.uid) {
        this.currentChat.online = friend.online;
      }
    }
  }
}

const ChatStore = new ChatState();

export default ChatStore;

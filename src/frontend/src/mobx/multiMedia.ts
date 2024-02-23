/**
 * description: 多媒体
 * date: 2024-02-21 14:37:57 +0800
 */

import { makeAutoObservable } from 'mobx';
import ChatStore from './chat';
import { IUser } from '@/types';

class MultiMediaState {
  public isAudioOpen = false;
  public isVideoOpen = false;
  public isSender = true;
  public sender: IUser | null = null;

  public constructor() {
    makeAutoObservable(this);
  }

  /**
   * 设置是否使用音频
   * @param val 要设置的值
   * @returns void
   */
  public setAudioOpenState(val: boolean) {
    this.isAudioOpen = val;
  }

  /**
   * 设置是否使用视频
   * @param val 要设置的值
   * @returns void
   */
  public setVideoOpenState(val: boolean) {
    this.isVideoOpen = val;
  }

  /**
   * 初始化
   * @param val 要设置的值
   * @returns void
   */
  public initMultiMedia(isSender: boolean, sender?: IUser) {
    if (!isSender && sender) {
      ChatStore.setCurrentChat({
        uid: sender.uid,
        avatarUrl: sender.avatarUrl,
        name: sender.name,
        online: sender.online,
      });

      this.sender = sender;
    }

    ChatStore.isMultiMedia = true;

    this.isAudioOpen = true;
    this.isVideoOpen = false;
    this.isSender = isSender;
  }
}

const MultiMediaStore = new MultiMediaState();

export default MultiMediaStore;

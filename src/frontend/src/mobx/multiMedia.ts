/**
 * description: 多媒体
 * date: 2024-02-21 14:37:57 +0800
 */

import { makeAutoObservable } from 'mobx';
import { IUser } from '@/types';
import ChatStore from './chat';

class MultiMediaState {
  public isAudioOpen = true;
  public isVideoOpen = true;
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
   * 设置是否为发送方
   * @param val 要设置的值
   * @returns void
   */
  public setIsSender(val: boolean) {
    this.isSender = val;
  }

  /**
   * 设置发送方信息
   * @param val 要设置的值
   * @returns void
   */
  public setSender(val: IUser) {
    this.sender = val;
  }

  /**
   * 初始化
   * @param val 要设置的值
   * @returns void
   */
  public initMultiMedia(
    isSender: boolean,
    sender?: IUser,
    isAudioOpen?: boolean,
    isVideoOpen?: boolean,
  ) {
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

    this.isAudioOpen = isAudioOpen ?? true;
    this.isVideoOpen = isVideoOpen ?? true;
    this.isSender = isSender;
  }
}

const MultiMediaStore = new MultiMediaState();

export default MultiMediaStore;

/**
 * description: 多媒体
 * date: 2024-02-21 14:37:57 +0800
 */

import { makeAutoObservable } from 'mobx';
import { IUser } from '@/types';
import { SingleVideoCall } from '@/webrtc/single';
import ChatStore from './chat';
import { DesktopShare } from '@/webrtc/desktop';

export enum MultiMediaType {
  VoiceCall,
  ShareDesktop,
}

class MultiMediaState {
  public isAudioOpen = true;
  public isVideoOpen = true;
  public isSender = true;
  public sender: IUser | null = null;
  public memberList: IUser[] = [];
  public stream: MediaStream;
  public displayStream: MediaStream;
  public svc: SingleVideoCall;
  public file: File | null = null;
  public type: MultiMediaType = MultiMediaType.VoiceCall;
  public ds: DesktopShare;

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
   * 设置发送方信息（单聊）
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
      this.isSender = false;
    }

    ChatStore.isMultiMedia = true;

    this.isAudioOpen = isAudioOpen ?? true;
    this.isVideoOpen = isVideoOpen ?? true;
    this.isSender = true;
  }

  /**
   * 加入群语音
   * @param user 加入群语音的用户
   * @returns void
   */
  public joinGroupVideoChat(user: IUser) {
    this.memberList.push(user);
  }

  /**
   * 设置 stream
   * @param void
   * @returns void
   */
  public setStream(): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((_stream) => {
          if (!this.isAudioOpen) {
            _stream.getAudioTracks().forEach((track) => track.stop());
          }
          if (!this.isVideoOpen) {
            _stream.getVideoTracks().forEach((track) => track.stop());
          }

          MultiMediaStore.stream = _stream;

          resolve();
        })
        .catch((error) => {
          console.log('获取媒体流失败: ', error);
          reject(error);
        });
    });
  }

  /**
   * 设置 display stream
   * @param void
   * @returns void
   */
  public setDisplayStream(): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
          audio: false,
        })
        .then((_stream) => {
          MultiMediaStore.displayStream = _stream;
          resolve();
        })
        .catch((error) => {
          console.log('获取媒体流失败: ', error);
          reject(error);
        });
    });
  }
}

const MultiMediaStore = new MultiMediaState();

export default MultiMediaStore;

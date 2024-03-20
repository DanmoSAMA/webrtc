/**
 * description: 桌面共享
 * date: 2024-03-20 09:00:31 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { terminateCall } from '@/network/friend/terminateCall';
import ChatStore from '@/mobx/chat';
import { terminateDesktopShare } from '@/network/friend/terminateDesktopShare';

export class DesktopShare {
  pc: RTCPeerConnection;
  stream?: MediaStream;

  constructor(_stream: MediaStream) {
    this.pc = new RTCPeerConnection();
    this.stream = _stream;
  }

  handleSenderSide() {
    console.log('sender: add track');

    this.stream!.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.stream!);
    });

    this.pc.onnegotiationneeded = () => {
      this.pc
        .createOffer()
        .then((offer) => {
          console.log('sender: setLocalDescription');
          return this.pc.setLocalDescription(offer);
        })
        .then(() => {
          console.log('sender: sdp offer');
          socket.emit(
            'sdp offer request',
            this.pc.localDescription,
            ChatStore.currentChat?.uid,
            getToken(),
          );
        })
        .catch((error) => {
          console.log('创建 SDP 失败: ', error);
        });
    };

    this.pc.onicecandidate = function (event) {
      if (event.candidate) {
        console.log('sender: send ice candidate');
        socket.emit(
          'ice candidate request',
          event.candidate,
          ChatStore.currentChat?.uid,
        );
      } else {
        console.log('ICE Candidate collection complete.');
      }
    };

    socket.on('sdp answer received', (answer) => {
      if (this.pc.remoteDescription !== null) {
        return;
      }

      console.log('sender: get sdp answer');

      this.pc
        .setRemoteDescription(answer)
        .then(() => {
          console.log('设置远程 SDP 成功');
        })
        .catch((error) => {
          console.log('设置远程 SDP 失败: ', error);
        });
    });

    socket.on('ice candidate received', (candidate) => {
      console.log('sender: get ice candidate');

      setTimeout(() => {
        this.pc
          .addIceCandidate(candidate)
          .then(() => {
            console.log('添加 ICE 候选者成功');
          })
          .catch((error) => {
            console.log('添加 ICE 候选者失败: ', error);
          });
      }, 100);
    });

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') {
        console.log('连接已建立');
      }

      if (this.pc.connectionState === 'failed') {
        this.pc.restartIce();
      }
    };
  }

  handleReceiverSide(senderUid: any) {
    this.pc.onicecandidate = function (event) {
      if (event.candidate) {
        console.log('receiver: send ice candidate');
        socket.emit('ice candidate request', event.candidate, senderUid);
      } else {
        console.log('ICE Candidate collection complete.');
      }
    };

    socket.on('sdp offer received', (offer) => {
      if (this.pc.remoteDescription !== null) {
        return;
      }

      console.log('receiver: get sdp offer');

      const sessionDescription = new RTCSessionDescription(offer);

      this.pc.setRemoteDescription(sessionDescription).then(() => {
        console.log('receiver: setRemoteDescription');

        this.pc
          .createAnswer()
          .then((answer) => {
            return this.pc.setLocalDescription(answer);
          })
          .then(() => {
            console.log('receiver: sdp answer');
            socket.emit(
              'sdp answer request',
              this.pc.localDescription,
              senderUid,
            );
          })
          .catch((error) => {
            console.error('Error creating SDP Answer:', error);
          });
      });
    });

    socket.on('ice candidate received', (candidate) => {
      console.log('receiver: get ice candidate');

      setTimeout(() => {
        this.pc
          .addIceCandidate(candidate)
          .then(() => {
            console.log('添加 ICE 候选者成功');
          })
          .catch((error) => {
            console.log('添加 ICE 候选者失败: ', error);
          });
      }, 100);
    });

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') {
        console.log('连接已建立');
      }

      if (this.pc.connectionState === 'failed') {
        this.pc.restartIce();
      }
    };

    this.pc.ontrack = (e) => {
      console.log('receiver ontrack');

      setTimeout(() => {
        const videoElement = document.querySelector(
          'video#desktop_video',
        ) as HTMLMediaElement;
        videoElement.srcObject = e.streams[0];
        videoElement.onloadedmetadata = () => {
          videoElement.play();
        };
      }, 100);
    };
  }

  stopConnection() {
    this.pc.close();

    // 向对方发送终止通话的通知
    terminateDesktopShare({ uid: ChatStore.currentChat?.uid });

    ChatStore.setIsMultiMedia(false);
  }
}

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { terminateCall } from '@/network/webrtc/terminateCall';
import ChatStore from '@/mobx/chat';

export class SingleVideoCall {
  pc: RTCPeerConnection;
  // @ts-ignore
  stream: MediaStream;

  constructor(_stream: MediaStream) {
    this.pc = new RTCPeerConnection();
    this.stream = _stream;
  }

  handleSenderSide() {
    console.log('sender: add track');

    this.stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.stream);
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
      console.log('🐮', this.pc.connectionState);

      if (this.pc.connectionState === 'connected') {
        console.log('连接已建立');
      }

      if (this.pc.connectionState === 'failed') {
        console.log('restart ICE!');
        this.pc.restartIce();
      }
    };

    this.pc.ontrack = (e) => {
      console.log('sender ontrack');

      const oppositeSideMediaElement = document.querySelector(
        'video#oppositeSide',
      ) as HTMLMediaElement;

      oppositeSideMediaElement.srcObject = e.streams[0];

      oppositeSideMediaElement.onloadedmetadata = () => {
        oppositeSideMediaElement.play();
      };
    };
  }

  handleReceiverSide(senderUid: any) {
    console.log('receiver: add track');

    this.stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.stream);
    });

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
      console.log('🐮', this.pc.connectionState);

      if (this.pc.connectionState === 'connected') {
        console.log('连接已建立');
      }
    };

    this.pc.ontrack = (e) => {
      console.log('receiver ontrack');

      setTimeout(() => {
        const oppositeSideMediaElement = document.querySelector(
          'video#oppositeSide',
        ) as HTMLMediaElement;

        oppositeSideMediaElement.srcObject = e.streams[0];

        oppositeSideMediaElement.onloadedmetadata = () => {
          oppositeSideMediaElement.play();
        };
      }, 100);
    };
  }

  stopConnection(isSender = true) {
    this.pc.getSenders().forEach((sender) => {
      this.pc.removeTrack(sender);
    });

    this.pc.close();

    ChatStore.setIsMultiMedia(false);

    // 向对方发送终止通话的通知
    if (isSender) {
      terminateCall({ uid: ChatStore.currentChat?.uid });
    }
  }
}

/**
 * description: TODO
 * date: 2024-03-05 00:06:32 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';

export class GroupVideoCall {
  pc: RTCPeerConnection;
  remoteUid: number; // 对端节点的 uid
  stream: MediaStream;

  constructor(_stream: MediaStream) {
    this.remoteUid = 0;
    this.stream = _stream;

    this.pc = new RTCPeerConnection();
    this.addTrack();
    this.setListener();
  }

  setListener() {
    socket.on('sdp offer received', (offer, sender) => {
      // console.log('🐮', this.pc.remoteDescription, sender);

      if (this.pc.remoteDescription !== null) {
        return;
      }

      console.log('receiver: get sdp offer');

      this.remoteUid = sender.uid;

      const sessionDescription = new RTCSessionDescription(offer);

      this.pc.setRemoteDescription(sessionDescription).then(() => {
        console.log('receiver: setRemoteDescription');

        setTimeout(() => {
          this.pc
            .createAnswer()
            .then((answer) => {
              return this.pc.setLocalDescription(answer);
            })
            .then(() => {
              console.log('receiver: send sdp answer');

              socket.emit(
                'sdp answer request',
                this.pc.localDescription,
                sender.uid,
                getToken(),
              );
            })
            .catch((error) => {
              console.error('Error creating SDP Answer:', error);
            });
        }, 233);
      });
    });

    socket.on('sdp answer received', (answer, receiver) => {
      if (this.pc.remoteDescription !== null) {
        return;
      }

      if (this.remoteUid === receiver.uid) {
        console.log('sender: get sdp answer');

        this.pc
          .setRemoteDescription(answer)
          .then(() => {
            console.log('sender: setRemoteDescription');
          })
          .catch((error) => {
            console.log('设置远程 SDP 失败: ', error);
          });
      }
    });

    socket.on('ice candidate received', (candidate) => {
      setTimeout(() => {
        // 先 setRemoteDescription，再 addIceCandidate
        console.log('get ice candidate');
        this.pc.addIceCandidate(candidate).catch((error) => {
          console.log('添加 ICE 候选者失败: ', error);
        });
      }, 233);
    });

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('send ice candidate');
        socket.emit('ice candidate request', event.candidate, this.remoteUid);
      } else {
        console.log('ICE Candidate collection complete.');
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') {
        console.log(`和${this.remoteUid}的连接已建立`);
      }
    };

    this.pc.ontrack = (e) => {
      console.log('ontrack');

      setTimeout(() => {
        const MediaElement = document.querySelector(
          `video#group_video_${this.remoteUid}`,
        ) as HTMLMediaElement;

        // console.log(this.remoteUid, MediaElement);

        MediaElement.srcObject = e.streams[0];

        MediaElement.onloadedmetadata = () => {
          MediaElement.play();
        };
      }, 233);
    };
  }

  addTrack() {
    console.log('sender: add track');

    this.stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.stream);
    });
  }

  sendRequest(uid: any) {
    this.remoteUid = uid;

    this.pc
      .createOffer()
      .then((offer) => {
        console.log('sender: setLocalDescription');
        return this.pc.setLocalDescription(offer);
      })
      .then(() => {
        console.log('sender: send sdp offer');
        socket.emit(
          'sdp offer request',
          this.pc.localDescription,
          uid,
          getToken(),
        );
      })
      .catch((error) => {
        console.log('创建 SDP 失败: ', error);
      });
  }
}

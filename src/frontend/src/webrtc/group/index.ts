import { getUid } from '@/utils/uid';
import { socket } from '@/App';
import { getToken } from '@/utils/token';
import MultiMediaStore from '@/mobx/multiMedia';

export const pc = new RTCPeerConnection();

export function listenToEventAndSocket() {
  let senderUid = 0;

  socket.on('sdp offer received', (offer, sender) => {
    console.log('receiver: get sdp offer');

    senderUid = sender.uid;
    const sessionDescription = new RTCSessionDescription(offer);

    pc.setRemoteDescription(sessionDescription).then(() => {
      console.log('receiver: setRemoteDescription');

      setTimeout(() => {
        pc.createAnswer()
          .then((answer) => {
            return pc.setLocalDescription(answer);
          })
          .then(() => {
            console.log('receiver: sdp answer');

            socket.emit('sdp answer request', pc.localDescription, sender.uid);
          })
          .catch((error) => {
            console.error('Error creating SDP Answer:', error);
          });
      }, 100);
    });
  });

  socket.on('sdp answer received', (answer) => {
    console.log('sender: get sdp answer');

    pc.setRemoteDescription(answer).catch((error) => {
      console.log('设置远程 SDP 失败: ', error);
    });
  });

  socket.on('ice candidate received', (candidate) => {
    console.log('sender: get ice candidate');
    pc.addIceCandidate(candidate).catch((error) => {
      console.log('添加 ICE 候选者失败: ', error);
    });
  });

  pc.onicecandidate = function (event) {
    if (event.candidate) {
      console.log('sender: ice candidate');
      socket.emit('ice candidate request', event.candidate, senderUid);
    } else {
      console.log('ICE Candidate collection complete.');
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      console.log('连接已建立');
    }
  };

  // TODO
  pc.ontrack = (e) => {
    console.log('ontrack');

    setTimeout(() => {
      const MediaElement = document.querySelector(
        `video#group_video_${senderUid}`,
      ) as HTMLMediaElement;

      console.log('🐮', e.streams);

      MediaElement.srcObject = e.streams[0];

      MediaElement.onloadedmetadata = () => {
        MediaElement.play();
      };
    }, 100);
  };
}

export function initOwnMedia(): Promise<void> {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (!MultiMediaStore.isAudioOpen) {
          stream.getAudioTracks().forEach((track) => track.stop());
        }
        if (!MultiMediaStore.isVideoOpen) {
          stream.getVideoTracks().forEach((track) => track.stop());
        }

        console.log('sender: add track');

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        setTimeout(() => {
          const MediaElement = document.querySelector(
            `video#group_video_${getUid()}`,
          ) as HTMLMediaElement;

          MediaElement.srcObject = stream;

          MediaElement.onloadedmetadata = () => {
            MediaElement.play();
            resolve();
          };
        }, 100);
      })
      .catch((error) => {
        console.log('获取媒体流失败: ', error);
        reject(error);
      });
  });
}

export function sendRequest(gid: any) {
  pc.createOffer()
    .then((offer) => {
      console.log('sender: setLocalDescription');
      return pc.setLocalDescription(offer);
    })
    .then(() => {
      console.log('sender: sdp offer');
      socket.emit(
        'sdp offer request',
        pc.localDescription,
        undefined,
        getToken(),
        gid,
      );
    })
    .catch((error) => {
      console.log('创建 SDP 失败: ', error);
    });

  pc.ontrack = (e) => {
    console.log('ontrack');

    setTimeout(() => {
      console.log(MultiMediaStore.memberList);

      for (let i = 0; i < e.streams.length; i++) {
        const user = MultiMediaStore.memberList[i];
        const stream = e.streams[i];

        const MediaElement = document.querySelector(
          `video#group_video_${user.uid}`,
        ) as HTMLMediaElement;

        MediaElement.srcObject = stream;

        MediaElement.onloadedmetadata = () => {
          MediaElement.play();
        };
      }
    }, 100);
  };
}

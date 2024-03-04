import { socket } from '@/App';
import MultiMediaStore from '@/mobx/multiMedia';

export const pc = new RTCPeerConnection();

export function handleReceiverSide(senderUid: any) {
  console.log('handleReceiverSide');

  if (pc.connectionState === 'new') {
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

        console.log('receiver: add track');

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        setTimeout(() => {
          const ownSideMediaElement = document.querySelector(
            'video#ownSide',
          ) as HTMLMediaElement;

          ownSideMediaElement.srcObject = stream;

          ownSideMediaElement.onloadedmetadata = () => {
            ownSideMediaElement.play();
          };
        }, 0);
      });
  }

  pc.onicecandidate = function (event) {
    if (event.candidate) {
      console.log('receiver: ice candidate');
      socket.emit('ice candidate request', event.candidate, senderUid);
    } else {
      console.log('ICE Candidate collection complete.');
    }
  };

  socket.on('sdp offer received', (offer) => {
    console.log('receiver: get sdp offer');
    const sessionDescription = new RTCSessionDescription(offer);

    pc.setRemoteDescription(sessionDescription).then(() => {
      console.log('receiver: setRemoteDescription');
      // receivedSdpOffer = true;

      // 此处加定时器，是为了让 createAnswer 在 addTrack 之后执行
      // 否则 pc 的 stream 里面没有正确添加视频轨和音频轨，导致发送侧收到 answer 并且调用 setRemoteDescription 时
      // 不触发 ontrack 回调
      setTimeout(() => {
        pc.createAnswer()
          .then((answer) => {
            return pc.setLocalDescription(answer);
          })
          .then(() => {
            console.log('receiver: sdp answer');
            socket.emit('sdp answer request', pc.localDescription, senderUid);
          })
          .catch((error) => {
            console.error('Error creating SDP Answer:', error);
          });
      }, 100);
    });
  });

  socket.on('ice candidate received', (candidate) => {
    console.log('receiver: get ice candidate');
    pc.addIceCandidate(candidate).catch((error) => {
      console.log('添加 ICE 候选者失败: ', error);
    });
  });

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      console.log('连接已建立');
    }
  };

  pc.ontrack = (e) => {
    console.log('opposite ontrack');

    setTimeout(() => {
      const oppositeSideMediaElement = document.querySelector(
        'video#oppositeSide',
      ) as HTMLMediaElement;

      oppositeSideMediaElement.srcObject = e.streams[0];

      // 意味着媒体流已经准备就绪，可以开始播放了
      oppositeSideMediaElement.onloadedmetadata = () => {
        oppositeSideMediaElement.play();
      };
    }, 0);
  };
}

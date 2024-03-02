import { socket } from '@/App';
import ChatStore from '@/mobx/chat';
import MultiMediaStore from '@/mobx/multiMedia';

export const pc = new RTCPeerConnection();

export function handleSenderSide() {
  console.log('handleSenderSide');

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

      const ownSideMediaElement = document.querySelector(
        'video#ownSide',
      ) as HTMLMediaElement;

      ownSideMediaElement.srcObject = stream;

      ownSideMediaElement.onloadedmetadata = () => {
        ownSideMediaElement.play();
      };
    })
    .catch((error) => {
      console.log('获取媒体流失败: ', error);
    });

  pc.onnegotiationneeded = () => {
    console.log('sender: onnegotiationneeded');

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
          ChatStore.currentChat?.uid,
        );
      })
      .catch((error) => {
        console.log('创建 SDP 失败: ', error);
      });
  };

  pc.onicecandidate = function (event) {
    if (event.candidate) {
      console.log('sender: ice candidate');
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

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      console.log('连接已建立');
    }
  };

  pc.ontrack = (e) => {
    console.log('own ontrack');

    const oppositeSideMediaElement = document.querySelector(
      'video#oppositeSide',
    ) as HTMLMediaElement;

    oppositeSideMediaElement.srcObject = e.streams[0];

    oppositeSideMediaElement.onloadedmetadata = () => {
      oppositeSideMediaElement.play();
    };
  };
}

/**
 * description: 多媒体 单聊
 * date: 2024-02-21 21:10:49 +0800
 */

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { SingleVideoCall } from '../../../../webrtc/single';
import { socket } from '@/App';
import { useAlert } from 'react-alert';
import { switchToSender } from '@/network/webrtc/switchToSender';
import { switchToReceiver } from '@/network/webrtc/switchToReceiver';
import Switch from '../../../Header/components/LeftDropdown/components/Switch';
import MultiMediaStore from '@/mobx/multiMedia';
import ChatStore from '@/mobx/chat';
import './index.scss';

function _MultiMediaSingle() {
  const alert = useAlert();

  useEffect(() => {
    const ownSideMediaElement = document.querySelector(
      'video#ownSide',
    ) as HTMLMediaElement;

    ownSideMediaElement.srcObject = MultiMediaStore.stream;

    ownSideMediaElement.onloadedmetadata = () => {
      ownSideMediaElement.play();
    };
  }, [MultiMediaStore.stream]);

  useEffect(() => {
    socket.on('terminate call received', () => {
      MultiMediaStore.svc.stopConnection(false);

      alert.show('对方已结束通话', {
        onClose: () => {
          location.reload();
        },
      });
    });

    socket.on('reject call received', () => {
      ChatStore.setIsMultiMedia(false);
      alert.show('对方拒绝通话');
    });

    socket.on('accept call received', () => {
      const svc = new SingleVideoCall(MultiMediaStore.stream);
      MultiMediaStore.svc = svc;
      svc.handleSenderSide();
    });

    socket.on('switch to sender received', (sender) => {
      MultiMediaStore.initMultiMedia(
        false,
        sender,
        MultiMediaStore.isAudioOpen,
        MultiMediaStore.isVideoOpen,
      );
      console.log('switch to sender received');

      const svc = new SingleVideoCall(MultiMediaStore.stream);
      MultiMediaStore.svc = svc;
      svc.handleReceiverSide(sender.uid);

      switchToReceiver({ uid: sender.uid });
    });

    socket.on('switch to receiver received', () => {
      const svc = new SingleVideoCall(MultiMediaStore.stream);
      MultiMediaStore.svc = svc;
      svc.handleSenderSide();
    });
  }, []);

  useEffect(() => {
    // 刷新页面时断开连接
    window.addEventListener('beforeunload', () => {
      MultiMediaStore.svc.stopConnection();
    });
  }, []);

  return (
    <>
      <video
        id='ownSide'
        style={{
          width: 360,
          height: 270,
          backgroundColor: '#000',
          borderRadius: 5,
        }}
      />
      <video
        id='oppositeSide'
        style={{
          width: 360,
          height: 270,
          backgroundColor: '#000',
          marginTop: 30,
          borderRadius: 5,
        }}
      />
      <div className='c-multimedia-operation'>
        <div className='c-multimedia-operation-item'>
          音频：
          <Switch
            checked={MultiMediaStore.isAudioOpen}
            onChange={async (e) => {
              MultiMediaStore.setAudioOpenState(e.target.checked);
              await MultiMediaStore.setStream();
              switchToSender({ uid: ChatStore.currentChat?.uid });
            }}
            style={{ position: 'static' }}
          />
        </div>
        <div className='c-multimedia-operation-item'>
          视频：
          <Switch
            checked={MultiMediaStore.isVideoOpen}
            onChange={async (e) => {
              MultiMediaStore.setVideoOpenState(e.target.checked);
              await MultiMediaStore.setStream();
              switchToSender({ uid: ChatStore.currentChat?.uid });
            }}
            style={{ position: 'static' }}
          />
        </div>
        <div
          className='c-multimedia-operation-stop'
          onClick={() => {
            MultiMediaStore.svc.stopConnection();
            location.reload();
          }}
        >
          终止通话
        </div>
      </div>
    </>
  );
}

const MultiMediaSingle = observer(_MultiMediaSingle);

export default MultiMediaSingle;

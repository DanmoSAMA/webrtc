/**
 * description: 多媒体 单聊
 * date: 2024-02-21 21:10:49 +0800
 */

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { handleSenderSide, pc } from '../../../../webrtc/single/sender';
import { handleReceiverSide } from '../../../../webrtc/single/receiver';
import { socket } from '@/App';
import { stopConnection } from '../../../../webrtc/single/utils';
import { useAlert } from 'react-alert';
import { switchToSender } from '@/network/webrtc/switchToSender';
import Switch from '../../../Header/components/LeftDropdown/components/Switch';
import MultiMediaStore from '@/mobx/multiMedia';
import ChatStore from '@/mobx/chat';
import './index.scss';

function _MultiMediaSingle() {
  const alert = useAlert();

  useEffect(() => {
    if (MultiMediaStore.isSender) {
      handleSenderSide();
    } else {
      switchToSender({ uid: MultiMediaStore.sender?.uid });
      handleSenderSide();
    }
  }, [MultiMediaStore.isAudioOpen, MultiMediaStore.isVideoOpen]);

  useEffect(() => {
    socket.on('terminate call received', () => {
      stopConnection(pc, false);

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

    socket.on('switch to sender received', (sender) => {
      MultiMediaStore.initMultiMedia(
        false,
        sender,
        MultiMediaStore.isAudioOpen,
        MultiMediaStore.isVideoOpen,
      );
      handleReceiverSide(sender.uid);
    });
  }, []);

  useEffect(() => {
    // 刷新页面时断开连接
    window.addEventListener('beforeunload', () => {
      stopConnection(pc);
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
            onChange={(e) => {
              const value = e.target.checked;
              MultiMediaStore.setAudioOpenState(value);
            }}
            style={{ position: 'static' }}
          />
        </div>
        <div className='c-multimedia-operation-item'>
          视频：
          <Switch
            checked={MultiMediaStore.isVideoOpen}
            onChange={(e) => {
              const value = e.target.checked;
              MultiMediaStore.setVideoOpenState(value);
            }}
            style={{ position: 'static' }}
          />
        </div>
        <div
          className='c-multimedia-operation-stop'
          onClick={() => {
            stopConnection(pc);
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

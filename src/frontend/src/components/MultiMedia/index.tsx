/**
 * description: 多媒体
 * date: 2024-02-21 21:10:49 +0800
 */

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { handleSenderSide, pc } from '../../webrtc/sender';
import { socket } from '@/App';
import { stopConnection } from '../../webrtc/utils';
import { useAlert } from 'react-alert';
import Switch from '../Header/components/LeftDropdown/components/Switch';
import MultiMediaStore from '@/mobx/multiMedia';
import './index.scss';

function _MultiMedia() {
  const alert = useAlert();

  useEffect(() => {
    if (MultiMediaStore.isSender) {
      handleSenderSide();
    } else {
      // handleReceiverSide(MultiMediaStore.sender?.uid);
    }
  }, []); // MultiMediaStore.isAudioOpen, MultiMediaStore.isVideoOpen

  useEffect(() => {
    socket.on('terminate call received', () => {
      stopConnection(pc, false);

      alert.show('对方已结束通话');
    });
  });

  return (
    <div className='c-multimedia'>
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
          }}
        >
          终止通话
        </div>
      </div>
    </div>
  );
}

const MultiMedia = observer(_MultiMedia);

export default MultiMedia;

/**
 * description: 多媒体 群聊
 * date: 2024-03-02 19:46:12 +0800
 */

import { observer } from 'mobx-react-lite';
import { leaveGroupVideo } from '@/network/group/leaveGroupVideo';
import { useEffect } from 'react';
import { socket } from '@/App';
import { isInGroup, isThisGroup } from '@/utils/chat';
import { getUid } from '@/utils/uid';
import { GroupVideoCall } from '@/webrtc/group';
import Switch from '@/components/Header/components/LeftDropdown/components/Switch';
import MultiMediaStore from '@/mobx/multiMedia';
import ChatStore from '@/mobx/chat';
import GroupStore from '@/mobx/group';
import './index.scss';

function _MultiMediaGroup() {
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      leaveGroupVideo({ gid: GroupStore.gid });
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const MediaElement = document.querySelector(
        `video#group_video_${getUid()}`,
      ) as HTMLMediaElement;

      MediaElement.srcObject = MultiMediaStore.stream;

      MediaElement.onloadedmetadata = () => {
        MediaElement.play();
      };
    }, 100);
  }, []);

  useEffect(() => {
    socket.on('join group video received', (gid, memberList, sender) => {
      isInGroup(gid).then((checked) => {
        if (checked && isThisGroup(gid)) {
          MultiMediaStore.memberList = memberList;

          if (sender.uid !== getUid()) {
            // 创建新的 pc 并监听事件
            new GroupVideoCall(MultiMediaStore.stream);
          }
        }
      });
    });
  }, []);

  return (
    <>
      <div className='c-multimedia-user_list'>
        {MultiMediaStore.memberList.map((user) => (
          <div className='c-multimedia-user_list-item' key={user.uid}>
            <video
              className='c-multimedia-user_list-item-video'
              id={`group_video_${user.uid}`}
            />
            <span className='c-multimedia-user_list-item-name'>
              {user.name}
            </span>
          </div>
        ))}
      </div>
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
            ChatStore.setIsMultiMedia(false);
            leaveGroupVideo({ gid: GroupStore.gid });
            MultiMediaStore.memberList = MultiMediaStore.memberList.filter(
              (item) => item.uid !== getUid(),
            );
            location.reload();
          }}
        >
          终止通话
        </div>
      </div>
    </>
  );
}

const MultiMediaGroup = observer(_MultiMediaGroup);

export default MultiMediaGroup;

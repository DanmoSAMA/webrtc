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
import { reconnect } from '@/network/group/reconnect';
import Switch from '@/components/Header/components/LeftDropdown/components/Switch';
import MultiMediaStore from '@/mobx/multiMedia';
import ChatStore from '@/mobx/chat';
import GroupStore from '@/mobx/group';
import './index.scss';

async function handleReconnect() {
  const { data: memberList } = await reconnect({
    gid: GroupStore.gid,
  });

  // 等到对面 pc 开始监听，再发送请求
  setTimeout(() => {
    for (let i = 0; i < memberList.length; i++) {
      if (memberList[i].uid === getUid()) {
        continue;
      }
      const gvc = new GroupVideoCall(MultiMediaStore.stream);
      gvc.sendRequest(memberList[i].uid);
    }
  }, 100);
}

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
  }, [MultiMediaStore.stream]);

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

    socket.on('reconnect group video received', (gid, sender) => {
      isInGroup(gid).then((checked) => {
        if (checked && isThisGroup(gid)) {
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
            onChange={async (e) => {
              MultiMediaStore.setAudioOpenState(e.target.checked);
              await MultiMediaStore.setStream();
              handleReconnect();
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
              handleReconnect();
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

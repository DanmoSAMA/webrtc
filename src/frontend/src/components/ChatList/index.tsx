import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { ChatType } from '@/enums';
import { DefaultGroupAvatarUrl, DefaultAvatarUrl } from '@/consts';
import { IGroup, IUser } from '@/types';
import { socket } from '@/App';
import { getFriendList } from '@/network/friend/getFriendList';
import ChatListStore from '@/mobx/chatlist';
import ListItem from './components/ListItem';
import Loading from '@/components/Loading';
import ChatStore from '@/mobx/chat';
import GroupStore from '@/mobx/group';
import './index.scss';

function _ChatList() {
  const [isLoading, setIsLoading] = useState(true);

  function handleFetchData() {
    setIsLoading(true);

    if (ChatListStore.chatType === ChatType.Private) {
      ChatListStore.updateFriend();
    } else {
      ChatListStore.updateGroup();
    }
    setIsLoading(false);
  }

  useEffect(() => {
    handleFetchData();
  }, [ChatListStore.chatType]);

  async function socketCallback() {
    const { data } = await getFriendList();
    ChatListStore.setFriendData(data.friends);

    if (ChatStore.currentChat?.uid) {
      const { data } = await getFriendList();
      ChatStore.updateOnline(data.friends);
    } else if (GroupStore.gid !== 0) {
      GroupStore.init(GroupStore.gid);
    }
  }

  useEffect(() => {
    socket.on('login received', socketCallback);
    socket.on('logout received', socketCallback);
  }, []);

  return (
    <div className='c-chat_list'>
      {ChatListStore.chatType === ChatType.Private &&
        ChatListStore.friendData?.map(
          ({ uid, avatarUrl, name, online }: IUser) => (
            <ListItem
              key={`u${uid}`}
              uid={uid}
              avatarUrl={avatarUrl ? avatarUrl : DefaultAvatarUrl}
              name={name}
              chatType={ChatType.Private}
              online={online}
            />
          ),
        )}
      {ChatListStore.chatType === ChatType.Group &&
        ChatListStore.groupData?.map(({ gid, avatarUrl, name }: IGroup) => (
          <ListItem
            key={`g${gid}`}
            gid={gid}
            avatarUrl={avatarUrl ? avatarUrl : DefaultGroupAvatarUrl}
            name={name}
            chatType={ChatType.Group}
          />
        ))}
      {isLoading && <Loading />}
    </div>
  );
}

const ChatList = observer(_ChatList);

export default ChatList;

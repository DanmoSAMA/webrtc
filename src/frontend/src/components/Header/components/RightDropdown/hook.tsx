import { quitGroup } from '@/network/group/quitGroup';
import { HttpCode } from '../../../../../../shared/consts/httpCode';
import { deleteFriend } from '@/network/friend/deleteFriend';
import { useAlert } from 'react-alert';
import ChatStore from '@/mobx/chat';
import ChatListStore from '@/mobx/chatlist';
import GroupStore from '@/mobx/group';

export function useOperation() {
  const alert = useAlert();

  const handleQuit = async () => {
    const { code } = await quitGroup({ gid: GroupStore.gid });

    if (code === HttpCode.OK) {
      alert.show('已退群', {
        onClose: () => {
          ChatListStore.updateGroup();
          ChatStore.setCurrentChat(null);
        },
      });
    } else if (code === HttpCode.OWNER_QUIT_GROUP) {
      alert.show('群主不能退群');
    } else if (code === HttpCode.QUIT_GROUP_ERROR) {
      alert.show('操作异常');
    }
  };

  const handleDeleteFriend = async () => {
    const { code } = await deleteFriend({ uid: ChatStore.currentChat?.uid });

    if (code === HttpCode.OK) {
      alert.show('删除成功', {
        onClose: () => {
          ChatListStore.updateFriend();
          ChatStore.setCurrentChat(null);
        },
      });
    } else if (code === HttpCode.DELETE_FRIEND_ERROR) {
      alert.show('删除好友失败');
    }
  };

  return {
    handleQuit,
    handleDeleteFriend,
  };
}

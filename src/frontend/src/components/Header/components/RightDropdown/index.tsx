import { useAlert } from 'react-alert';
import { deleteFriend } from '@/network/friend/deleteFriend';
import { isSingleChat } from '@/utils/chat';
import { quitGroup } from '@/network/group/quitGroup';
import { HttpCode } from '../../../../../../shared/consts/httpCode';
import ChatListStore from '@/mobx/chatlist';
import ChatStore from '@/mobx/chat';
import GroupStore from '@/mobx/group';
import './index.scss';

interface RightDropdownProps {
  showDropdown: boolean;
}

function RightDropdown({ showDropdown }: RightDropdownProps) {
  const alert = useAlert();

  async function handleQuit() {
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
  }

  async function handleDeleteFriend() {
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
  }

  return (
    <div
      className='c-header-right-dropdown'
      style={{ display: showDropdown ? 'flex' : 'none' }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {!isSingleChat() && (
        <div className='c-header-right-dropdown-item' onClick={handleQuit}>
          退出群聊
        </div>
      )}
      {isSingleChat() && (
        <div
          className='c-header-right-dropdown-item'
          onClick={handleDeleteFriend}
        >
          删除好友
        </div>
      )}
    </div>
  );
}
export default RightDropdown;

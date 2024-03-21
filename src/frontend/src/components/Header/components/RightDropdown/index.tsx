import { isSingleChat } from '@/utils/chat';
import { useOperation } from './hook';
import './index.scss';

interface RightDropdownProps {
  showDropdown: boolean;
}

function RightDropdown({ showDropdown }: RightDropdownProps) {
  const { handleQuit, handleDeleteFriend } = useOperation();

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

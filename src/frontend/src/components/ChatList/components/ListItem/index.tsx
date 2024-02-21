import { observer } from 'mobx-react-lite';
import { IChat } from '@/types';
import { MessageType, ChatType } from '@/enums';
import { getIdentity } from '@/network/group/getIdentity';
import ChatStore from '@/mobx/chat';
import AuthorityStore from '@/mobx/authority';
import GroupStore from '@/mobx/group';
import './index.scss';

async function handleClick({
  uid,
  gid,
  avatarUrl,
  name,
  online,
}: Partial<IChat>) {
  ChatStore.setCurrentChat({
    uid,
    gid,
    avatarUrl,
    name,
    online,
  });

  if (gid) {
    const { data } = await getIdentity({ gid }); // 拉取权限
    AuthorityStore.setIdentity(data.identity);

    await GroupStore.init(gid);
  }
}

function _ListItem({
  uid,
  gid,
  avatarUrl,
  name,
  messageType,
  chatType,
  online,
}: Partial<IChat> & { chatType: ChatType }) {
  return (
    <div
      className='c-chat_list-item'
      style={{
        display:
          (chatType === ChatType.Message &&
            (messageType === MessageType.SingleMessage ||
              messageType === MessageType.GroupMessage)) ||
          chatType !== ChatType.Message
            ? 'flex'
            : 'none',
      }}
      onClick={() => handleClick({ uid, gid, avatarUrl, name, online })}
    >
      <div
        className='c-chat_list-item-avatar'
        style={{
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: 'cover',
        }}
      />
      <div className='c-chat_list-item-main'>
        <span className='c-chat_list-item-main-name'>{name}</span>
      </div>
    </div>
  );
}

const ListItem = observer(_ListItem);

export default ListItem;

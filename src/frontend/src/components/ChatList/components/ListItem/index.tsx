import { observer } from 'mobx-react-lite';
import { IChat } from '@/types';
import { MessageType, ChatType } from '@/enums';
import { getIdentity } from '@/network/group/getIdentity';
import { useAlert } from 'react-alert';
import { getGroupVideoChatMembers } from '@/network/group/getGroupVideoChatMembers';
import { HttpCode } from '../../../../../../shared/consts/httpCode';
import ChatStore from '@/mobx/chat';
import AuthorityStore from '@/mobx/authority';
import GroupStore from '@/mobx/group';
import MultiMediaStore from '@/mobx/multiMedia';
import './index.scss';

function _ListItem({
  uid,
  gid,
  avatarUrl,
  name,
  messageType,
  chatType,
  online,
}: Partial<IChat> & { chatType: ChatType }) {
  const alert = useAlert();

  async function handleClick({
    uid,
    gid,
    avatarUrl,
    name,
    online,
  }: Partial<IChat>) {
    if (ChatStore.isMultiMedia) {
      alert.show('请先退出，再进行操作', {
        title: '您正处于语音通话或远程控制中 ',
      });
      return;
    }

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

      getGroupVideoChatMembers({ gid: GroupStore.gid }).then(
        ({ code, data }) => {
          if (code === HttpCode.OK) {
            const { memberList } = data;
            MultiMediaStore.memberList = memberList;
          }
        },
      );
    }
  }

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

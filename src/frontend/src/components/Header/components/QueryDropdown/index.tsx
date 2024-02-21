/**
 * description: 点击放大镜后的下拉
 * date: 2024-02-16 15:05:40 +0800
 */

// import { useAlert } from 'react-alert';
import { isSingleChat } from '@/utils/chat';
import { observer } from 'mobx-react-lite';
import { DefaultAvatarUrl, DefaultGroupAvatarUrl } from '@/consts';
import { AuthorityLevel } from '@/enums';
import GroupStore from '@/mobx/group';
import ListItem from './components/ListItem';
import './index.scss';
import ChatStore from '@/mobx/chat';

interface QueryDropdownProps {
  showDropdown: boolean;
}

function _QueryDropdown({ showDropdown }: QueryDropdownProps) {
  // const alert = useAlert();

  return (
    <div
      className='c-header-query-dropdown'
      style={{ display: showDropdown ? 'flex' : 'none' }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {isSingleChat() && (
        <>
          <div className='c-header-query-dropdown-avatar'>
            <img
              className='c-header-query-dropdown-avatar-img'
              src={ChatStore.currentChat?.avatarUrl ?? DefaultAvatarUrl}
            />
          </div>
          <div className='c-header-query-dropdown-title'>
            账号：{ChatStore.currentChat?.uid}
          </div>
          <div className='c-header-query-dropdown-title'>
            昵称：{ChatStore.currentChat?.name}
          </div>
        </>
      )}
      {!isSingleChat() && (
        <>
          <div className='c-header-query-dropdown-title'>
            群号：{GroupStore.gid}
          </div>
          <div className='c-header-query-dropdown-title'>
            群名称：{GroupStore.name}
          </div>
          <div className='c-header-query-dropdown-title'>群主</div>
          <div className='c-header-query-dropdown-list'>
            <ListItem
              avatarUrl={GroupStore.owner?.avatarUrl ?? DefaultGroupAvatarUrl}
              name={GroupStore.owner?.name}
              identity={AuthorityLevel.Owner}
              uid={GroupStore.owner?.uid}
              gid={GroupStore.gid}
              online={GroupStore.owner?.online}
            />
          </div>
          <div className='c-header-query-dropdown-title'>管理员</div>
          <div className='c-header-query-dropdown-list'>
            {GroupStore.admins.map(({ avatarUrl, name, uid, online }) => (
              <ListItem
                avatarUrl={avatarUrl ?? DefaultGroupAvatarUrl}
                name={name}
                key={`u${uid}`}
                identity={AuthorityLevel.Administrator}
                uid={uid}
                gid={GroupStore.gid}
                online={online}
              />
            ))}
          </div>
          <div className='c-header-query-dropdown-title'>群成员</div>
          <div className='c-header-query-dropdown-list'>
            {GroupStore.members.map(({ avatarUrl, name, uid, online }) => (
              <ListItem
                avatarUrl={avatarUrl ?? DefaultGroupAvatarUrl}
                name={name}
                key={`u${uid}`}
                identity={AuthorityLevel.Member}
                uid={uid}
                gid={GroupStore.gid}
                online={online}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const QueryDropdown = observer(_QueryDropdown);

export default QueryDropdown;

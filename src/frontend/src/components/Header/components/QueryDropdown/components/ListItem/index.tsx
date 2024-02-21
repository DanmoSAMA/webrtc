/**
 * description: 列表元素
 * date: 2024-02-16 15:05:40 +0800
 */

import { observer } from 'mobx-react-lite';
import { AuthorityLevel } from '@/enums';
import { setAdmin, cancelAdmin } from '@/network/group/setAdmin';
import { givePlaneTicket } from '@/network/group/givePlaneTicket';
import { useAlert } from 'react-alert';
import { HttpCode } from '../../../../../../../../shared/consts/httpCode';
import AuthorityStore from '@/mobx/authority';
import GroupStore from '@/mobx/group';
import './index.scss';

interface ListItemProps {
  avatarUrl: string;
  name: string;
  identity: AuthorityLevel;
  uid: number;
  gid: number;
  online: boolean;
}

function _ListItem({
  avatarUrl,
  name,
  identity,
  uid,
  gid,
  online,
}: ListItemProps) {
  const alert = useAlert();

  return (
    <div
      className='c-header-query-dropdown-list-item'
      style={{
        display: 'flex',
      }}
    >
      <div
        className='c-header-query-dropdown-list-item-avatar'
        style={{
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: 'cover',
        }}
      />
      <div className='c-header-query-dropdown-list-item-main'>
        <span className='c-header-query-dropdown-list-item-main-name'>
          {name}
        </span>
        <span className='c-header-query-dropdown-list-item-main-online'>
          {online ? '在线' : ''}
        </span>
        {AuthorityStore.identity === AuthorityLevel.Owner &&
          identity === AuthorityLevel.Member && (
            <div
              className='c-header-query-dropdown-list-item-main-btn'
              onClick={async () => {
                const { code } = await setAdmin({ uid, gid });

                if (code === HttpCode.SET_ADMIN_ERROR) {
                  alert.show('操作失败');
                } else {
                  alert.show('已设置管理员', {
                    onClose: async () => {
                      GroupStore.init(gid);
                    },
                  });
                }
              }}
            >
              设为管理
            </div>
          )}
        {AuthorityStore.identity === AuthorityLevel.Owner &&
          identity === AuthorityLevel.Administrator && (
            <div
              className='c-header-query-dropdown-list-item-main-btn'
              onClick={async () => {
                const { code } = await cancelAdmin({ uid, gid });

                if (code === HttpCode.SET_ADMIN_ERROR) {
                  alert.show('操作失败');
                } else {
                  alert.show('已取消管理员', {
                    onClose: async () => {
                      GroupStore.init(gid);
                    },
                  });
                }
              }}
            >
              移除管理
            </div>
          )}
        {AuthorityStore.identity === AuthorityLevel.Owner &&
          identity !== AuthorityLevel.Owner && (
            <PlaneTicket uid={uid} gid={gid} />
          )}
        {AuthorityStore.identity === AuthorityLevel.Administrator &&
          identity === AuthorityLevel.Member && (
            <PlaneTicket uid={uid} gid={gid} />
          )}
      </div>
    </div>
  );
}

function PlaneTicket({ uid, gid }: any) {
  const alert = useAlert();
  return (
    <div
      className='c-header-query-dropdown-list-item-main-btn'
      onClick={async () => {
        const { code } = await givePlaneTicket({ uid, gid });

        if (code === HttpCode.SET_ADMIN_ERROR) {
          alert.show('操作失败');
        } else {
          alert.show('已踢出群', {
            onClose: async () => {
              GroupStore.init(gid);
            },
          });
        }
      }}
    >
      移出群聊
    </div>
  );
}

const ListItem = observer(_ListItem);

export default ListItem;

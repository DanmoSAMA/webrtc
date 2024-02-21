import { observer } from 'mobx-react-lite';
import { acceptFriend } from '@/network/friend/acceptFriend';
import { MessageType } from '@/enums';
import { MessageStatus } from '../../../../../../shared/enums';
import { acceptJoinGroup } from '@/network/group/acceptJoinGroup';
import { rejectFriend } from '@/network/friend/rejectFriend';
import { rejectJoinGroup } from '@/network/group/rejectJoinGroup';
import MsgStore from '@/mobx/msg';
import ChatListStore from '@/mobx/chatlist';
import './index.scss';

interface NotifyItemProps {
  senderId: number;
  groupId?: number;
  info: string;
  mid: number;
  type: MessageType;
  status: MessageStatus;
}

function _NotifyItem({
  senderId,
  groupId,
  info,
  mid,
  type,
  status,
}: NotifyItemProps) {
  async function agree() {
    if (type === MessageType.FriendRequestNotify) {
      await acceptFriend({ targetUid: senderId, mid });
      await ChatListStore.updateFriend();

      for (const msg of MsgStore.friendRequest) {
        if (msg.messageId === mid) {
          msg.status = MessageStatus.Accepted;
        }
      }
    } else if (type === MessageType.JoinGroupRequestNotify && groupId) {
      await acceptJoinGroup({ applicantUid: senderId, mid, gid: groupId });
      await ChatListStore.updateGroup();

      for (const msg of MsgStore.groupNotify) {
        if (msg.messageId === mid) {
          msg.status = MessageStatus.Accepted;
        }
      }
    }
  }

  async function refuse() {
    if (type === MessageType.FriendRequestNotify) {
      await rejectFriend({ mid });

      for (const msg of MsgStore.friendRequest) {
        if (msg.messageId === mid) {
          msg.status = MessageStatus.Rejected;
        }
      }
    } else if (type === MessageType.JoinGroupRequestNotify && groupId) {
      await rejectJoinGroup({ mid });

      for (const msg of MsgStore.groupNotify) {
        if (msg.messageId === mid) {
          msg.status = MessageStatus.Rejected;
        }
      }
    }
  }

  return (
    <div className='notify_item'>
      <div className='notify_item-ctn'>
        <span className='notify_item-ctn-span'>
          {type === MessageType.FriendRequestNotify &&
            `${senderId} 申请添加您为好友`}
          {type === MessageType.JoinGroupRequestNotify &&
            `${senderId} 申请加入群 ${groupId}`}
          {type === MessageType.SetAdminNotify &&
            `${senderId} 将您设置为 ${groupId} 群的管理员`}
          {type === MessageType.CancelAdminNotify &&
            `${senderId} 取消了您 ${groupId} 群的管理员`}
          {type === MessageType.PlaneTicketNotify &&
            `${senderId} 已将您踢出群 ${groupId}`}
          {type === MessageType.QuitGroupNotify &&
            `${senderId} 已退出群 ${groupId}`}
        </span>
        {(type === MessageType.FriendRequestNotify ||
          type === MessageType.JoinGroupRequestNotify) && (
          <>
            {status === MessageStatus.Unhandled && (
              <>
                <button className='notify_item-ctn-btn agree' onClick={agree}>
                  通过
                </button>
                <button className='notify_item-ctn-btn refuse' onClick={refuse}>
                  拒绝
                </button>
              </>
            )}
            {status === MessageStatus.Accepted && (
              <div className='notify_item-ctn-text'>已通过</div>
            )}
            {status === MessageStatus.Rejected && (
              <div className='notify_item-ctn-text'>已拒绝</div>
            )}
          </>
        )}
      </div>
      {(type === MessageType.FriendRequestNotify ||
        type === MessageType.JoinGroupRequestNotify) && (
        <div className='notify_item-info'>{info}</div>
      )}
    </div>
  );
}

const NotifyItem = observer(_NotifyItem);
export default NotifyItem;

import { acceptFriend } from '@/network/friend/acceptFriend';
import { rejectFriend } from '@/network/friend/rejectFriend';
import { acceptJoinGroup } from '@/network/group/acceptJoinGroup';
import { rejectJoinGroup } from '@/network/group/rejectJoinGroup';
import { MessageType, MessageStatus } from '../../../../../../shared/enums';
import ChatListStore from '@/mobx/chatlist';
import MsgStore from '@/mobx/msg';

export function useHandleReq(
  type: MessageType,
  mid: number,
  senderId: number,
  groupId?: number,
) {
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

  return {
    agree,
    refuse,
  };
}

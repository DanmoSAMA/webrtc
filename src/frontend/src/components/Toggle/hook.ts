import { IAddFriend, addFriend } from '@/network/friend/addFriend';
import { ICreateGroup, createGroup } from '@/network/group/createGroup';
import { joinGroup } from '@/network/group/joinGroup';
import { getUid } from '@/utils/uid';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { MessageType } from '../../../../shared/enums';
import { useAlert } from 'react-alert';
import { IMessageContent } from '@/types';
import { UseFormReset } from 'react-hook-form';
import ChatListStore from '@/mobx/chatlist';
import ToggleStore from '@/mobx/toggle';

export function useReqSubmit(
  reset: UseFormReset<Partial<IMessageContent & ICreateGroup & IAddFriend>>,
) {
  const alert = useAlert();

  async function onAddContactSubmit(reqData: any) {
    reqData.messageType = MessageType.FriendRequestNotify;
    reqData.receiver = parseInt(reqData.receiver, 10);
    if (reqData.receiver === getUid()) {
      alert.show('不能添加自己为好友', {
        onClose: () => {
          reset();
        },
      });
      return;
    }

    const { code } = await addFriend(reqData);

    if (code === HttpCode.USER_NOT_EXIST) {
      alert.show('用户不存在');
      return;
    } else if (code === HttpCode.REQ_HAS_EXISTED) {
      alert.show('已向对方发起过请求，请耐心等待');
      return;
    } else if (code === HttpCode.HAS_BEEN_FRIEND) {
      alert.show('你们已经是好友了');
      return;
    }

    alert.show('已发送添加好友请求', {
      onClose: async () => {
        ToggleStore.setShowToggle(false);
        reset();
      },
    });
  }

  async function onJoinGroupSubmit(reqData: any) {
    reqData.messageType = MessageType.JoinGroupRequestNotify;
    reqData.receiver = parseInt(reqData.receiver, 10); // gid

    const { code } = await joinGroup(reqData);

    if (code === HttpCode.GROUP_NOT_EXIST) {
      alert.show('该群不存在');
      return;
    } else if (code === HttpCode.REQ_HAS_EXISTED) {
      alert.show('已发起过入群请求，请耐心等待');
      return;
    } else if (code === HttpCode.HAS_JOINED_GROUP) {
      alert.show('您已经是该群的成员');
      return;
    }

    alert.show('已发送入群申请', {
      onClose: async () => {
        ToggleStore.setShowToggle(false);
        reset();
      },
    });
  }

  async function onCreateGroupSubmit(reqData: any) {
    const { code } = await createGroup(reqData);

    switch (code) {
      case HttpCode.GROUP_HAS_EXISTED:
        alert.show('该群名称已存在', {
          title: '创建群失败',
          onClose: () => {
            reset();
          },
        });
        return;
    }

    alert.show('创建群聊成功', {
      onClose: async () => {
        await ChatListStore.updateGroup();
        ToggleStore.setShowToggle(false);
        reset();
      },
    });
  }

  return {
    onAddContactSubmit,
    onJoinGroupSubmit,
    onCreateGroupSubmit,
  };
}

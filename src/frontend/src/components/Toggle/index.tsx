/**
 * description: 弹窗组件
 * date: 2024-02-14 23:14:43 +0800
 */

import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useState, useEffect } from 'react';
import { ToggleType, MessageType, AddType, NotifyType } from '@/enums';
import { IMessageContent } from '@/types';
import { ICreateGroup, createGroup } from '@/network/group/createGroup';
import { IAddFriend, addFriend } from '@/network/friend/addFriend';
import { socket } from '@/App';
import { getUid } from '@/utils/uid';
import { joinGroup } from '@/network/group/joinGroup';
import { HttpCode } from '../../../../shared/consts/httpCode';
import ToggleStore from '@/mobx/toggle';
import ChatListStore from '@/mobx/chatlist';
import MsgStore from '@/mobx/msg';
import AuthorityStore from '@/mobx/authority';
import NotifyItem from './components/NotifyItem';
import SvgIcon from '../SvgIcon';
import './index.scss';

function _Toggle() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IMessageContent & ICreateGroup & IAddFriend>>();

  const alert = useAlert();
  // 添加好友/群
  const [addType, setAddType] = useState<AddType>(AddType.Friend);
  // 好友请求/群通知
  const [notifyType, setNotifyType] = useState<NotifyType>(
    NotifyType.friendRequest,
  );

  const sortedGroupMsgs = [
    ...MsgStore.groupNotify,
    ...MsgStore.setAdminNotify,
    ...MsgStore.cancelAdminNotify,
    ...MsgStore.planeTicketNotify,
    ...MsgStore.quitGroupNotify,
  ].sort((msg1: any, msg2: any) => msg1.sendTime - msg2.sendTime);

  useEffect(() => {
    socket.on('add friend received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on('accept friend received', (uid) => {
      if (uid === getUid()) {
        ChatListStore.updateFriend();
      }
    });

    socket.on('join group received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on(
      'accept join group received',
      async ({ operatorUid, gid, applicantUid }) => {
        const isAdmin = await AuthorityStore.isAdministrator(gid);
        const isOwner = await AuthorityStore.isOwner(gid);
        const uid = getUid();

        if (applicantUid === uid) {
          ChatListStore.updateGroup();
        } else if (operatorUid !== uid && (isAdmin || isOwner)) {
          MsgStore.initMsg();
        }
      },
    );

    socket.on('set group admin received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on('cancel group admin received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on('give plane ticket received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on('quit group received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on('delete friend received', () => {
      ChatListStore.updateFriend();
    });
  }, []);

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
    reqData.messageType = MessageType.JoinGroupNotify;
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

  return (
    <div
      className='c-toggle'
      style={{ display: ToggleStore.showToggle ? 'block' : 'none' }}
    >
      <SvgIcon
        name='cross'
        style={{
          width: '30px',
          height: '30px',
          float: 'right',
          cursor: 'pointer',

          '&:hover': {
            color: 'var(--global-font-primary)',
          },
        }}
        onClick={() => {
          ToggleStore.setShowToggle(false);
        }}
      />
      {ToggleStore.toggleType === ToggleType.AddContact && (
        <>
          <div className='c-toggle-tab'>
            <div
              className={
                addType === AddType.Friend
                  ? 'c-toggle-tab-item selected'
                  : 'c-toggle-tab-item'
              }
              onClick={() => {
                setAddType(AddType.Friend);
                reset();
              }}
            >
              添加好友
            </div>
            <div
              className={
                addType === AddType.Group
                  ? 'c-toggle-tab-item selected'
                  : 'c-toggle-tab-item'
              }
              onClick={() => {
                setAddType(AddType.Group);
                reset();
              }}
            >
              添加群
            </div>
          </div>
          <form
            className='c-toggle-form'
            onSubmit={handleSubmit(
              addType === AddType.Friend
                ? onAddContactSubmit
                : onJoinGroupSubmit,
            )}
          >
            <input
              type='text'
              placeholder={addType === AddType.Friend ? 'uid' : 'gid'}
              className='c-toggle-form-input'
              {...register('receiver', { required: true, pattern: /^[0-9]+$/ })}
            />
            {errors.receiver?.type === 'required' &&
              addType === AddType.Friend && (
                <span className='entrance-window-form-hint'>uid 不能为空</span>
              )}
            {errors.receiver?.type === 'required' &&
              addType === AddType.Group && (
                <span className='entrance-window-form-hint'>gid 不能为空</span>
              )}
            <input
              type='text'
              placeholder='备注信息'
              className='c-toggle-form-input'
              {...register('messageContent', {
                required: true,
              })}
            />
            {errors.messageContent?.type === 'required' && (
              <span className='entrance-window-form-hint'>
                备注信息不能为空
              </span>
            )}
            <button className='c-toggle-form-btn'>发送请求</button>
          </form>
        </>
      )}
      {ToggleStore.toggleType === ToggleType.CreateGroup && (
        <>
          <h1 className='c-toggle-title'>创建群聊</h1>
          <form
            className='c-toggle-form'
            onSubmit={handleSubmit(onCreateGroupSubmit)}
          >
            <input
              type='text'
              placeholder='群名称'
              className='c-toggle-form-input'
              {...register('name', { required: true })}
            />
            {errors.name?.type === 'required' && (
              <span className='c-toggle-form-hint'>群名称不能为空</span>
            )}
            <button className='c-toggle-form-btn'>创建</button>
          </form>
        </>
      )}
      {ToggleStore.toggleType === ToggleType.Notify && (
        <>
          <div className='c-toggle-tab'>
            <div
              className={
                notifyType === NotifyType.friendRequest
                  ? 'c-toggle-tab-item selected'
                  : 'c-toggle-tab-item'
              }
              onClick={() => {
                setNotifyType(NotifyType.friendRequest);
              }}
            >
              好友请求
            </div>
            <div
              className={
                notifyType === NotifyType.groupManageNotify
                  ? 'c-toggle-tab-item selected'
                  : 'c-toggle-tab-item'
              }
              onClick={() => {
                setNotifyType(NotifyType.groupManageNotify);
              }}
            >
              群通知
            </div>
          </div>
          {notifyType === NotifyType.friendRequest &&
            MsgStore.friendRequest.map((msg: any) => (
              <NotifyItem
                senderId={msg.senderId}
                info={msg.messageContent}
                mid={msg.messageId}
                key={msg.messageId}
                type={msg.messageType}
                status={msg.status}
              />
            ))}
          {notifyType === NotifyType.groupManageNotify &&
            sortedGroupMsgs.map((msg: any) => (
              <NotifyItem
                senderId={msg.senderId}
                groupId={msg.groupId}
                info={msg.messageContent}
                mid={msg.messageId}
                key={msg.messageId}
                type={msg.messageType}
                status={msg.status}
              />
            ))}
        </>
      )}
    </div>
  );
}

const Toggle = observer(_Toggle);

export default Toggle;

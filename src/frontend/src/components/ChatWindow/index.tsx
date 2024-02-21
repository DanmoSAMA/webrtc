import { observer } from 'mobx-react-lite';
import { ChatType } from '@/enums';
import { getUid } from '@/utils/uid';
import { useEffect } from 'react';
import { socket } from '@/App';
import { readMsg } from '@/network/message/readMsg';
import { asReceiver, asSender, isSingleChat, isThisGroup } from '@/utils/chat';
import MsgStore from '@/mobx/msg';
import ChatStore from '@/mobx/chat';
import Emitter from '@/utils/eventEmitter';
import Bubble from './components/Bubble';
import Sender from './components/Sender';
import './index.scss';

function _ChatWindow() {
  const uid = getUid();

  // 处理消息已读
  function handleMsgRead() {
    const renderedMsg = isSingleChat()
      ? MsgStore.friendMsg.filter(
          ({ senderId, receiverId }) =>
            asReceiver(senderId) || asSender(senderId, receiverId),
        )
      : MsgStore.groupMsg.filter(
          ({ groupId }) => groupId === ChatStore.currentChat?.gid,
        );

    setTimeout(() => {
      // 气泡 Dom 数组
      const bubbleDomArr = [
        ...document.querySelectorAll('.c-chat_window-chat_area-bubble_wrapper'),
      ];
      // key: DOM 值: message
      const bubbleMap = {};

      bubbleDomArr.forEach((item, i) => {
        bubbleMap[item.id] = renderedMsg[i];
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            const msg = bubbleMap[item.target.id];
            const { senderId, messageId, readUids } = msg;

            if (asReceiver(senderId) && !readUids.includes(`${uid}`)) {
              readMsg({ mid: messageId }).then(() => {
                io.unobserve(item.target);
              });
            }
          }
        });
      });
      bubbleDomArr.forEach((item) => io.observe(item));
    }, 0);
  }

  useEffect(() => {
    Emitter.emit('scrollToBottom');

    handleMsgRead();
  }, [ChatStore.currentChat]);

  useEffect(() => {
    Emitter.on('updateIntersect', handleMsgRead);

    return () => {
      Emitter.removeListener('updateIntersect');
    };
  }, []);

  useEffect(() => {
    socket.on('send message received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });

    socket.on('read message received', (msg) => {
      if (msg.senderId === getUid()) {
        MsgStore.setFriendMsgRead(msg.receiverId, msg.messageId);
      }
    });

    socket.on('send group message received', (msg) => {
      MsgStore.handleMsg(msg.messageType, msg);
    });
  }, []);

  return (
    <div className='c-chat_window'>
      <div className='c-chat_window-chat_area'>
        {isSingleChat() &&
          MsgStore.friendMsg.map(
            ({
              sendTime,
              readUids,
              messageContent,
              messageId,
              senderId,
              receiverId,
            }) =>
              (asReceiver(senderId) || asSender(senderId, receiverId)) && (
                <Bubble
                  key={messageId}
                  sendTime={sendTime}
                  readUids={readUids}
                  messageContent={messageContent}
                  senderId={senderId}
                  receiverId={receiverId}
                  chatType={ChatType.Private}
                />
              ),
          )}
        {!isSingleChat() &&
          MsgStore.groupMsg.map(
            ({
              sendTime,
              readUids,
              messageContent,
              messageId,
              groupId,
              senderId,
              avatarUrl,
              sender,
            }) =>
              isThisGroup(groupId) && (
                <Bubble
                  key={messageId}
                  sendTime={sendTime}
                  readUids={readUids}
                  messageContent={messageContent}
                  senderId={senderId}
                  groupId={groupId}
                  chatType={ChatType.Group}
                  avatarUrl={avatarUrl}
                  name={sender?.name}
                />
              ),
          )}
      </div>
      <Sender />
    </div>
  );
}

const ChatWindow = observer(_ChatWindow);

export default ChatWindow;

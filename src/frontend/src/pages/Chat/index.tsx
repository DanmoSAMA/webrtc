import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ChatType, Theme } from '@/enums';
import { acceptCall } from '@/network/webrtc/acceptCall';
import { receiveSendFileReq } from '@/network/webrtc/receiveSendFile';
import { rejectCall } from '@/network/webrtc/rejectCall';
import { getPathname } from '@/utils/url';
import { FileTransfer } from '@/webrtc/file';
import { SingleVideoCall } from '@/webrtc/single';
import { socket } from '@/App';
import { getUserInfo } from '@/network/user/getUserInfo';
import { acceptShareDesktop } from '@/network/webrtc/acceptShareDesktop';
import { rejectShareDesktop } from '@/network/webrtc/rejectShareDesktop';
import { getToken } from '@/utils/token';
import { useAlert } from 'react-alert';
import { DesktopShare } from '@/webrtc/desktop';
import Header from '@/components/Header';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import UserInfo from '@/components/UserInfo';
import Toggle from '@/components/Toggle';
import ThemeStore from '@/mobx/theme';
import ChatListStore from '@/mobx/chatlist';
import ChatStore from '@/mobx/chat';
import MultiMedia from '@/components/MultiMedia';
import MsgStore from '@/mobx/msg';
import MultiMediaStore, { MultiMediaType } from '@/mobx/multiMedia';
import UserStore from '@/mobx/user';
import Emitter from '@/utils/eventEmitter';
import './index.scss';

function _Chat() {
  const _location = useLocation();
  const { pathname } = _location;
  const alert = useAlert();

  async function fetchUserInfo() {
    const { data } = await getUserInfo();
    const { uid, name, avatarUrl } = data.user;
    UserStore.setUserInfo({ uid, name, avatarUrl });
  }

  function scrollToBottom() {
    const ChatWindowDom = document.querySelector(
      '.c-chat_window-chat_area',
    ) as Element;
    ChatWindowDom.scrollTo(0, ChatWindowDom.scrollHeight);
  }

  useEffect(() => {
    if (pathname === '/home') {
      ChatListStore.setChatType(ChatType.Message);
    } else if (pathname === '/private') {
      ChatListStore.setChatType(ChatType.Private);
    } else if (pathname === '/group') {
      ChatListStore.setChatType(ChatType.Group);
    }
  }, [pathname]);

  useEffect(() => {
    Emitter.on('scrollToBottom', scrollToBottom);
    return () => {
      Emitter.removeListener('reconnect');
      Emitter.removeListener('scrollToBottom');
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      socket.emit('logout request', { token: getToken() }, () => {
        console.log('已离线');
      });
    });
  }, []);

  useEffect(() => {
    const pathname = getPathname(window.location.href);

    socket.on('call received', (sender) => {
      if (pathname !== 'login' && pathname !== 'register') {
        const checked = confirm(`收到用户 ${sender.name} 的语音通话请求`);

        if (checked) {
          MultiMediaStore.initMultiMedia(
            false,
            sender,
            MultiMediaStore.isAudioOpen,
            MultiMediaStore.isVideoOpen,
          );
          const svc = new SingleVideoCall(MultiMediaStore.stream);
          MultiMediaStore.svc = svc;
          svc.handleReceiverSide(sender.uid);
          acceptCall({ uid: sender.uid });
        } else {
          rejectCall({ uid: sender.uid });
        }
      }
    });

    socket.on('share desktop received', async (sender) => {
      if (pathname !== 'login' && pathname !== 'register') {
        const checked = confirm(`收到用户 ${sender.name} 的桌面共享请求`);

        if (checked) {
          MultiMediaStore.initMultiMedia(
            false,
            sender,
            MultiMediaStore.isAudioOpen,
            MultiMediaStore.isVideoOpen,
          );
          MultiMediaStore.type = MultiMediaType.ShareDesktop;
          const ds = new DesktopShare();
          MultiMediaStore.ds = ds;
          ds.handleReceiverSide(sender.uid);

          acceptShareDesktop({ uid: sender.uid });
        } else {
          rejectShareDesktop({ uid: sender.uid });
        }
      }
    });

    socket.on('reject share desktop received', () => {
      ChatStore.setIsMultiMedia(false);
      alert.show('对方拒绝了你的屏幕共享请求', {
        onClose: () => {
          location.reload();
        },
      });
    });

    socket.on('accept share desktop received', async () => {
      const ds = new DesktopShare(MultiMediaStore.displayStream);
      MultiMediaStore.ds = ds;
      ds.handleSenderSide();
    });

    socket.on('terminate desktop share received ', () => {
      MultiMediaStore.ds.stopConnection();

      alert.show('对方已结束通话', {
        onClose: () => {
          location.reload();
        },
      });
    });
  }, []);

  useEffect(() => {
    MsgStore.initMsg();
    fetchUserInfo();
    MultiMediaStore.setStream();
  }, []);

  useEffect(() => {
    socket.on('send file received', (sender, fileName) => {
      const checked = confirm(
        `${sender.name}(${sender.uid}) 正在向给您传输文件 ${fileName}，是否接收？`,
      );

      if (checked) {
        const ft = new FileTransfer();
        ft.handleReceiverSide(sender.uid);
        receiveSendFileReq({ uid: sender.uid });
      }
    });

    socket.on('receive send file received', (sender) => {
      const ft = new FileTransfer();
      ft.handleSenderSide(MultiMediaStore.file as File);
    });
  }, []);

  return (
    <div className={ThemeStore.theme === Theme.Dark ? 'chat dark' : 'chat'}>
      <Header />
      <div className='chat-main'>
        <ChatList />
        {!ChatStore.isMultiMedia && <ChatWindow />}
        {ChatStore.isMultiMedia && <MultiMedia />}
        <UserInfo />
      </div>
      <Toggle />
    </div>
  );
}

const Chat = observer(_Chat);

export default Chat;

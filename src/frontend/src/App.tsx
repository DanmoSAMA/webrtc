import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { configure } from 'mobx';
import { positions, Provider } from 'react-alert';
import { router } from '@/routes';
import { BackendHost } from '@/consts';
import { getToken } from '@/utils/token';
import { getUserInfo } from '@/network/user/getUserInfo';
import { getPathname } from './utils/url';
import { handleReceiverSide } from './webrtc/receiver';
import { rejectCall } from './network/webrtc/rejectCall';
import io, { Socket } from 'socket.io-client';
import Emitter from '@/utils/eventEmitter';
import MsgStore from '@/mobx/msg';
import AlertMUITemplate from 'react-alert-template-mui';
import UserStore from '@/mobx/user';
import MultiMediaStore from '@/mobx/multiMedia';
import './App.scss';

configure({
  enforceActions: 'never',
});

const options = {
  timeout: 3000,
  position: positions.BOTTOM_CENTER,
  transition: 'fade',
};

export const socket: Socket = io(BackendHost, {
  query: {
    token: getToken(),
  },
});

function scrollToBottom() {
  const ChatWindowDom = document.querySelector(
    '.c-chat_window-chat_area',
  ) as Element;
  ChatWindowDom.scrollTo(0, ChatWindowDom.scrollHeight);
}

function App() {
  async function fetchUserInfo() {
    const { data } = await getUserInfo();
    const { uid, name, avatarUrl } = data.user;
    UserStore.setUserInfo({ uid, name, avatarUrl });
  }

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
          MultiMediaStore.initMultiMedia(false, sender);
          handleReceiverSide(sender.uid);
        } else {
          rejectCall({ uid: sender.uid });
        }
      }
    });
  }, []);

  useEffect(() => {
    MsgStore.initMsg();

    fetchUserInfo();
  }, []);

  return (
    <Provider template={AlertMUITemplate} {...options}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

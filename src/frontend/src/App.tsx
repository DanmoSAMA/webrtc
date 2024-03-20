import { RouterProvider } from 'react-router-dom';
import { configure } from 'mobx';
import { positions, Provider } from 'react-alert';
import { router } from '@/routes';
import { BackendHost } from '@/consts';
import { getToken } from '@/utils/token';
import io, { Socket } from 'socket.io-client';
import AlertMUITemplate from 'react-alert-template-mui';
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

function App() {
  return (
    <Provider template={AlertMUITemplate} {...options}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

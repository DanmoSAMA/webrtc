import { createBrowserRouter, Navigate } from 'react-router-dom';
import Chat from '@/pages/Chat';
import Login from '@/pages/Login';

export const router: any = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/private' replace />,
  },
  {
    path: '/private',
    element: <Chat />,
  },
  {
    path: '/group',
    element: <Chat />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Login />,
  },
]);

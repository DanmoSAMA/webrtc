/**
 * description: 退出登陆
 * date: 2024-02-20 13:57:06 +0800
 */

import { socket } from '@/App';
import { clearToken, getToken } from '@/utils/token';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function logout(): any {
  return new Promise((resolve) => {
    socket.emit(
      'logout request',
      {
        token: getToken(),
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
        clearToken();
        location.reload();
      },
    );
  });
}

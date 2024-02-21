import { Socket } from 'socket.io';
import { uidSet } from '..';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onLogout(io: any, socket: Socket) {
  socket.on('logout request', ({ token }, callback) => {
    let uid;

    if (isTokenValid(token)) {
      uid = decodeToken(token);
      uidSet.add(uid);
    } else {
      callback(HttpCode.INVALID_TOKEN);
      return;
    }

    uidSet.delete(uid);
    io.emit('logout received');
    callback(HttpCode.OK);
  });
}

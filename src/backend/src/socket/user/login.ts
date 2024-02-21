import { Socket } from 'socket.io';
import { uidSet } from '..';

export function onLogin(io: any, socket: Socket) {
  socket.on('login', ({ uid }) => {
    uidSet.add(uid);
    io.emit('login received');
  });
}

/**
 * description: socket
 * date: 2024-02-12 15:24:01 +0800
 */

import { decodeToken } from '@utils/jwt';
import { Server, Socket } from 'socket.io';
import { isTokenValid } from '../utils/jwt';
import { onAddFriend } from './friend/addFriend';
import { onAcceptFriend } from './friend/acceptFriend';
import { onSendMsg } from './friend/sendMsg';
import { onReadMsg } from './friend/readMsg';
import { onJoinGroup } from './group/joinGroup';
import { onAcceptJoinGroup } from './group/acceptJoingroup';
import { onSendGroupMsg } from './group/sendGroupMsg';
import { onSetAdmin } from './group/setAdmin';
import { onCancelAdmin } from './group/cancelAdmin';
import { onGivePlaneTicket } from './group/givePlaneTicket';
import { onQuitGroup } from './group/quitGroup';
import { onDeleteFriend } from './friend/deleteFriend';
import { onLogin } from './user/login';
import { onLogout } from './user/logout';

export const uidSet = new Set(); // 保存在线用户 uid 的集合

export function checkOnline(uid: any) {
  return uidSet.has(uid);
}

export default function setupSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket: Socket) => {
    const token = socket.handshake.query.token as string;
    if (isTokenValid(token)) {
      const uid = decodeToken(token);
      uidSet.add(uid);
      io.emit('login received');
    }

    onLogin(io, socket);

    onLogout(io, socket);

    onAddFriend(io, socket);

    onDeleteFriend(io, socket);

    onAcceptFriend(io, socket);

    onSendMsg(io, socket);

    onReadMsg(io, socket);

    onJoinGroup(io, socket);

    onAcceptJoinGroup(io, socket);

    onSendGroupMsg(io, socket);

    onSetAdmin(io, socket);

    onCancelAdmin(io, socket);

    onGivePlaneTicket(io, socket);

    onQuitGroup(io, socket);
  });
}

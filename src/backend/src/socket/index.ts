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
import { onSdpOffer } from './webrtc/sdpOffer';
import { onSdpAnswer } from './webrtc/sdpAnswer';
import { onIceCandidate } from './webrtc/iceCandidate';
import { onCall } from './friend/call';
import { onTerminateCall } from './friend/terminateCall';
import { onRejectCall } from './friend/rejectCall';
import { onSwitchToSender } from './webrtc/switchToSender';
import { onStartGroupVideo } from './group/startGroupVideo';
import { onLeaveGroupVideo } from './group/leaveGroupVideo';
import { onJoinGroupVideo } from './group/joinGroupVideo';
import { onAcceptCall } from './friend/acceptCall';
import { onSwitchToReceiver } from './webrtc/switchToReceiver';
import { onReconnect } from './group/reconnect';
import { onSendFile } from './friend/sendFile';
import { onReceiveSendFile } from './friend/receiveSendFile';
import { onShareDesktop } from './friend/shareDesktop';
import { onAcceptShareDesktop } from './friend/acceptShareDesktop';
import { onRejectShareDesktop } from './friend/rejectShareDesktop';
import { onTerminateDesktopShare } from './friend/terminateDesktopShare';

export const uidSet = new Set(); // 保存在线用户 uid 的集合

export function checkOnline(uid: any) {
  return uidSet.has(uid);
}

export const socketIdMap = new Map();

// [{ gid: 100001, memberList: [{ uid: 100001, name: '' }] }]
export const groupVideoChatRooms = [];

export default function setupSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: 'https://localhost:5173',
    },
  });

  io.on('connection', (socket: Socket) => {
    const token = socket.handshake.query.token as string;

    if (isTokenValid(token)) {
      const uid = decodeToken(token);
      uidSet.add(uid);
      socketIdMap.set(uid, socket.id);
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

    onCall(io, socket);

    onSdpOffer(io, socket);

    onSdpAnswer(io, socket);

    onIceCandidate(io, socket);

    onTerminateCall(io, socket);

    onRejectCall(io, socket);

    onAcceptCall(io, socket);

    onSwitchToSender(io, socket);

    onSwitchToReceiver(io, socket);

    onStartGroupVideo(io, socket);

    onLeaveGroupVideo(io, socket);

    onJoinGroupVideo(io, socket);

    onReconnect(io, socket);

    onSendFile(io, socket);

    onReceiveSendFile(io, socket);

    onShareDesktop(io, socket);

    onAcceptShareDesktop(io, socket);

    onRejectShareDesktop(io, socket);

    onTerminateDesktopShare(io, socket);
  });
}

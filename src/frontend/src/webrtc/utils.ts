import { terminateCall } from '@/network/webrtc/terminateCall';
import ChatStore from '@/mobx/chat';

export function stopConnection(pc: RTCPeerConnection, isSender = true) {
  pc.getSenders().forEach((sender) => {
    pc.removeTrack(sender);
  });

  pc.close();

  ChatStore.setIsMultiMedia(false);

  // 向对方发送终止通话的通知（使用你自己的信令方式）
  if (isSender) {
    terminateCall({ uid: ChatStore.currentChat?.uid });
  }
}

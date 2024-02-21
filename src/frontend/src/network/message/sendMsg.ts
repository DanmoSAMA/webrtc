/**
 * description: 发送消息(单聊)
 * date: 2022-11-04 17:03:07 +0800
 */

import { MessageType } from '@/enums';
import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ISendMsg {
  receiver: number;
  messageContent: string;
  messageType: MessageType;
}

export function sendMsg(reqData: ISendMsg): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'send message request',
      {
        senderToken: getToken(),
        receiverUid: reqData.receiver,
        content: reqData.messageContent,
        type: reqData.messageType,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

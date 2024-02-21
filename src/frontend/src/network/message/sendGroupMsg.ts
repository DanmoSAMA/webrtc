/**
 * description: 发送消息(群聊)
 * date: 2022-11-04 17:03:07 +0800
 */

import { MessageType } from '@/enums';
import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ISendGroupMsg {
  receiver: number;
  messageContent: string;
  messageType: MessageType;
}

export function sendGroupMsg(reqData: ISendGroupMsg): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'send group message request',
      {
        senderToken: getToken(),
        gid: reqData.receiver,
        content: reqData.messageContent,
        type: reqData.messageType,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

/**
 * description: 申请加群
 * date: 2022-11-01 19:51:42 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IJoinGroup {
  receiver: string;
  messageContent: string;
}

export function joinGroup(reqData: IJoinGroup): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'join group request',
      {
        senderToken: getToken(),
        gid: reqData.receiver,
        content: reqData.messageContent,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

/**
 * description: 发送文件
 * date: 2024-03-13 22:42:04 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface ISendFile {
  uid: any;
}

export function sendFileReq(reqData: ISendFile): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'send file request',
      {
        senderToken: getToken(),
        receiverUid: reqData.uid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

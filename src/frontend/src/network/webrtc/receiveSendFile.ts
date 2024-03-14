/**
 * description: 收到发送文件请求
 * date: 2024-03-13 22:42:04 +0800
 */

import { getToken } from '@/utils/token';
import { socket } from '../../App';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IReceiveSendFile {
  uid: any;
}

export function receiveSendFileReq(reqData: IReceiveSendFile): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'receive send file request',
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

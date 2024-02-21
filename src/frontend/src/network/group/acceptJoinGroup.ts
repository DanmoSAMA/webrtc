/**
 * description: 同意加群
 * date: 2024-02-16 10:54:24 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import { HttpCode } from '../../../../shared/consts/httpCode';

export interface IAcceptJoinGroup {
  applicantUid: number; // 申请者uid
  mid: number;
  gid: number;
}

export async function acceptJoinGroup(reqData: IAcceptJoinGroup): Promise<any> {
  return new Promise((resolve) => {
    socket.emit(
      'accept join group request',
      {
        senderToken: getToken(),
        applicantUid: reqData.applicantUid,
        gid: reqData.gid,
        mid: reqData.mid,
      },
      (code: HttpCode) => {
        resolve({ code, data: null });
      },
    );
  });
}

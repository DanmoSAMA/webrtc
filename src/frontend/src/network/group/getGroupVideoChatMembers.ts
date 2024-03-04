/**
 * description: 获取当前群语音成员列表
 * date: 2024-03-03 13:19:43 +0800
 */

import request from '../request';

export interface IGetGroupVideoChatMembers {
  gid: any;
}

export async function getGroupVideoChatMembers(
  reqData: IGetGroupVideoChatMembers,
): Promise<any> {
  const url = '/api/group/video_chat_members';
  const { code, data } = await request(
    url,
    { method: 'POST', useToken: true },
    reqData,
  );
  return { code, data };
}

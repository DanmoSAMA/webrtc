import request from '../request';

export interface IRejectFriend {
  mid: number;
}

export async function rejectFriend(reqData: IRejectFriend): Promise<any> {
  const url = '/api/friend/reject';
  const { code, data } = await request(
    url,
    { method: 'POST', useToken: true },
    reqData,
  );
  return { code, data };
}

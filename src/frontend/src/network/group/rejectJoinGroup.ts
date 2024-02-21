import request from '../request';

export interface IRejectJoinGroup {
  mid: number;
}

export async function rejectJoinGroup(reqData: IRejectJoinGroup): Promise<any> {
  const url = '/api/group/reject';
  const { code, data } = await request(
    url,
    { method: 'POST', useToken: true },
    reqData,
  );
  return { code, data };
}

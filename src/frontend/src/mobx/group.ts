/**
 * description: 群聊
 * date: 2024-02-16 13:41:52 +0800
 */

import { getGroupInfo } from '@/network/group/getGroupInfo';
import { makeAutoObservable } from 'mobx';

class GroupState {
  public gid = 0;
  public name = '';
  public members = [];
  public admins = [];
  public owner: any = null;

  public constructor() {
    makeAutoObservable(this);
  }

  /**
   * 设置用户权限等级
   * @param val 要设置的值
   * @returns void
   */
  public async init(gid: any) {
    const {
      data: { owner, admins, members, name },
    } = await getGroupInfo({ gid });

    this.gid = gid;
    this.name = name;
    this.owner = owner;
    this.admins = admins;
    this.members = members;
  }
}

const GroupStore = new GroupState();

export default GroupStore;

/**
 * description: 权限
 * date: 2024-02-15 09:28:01 +0800
 */

import { AuthorityLevel } from '@/enums';
import { getIdentity } from '@/network/group/getIdentity';
import { makeAutoObservable } from 'mobx';

class AuthorityState {
  public identity = AuthorityLevel.Member;

  public constructor() {
    makeAutoObservable(this);
  }

  /**
   * 设置用户权限等级
   * @param val 要设置的值
   * @returns void
   */
  public setIdentity(val: AuthorityLevel) {
    this.identity = val;
  }

  /**
   * 判断是否为管理员
   * @param gid 群号
   * @returns boolean
   */
  public async isAdministrator(gid: any) {
    const { data } = await getIdentity({ gid });
    return data.identity === AuthorityLevel.Administrator;
  }

  /**
   * 判断是否为群主
   * @param gid 群号
   * @returns boolean
   */
  public async isOwner(gid: any) {
    const { data } = await getIdentity({ gid });
    return data.identity === AuthorityLevel.Owner;
  }
}

const AuthorityStore = new AuthorityState();

export default AuthorityStore;

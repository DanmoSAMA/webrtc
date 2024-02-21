/**
 * description: jwt相关的工具函数
 * date: 2024-02-12 09:47:58 +0800
 */

import { SECRET_KEY } from '@consts/index';
import * as jwt from 'jsonwebtoken';

// 解析 uid
export function decodeToken(token: string) {
  const decodedToken = jwt.verify(token, SECRET_KEY);

  if (!isTokenValid(token)) {
    return new Error('Token 已过期');
  }

  return decodedToken.uid;
}

export function isTokenValid(token: string) {
  if (!token || token === 'null') {
    return false;
  }
  try {
    jwt.verify(token, SECRET_KEY); // verify 已经检查过 token 是否过期

    // if (decodedToken.exp < Date.now() / 1000) {
    //   return false;
    // }

    return true;
  } catch {
    return false;
  }
}

/**
 * description: 封装 fetch
 * 1. 自动带上 token
 * 2. token 过期，实现重定向
 * date: 2022-10-31 22:27:09 +0800
 */

import { getToken } from '@/utils/token';
import { HttpCode } from '../../../shared/consts/httpCode';
import { getPathname } from '@/utils/url';

interface IOptions {
  method: 'GET' | 'POST';
  useToken: boolean;
}

export default async function request(
  url: string,
  options: IOptions,
  reqData?: any,
): Promise<any> {
  const { method, useToken } = options;
  const headers: any = {
    'Content-Type': 'application/json',
  };
  if (useToken) {
    headers.Authorization = getToken();
  }
  try {
    const res = await fetch(url, {
      method,
      headers,
      mode: 'cors',
      body: JSON.stringify(reqData),
    });
    const resData = await res.json();

    const { code, data } = resData;

    // token 错误或已过期
    if (code === HttpCode.INVALID_TOKEN) {
      if (getPathname(window.location.href) !== '/login') {
        window.location.href = '/login';
      }
    }
    return { code, data };
  } catch (err) {
    console.error(err);
  }
}

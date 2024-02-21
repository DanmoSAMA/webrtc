/**
 * description: url 相关函数
 * date: 2024-02-13 14:11:22 +0800
 */

export function getPathname(url: string) {
  const urlObject = new URL(url);
  return urlObject.pathname;
}

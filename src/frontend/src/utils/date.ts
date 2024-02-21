/**
 * description: 将时间戳转化为日期
 * date: 2024-02-17 11:14:12 +0800
 */

export function transformTimestamp(timestamp: string) {
  if (timestamp === '' || timestamp === undefined) {
    return '';
  }
  if (timestamp.length <= 5) {
    return timestamp;
  }
  let a = new Date(timestamp).getTime();
  const now = new Date();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const m =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let dateString = '';
  if (
    date.getFullYear() === now.getFullYear() &&
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth()
  ) {
    dateString += h + ':' + m;
  } else {
    dateString += Y + M + '-' + D + ' ' + h + ':' + m;
  }
  return dateString;
}

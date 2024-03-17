/**
 * description: 下载文件
 * date: 2024-03-17 10:10:47 +0800
 */

import { handleDownload } from '@/utils/file';
import { getToken } from '@/utils/token';

interface IDownloadFile {
  filename: string;
}

export async function downloadFile(reqData: IDownloadFile): Promise<any> {
  try {
    const url = `/api/msg/file/download/${reqData.filename}`;
    const headers: Record<string, string> = {
      Authorization: getToken() as string,
    };
    const resp = await fetch(url, { method: 'GET', mode: 'cors', headers });
    if (resp.ok) {
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      handleDownload(blobUrl, reqData.filename);
    }
  } catch (err) {
    console.log(err);
  }
}

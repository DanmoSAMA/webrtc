/**
 * description: 文件相关工具函数
 * date: 2024-03-13 21:15:19 +0800
 */

export function transformFileSize(byteSize: number) {
  if (byteSize < Math.pow(2, 10)) {
    return byteSize + 'B';
  } else if (byteSize < Math.pow(2, 20)) {
    return (byteSize / Math.pow(2, 10)).toFixed(1) + 'KB';
  } else if (byteSize < Math.pow(2, 30)) {
    return (byteSize / Math.pow(2, 20)).toFixed(1) + 'MB';
  } else if (byteSize < Math.pow(2, 40)) {
    return (byteSize / Math.pow(2, 30)).toFixed(1) + 'GB';
  }
  return (byteSize / Math.pow(2, 40)).toFixed(1) + 'TB';
}

export const chunkSize = 16384; // 16KB

// 分块发送文件
export function sendFileByChunk(dataChannel: RTCDataChannel, file: File) {
  const fileReader = new FileReader();
  let offset = 0;

  const readSlice = (o: number) => {
    const slice = file.slice(o, o + chunkSize);
    fileReader.readAsArrayBuffer(slice);
  };

  fileReader.onload = () => {
    dataChannel.send(fileReader.result as ArrayBuffer);
    offset += chunkSize;
    if (offset < file.size) {
      readSlice(offset);
    }
  };
  readSlice(0);
}

export function handleDownload(blobUrl: string, fileName: string) {
  const downloadAnchor = document.createElement('a');
  downloadAnchor.style.display = 'none';
  downloadAnchor.href = blobUrl;
  downloadAnchor.download = fileName;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();

  document.body.removeChild(downloadAnchor);
  // 结束使用某个 URL 对象之后，应该让浏览器知道，不用在内存中继续保留对这个文件的引用
  URL.revokeObjectURL(blobUrl);
}

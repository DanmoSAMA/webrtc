/**
 * description: 发送文件
 * date: 2024-03-13 22:09:32 +0800
 */

import { socket } from '@/App';
import { getToken } from '@/utils/token';
import ChatStore from '@/mobx/chat';
import { chunkSize, sendFileByChunk } from '@/utils/file';

export class FileTransfer {
  pc: RTCPeerConnection;

  constructor() {
    this.pc = new RTCPeerConnection();
  }

  handleSenderSide(file: File) {
    const dataChannel = this.pc.createDataChannel('fileTransferChannel');

    dataChannel.onopen = () => {
      console.log('dataChannel open');

      const fileMetaData = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // 发送侧 onopen 回调触发后，接收侧 ondatachannel 才触发
      // 所以设置定时器，先等那边设置回调
      setTimeout(() => {
        dataChannel.send(JSON.stringify(fileMetaData));
        sendFileByChunk(dataChannel, file);
      }, 100);
    };

    this.pc
      .createOffer()
      .then((offer) => {
        console.log('sender: setLocalDescription');
        return this.pc.setLocalDescription(offer);
      })
      .then(() => {
        console.log('sender: sdp offer');
        socket.emit(
          'sdp offer request',
          this.pc.localDescription,
          ChatStore.currentChat?.uid,
          getToken(),
        );
      })
      .catch((error) => {
        console.log('创建 SDP 失败: ', error);
      });

    this.pc.onicecandidate = function (event) {
      if (event.candidate) {
        console.log('sender: send ice candidate');
        socket.emit(
          'ice candidate request',
          event.candidate,
          ChatStore.currentChat?.uid,
        );
      } else {
        console.log('ICE Candidate collection complete.');
      }
    };

    socket.on('sdp answer received', (answer) => {
      if (this.pc.remoteDescription !== null) {
        return;
      }

      console.log('sender: get sdp answer');

      this.pc
        .setRemoteDescription(answer)
        .then(() => {
          console.log('设置远程 SDP 成功');
        })
        .catch((error) => {
          console.log('设置远程 SDP 失败: ', error);
        });
    });

    socket.on('ice candidate received', (candidate) => {
      console.log('sender: get ice candidate');

      setTimeout(() => {
        this.pc
          .addIceCandidate(candidate)
          .then(() => {
            console.log('添加 ICE 候选者成功');
          })
          .catch((error) => {
            console.log('添加 ICE 候选者失败: ', error);
          });
      }, 100);
    });

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') {
        console.log('连接已建立');
      }

      if (this.pc.connectionState === 'failed') {
        this.pc.restartIce();
      }
    };
  }

  handleReceiverSide(senderUid: any) {
    socket.on('sdp offer received', (offer) => {
      if (this.pc.remoteDescription !== null) {
        return;
      }

      console.log('receiver: get sdp offer');

      const sessionDescription = new RTCSessionDescription(offer);

      this.pc.setRemoteDescription(sessionDescription).then(() => {
        console.log('receiver: setRemoteDescription');

        this.pc
          .createAnswer()
          .then((answer) => {
            return this.pc.setLocalDescription(answer);
          })
          .then(() => {
            console.log('receiver: send sdp answer');
            socket.emit(
              'sdp answer request',
              this.pc.localDescription,
              senderUid,
            );
          })
          .catch((error) => {
            console.error('Error creating SDP Answer:', error);
          });
      });
    });

    socket.on('ice candidate received', (candidate) => {
      console.log('receiver: get ice candidate');

      setTimeout(() => {
        this.pc
          .addIceCandidate(candidate)
          .then(() => {
            console.log('添加 ICE 候选者成功');
          })
          .catch((error) => {
            console.log('添加 ICE 候选者失败: ', error);
          });
      }, 100);
    });

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') {
        console.log('连接已建立');
      }

      if (this.pc.connectionState === 'failed') {
        this.pc.restartIce();
      }
    };

    this.pc.onicecandidate = function (event) {
      if (event.candidate) {
        console.log('receiver: send ice candidate');
        socket.emit('ice candidate request', event.candidate, senderUid);
      } else {
        console.log('ICE Candidate collection complete.');
      }
    };

    this.pc.ondatachannel = (e) => {
      console.log('receiver: ondatachannel');

      const receivedBuffers: Buffer[] = [];
      let receivedSize = 0;
      let fileName = '';
      let fileSize = 0;
      let fileType = '';

      const receiveChannel = e.channel;

      receiveChannel.onmessage = (e) => {
        const data = e.data;

        if (typeof data === 'string') {
          const metaData = JSON.parse(data);
          fileName = metaData.name;
          fileSize = metaData.size;
          fileType = metaData.type;
          return;
        }

        const l = e.data.byteLength;

        receivedBuffers.push(data);
        receivedSize += l;

        if (receivedSize === fileSize) {
          const receivedBlob = new Blob(receivedBuffers, { type: fileType });
          console.log(receivedBlob, fileName, fileSize, fileType);
        } else if (receivedSize > fileSize) {
          console.error('Received more bytes than expected.');
        }
      };
    };
  }
}

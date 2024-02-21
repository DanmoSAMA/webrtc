import { connect, connection } from 'mongoose';

export function setupMongo() {
  // 创建名为 milestone 的数据库
  const DB_URL = 'mongodb://127.0.0.1:27017/webrtc';
  connect(DB_URL);

  return new Promise<void>((resolve, reject) => {
    connection.on('connected', () => {
      console.log('connected to mongodb');
      resolve();
    });
    connection.on('error', (error) => {
      console.log('failed to connect to mongodb', error);
      reject();
    });
  });
}

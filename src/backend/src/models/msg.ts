/**
 * description: 消息表
 * date: 2024-02-08 10:21:33 +0800
 */

import { model, Schema } from 'mongoose';

const msgSchema = new Schema({
  mid: {
    type: Number,
    required: true,
  },
  sender: {
    type: {
      uid: Number,
    },
    required: true,
  },
  receiver: {
    type: {
      uid: {
        type: Number,
        required: false,
      },
      gid: {
        type: Number,
        required: false,
      },
    },
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: Number,
    required: true,
  },
  status: {
    type: Number, // 状态，比如说好友申请中，未处理/同意/拒绝
    required: false,
  },
  readUids: {
    type: [String],
    required: false,
    default: [],
  },
});

const midSchema = new Schema({
  maxMid: {
    type: Number,
    required: true,
    default: 100000,
  },
});

export const MsgModel = model('Msg', msgSchema);
export const MidCounter = model('Mid', midSchema);

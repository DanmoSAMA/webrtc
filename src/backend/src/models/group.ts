/**
 * description: 群表
 * date: 2024-02-14 19:08:41 +0800
 */

import { model, Schema } from 'mongoose';

const groupSchema = new Schema({
  gid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    // type: {
    //   uid: Number,
    // },
    type: Number,
    required: true,
  },
  administrators: {
    // type: [{ uid: Number }],
    type: [Number],
    required: false,
    default: [],
  },
  members: {
    // 成员包含群主和管理员
    // type: [{ uid: Number }],
    type: [Number],
    required: false,
    default: [],
  },
  avatarUrl: {
    type: String,
    required: false,
  },
});

const gidSchema = new Schema({
  maxGid: {
    type: Number,
    required: true,
    default: 100000,
  },
});

export const GroupModel = model('Group', groupSchema);
export const GidCounter = model('Gid', gidSchema);

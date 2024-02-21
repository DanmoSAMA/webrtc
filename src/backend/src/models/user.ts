/**
 * description: 用户表
 * date: 2024-02-08 10:21:22 +0800
 */

import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  uid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
});

const uidSchema = new Schema({
  maxUid: {
    type: Number,
    required: true,
    default: 100000,
  },
});

export const UserModel = model('User', userSchema);
export const UidCounter = model('Uid', uidSchema);

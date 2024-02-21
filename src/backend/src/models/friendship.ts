/**
 * description: 好友关系表
 * date: 2024-02-13 15:08:11 +0800
 */

import { model, Schema } from 'mongoose';

const friendshipSchema = new Schema({
  uid1: {
    type: Number,
    required: true,
  },
  uid2: {
    type: Number,
    required: true,
  },
});

export const FriendshipModel = model('Friendship', friendshipSchema);

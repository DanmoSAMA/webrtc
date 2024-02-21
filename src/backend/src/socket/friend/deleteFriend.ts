import { FriendshipModel } from '@models/friendship';
import { isTokenValid, decodeToken } from '@utils/jwt';
import { Socket } from 'socket.io';
import { HttpCode } from '../../../../shared/consts/httpCode';

export function onDeleteFriend(io: any, socket: Socket) {
  socket.on('delete friend request', async ({ senderToken, uid }, callback) => {
    let senderUid = '';
    if (isTokenValid(senderToken)) {
      senderUid = decodeToken(senderToken);
    } else {
      callback(HttpCode.INVALID_TOKEN);
      return;
    }

    try {
      await FriendshipModel.deleteOne({
        $or: [
          {
            $and: [{ uid1: senderUid }, { uid2: uid }],
          },
          {
            $and: [{ uid1: uid }, { uid2: senderUid }],
          },
        ],
      });

      io.emit('delete friend received');

      callback(HttpCode.OK);
    } catch (err) {
      callback(HttpCode.DELETE_FRIEND_ERROR);
    }
  });
}

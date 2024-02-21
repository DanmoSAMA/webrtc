/**
 * description: 前后端交互自定义状态码
 * date: 2024-02-07 19:31:22 +0800
 */

export const enum HttpCode {
  OK,
  USER_HAS_EXISTED,
  USER_NOT_EXIST,
  GROUP_HAS_EXISTED,
  GROUP_NOT_EXIST,
  INCORRECT_PASSWD,
  INVALID_TOKEN,
  SEND_MSG_ERROR,
  ACCEPT_MSG_ERROR,
  REJECT_MSG_ERROR,
  READ_MSG_ERROR,
  JOIN_GROUP_ERROR,
  QUIT_GROUP_ERROR,
  SET_ADMIN_ERROR,
  CANCEL_ADMIN_ERROR,
  PLANE_TICKET_ERROR,
  REQ_HAS_EXISTED,
  HAS_BEEN_FRIEND,
  HAS_JOINED_GROUP,
  OWNER_QUIT_GROUP,
  DELETE_FRIEND_ERROR,
}
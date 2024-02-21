/**
 * description: 枚举
 * date: 2022-10-13 12:46:06 +0800
 */

// 气泡方向
export enum Direction {
  Left,
  Right,
}

// 聊天类型
export enum ChatType {
  Message,
  Private,
  Group,
}

// 主题
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

// Toggle 类型
export enum ToggleType {
  AddContact,
  CreateGroup,
  Notify,
}

// 消息类型
export enum MessageType {
  // 0 单聊消息
  SingleMessage,
  // 1 群聊消息
  GroupMessage,
  // 2 好友请求
  FriendRequestNotify,
  // 3 单聊消息消息已读通知
  HasReadSingleNotify,
  // 4 入群申请通知
  JoinGroupRequestNotify,
  // 5 退群通知
  QuitGroupNotify,
  // 6 设置管理员通知
  SetAdminNotify,
  // 7 取消管理员通知
  CancelAdminNotify,
  // 8 踢人通知
  PlaneTicketNotify,
}

export enum AddType {
  Friend,
  Group,
}

export enum NotifyType {
  friendRequest,
  groupManageNotify,
}

// 权限
export enum AuthorityLevel {
  Member,
  Administrator,
  Owner,
}

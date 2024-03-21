import { useNavigate } from 'react-router-dom';
import { MessageStatus } from '../../../../../../shared/enums';
import MsgStore from '@/mobx/msg';

export function useGoto() {
  const navigate = useNavigate();

  const gotoPrivate = () => {
    navigate('/private');
  };

  const gotoGroup = () => {
    navigate('/group');
  };

  return {
    gotoPrivate,
    gotoGroup,
  };
}

export function useMsgCount() {
  const msgCount = [...MsgStore.friendRequest, ...MsgStore.groupNotify].filter(
    (msg) => msg.status === MessageStatus.Unhandled,
  ).length;

  return {
    msgCount,
  };
}

import { givePlaneTicket } from '@/network/group/givePlaneTicket';
import { setAdmin, cancelAdmin } from '@/network/group/setAdmin';
import { HttpCode } from '../../../../../../../../shared/consts/httpCode';
import { useAlert } from 'react-alert';
import GroupStore from '@/mobx/group';

export function useGroupOperation(uid: any, gid: any) {
  const alert = useAlert();

  const handleSetAdmin = async () => {
    const { code } = await setAdmin({ uid, gid });

    if (code === HttpCode.SET_ADMIN_ERROR) {
      alert.show('操作失败');
    } else {
      alert.show('已设置管理员', {
        onClose: async () => {
          GroupStore.init(gid);
        },
      });
    }
  };

  const handleCancelAdmin = async () => {
    const { code } = await cancelAdmin({ uid, gid });

    if (code === HttpCode.SET_ADMIN_ERROR) {
      alert.show('操作失败');
    } else {
      alert.show('已取消管理员', {
        onClose: async () => {
          GroupStore.init(gid);
        },
      });
    }
  };

  const handleGivePlaneTicket = async () => {
    const { code } = await givePlaneTicket({ uid, gid });

    if (code === HttpCode.SET_ADMIN_ERROR) {
      alert.show('操作失败');
    } else {
      alert.show('已踢出群', {
        onClose: async () => {
          GroupStore.init(gid);
        },
      });
    }
  };

  return {
    handleSetAdmin,
    handleCancelAdmin,
    handleGivePlaneTicket,
  };
}

import { setToken } from '@/utils/token';
import { setUid } from '@/utils/uid';
import { sha256 } from 'js-sha256';
import { useAlert } from 'react-alert';
import { HttpCode } from '../../../../shared/consts/httpCode';
import { useNavigate } from 'react-router-dom';
import {
  IRegister,
  register as postRegisterReq,
} from '@/network/user/register';
import { UseFormReset } from 'react-hook-form';
import { ILogin, login as postLoginReq } from '@/network/user/login';

export function useLoginSubmit(
  pathname: string,
  reset: UseFormReset<ILogin & IRegister>,
) {
  const alert = useAlert();
  const navigate = useNavigate();

  const onSubmit = async (reqData: any) => {
    if (pathname === '/login') {
      reqData.password = sha256(reqData.password);
      reqData.uid = parseInt(reqData.uid, 10);
      const { code, data } = await postLoginReq(reqData);

      if (!data) {
        switch (code) {
          case HttpCode.INCORRECT_PASSWD:
            alert.show('密码错误！', {
              title: '登录失败',
            });
            break;
          case HttpCode.USER_NOT_EXIST:
            alert.show('用户不存在！', {
              title: '登录失败',
            });
            break;
        }
        return;
      }
      const { token } = data;
      // 设置 token
      setToken(token);
      // 设置 uid
      setUid(reqData.uid);
      alert.show('登录成功', {
        onClose: () => {
          navigate('/private');
        },
      });
    } else {
      const { code, data } = await postRegisterReq(reqData);
      // 注册失败
      if (!data) {
        switch (code) {
          case HttpCode.USER_HAS_EXISTED:
            alert.show('该用户已注册！', {
              title: '注册失败',
            });
            break;
        }
        return;
      }
      const { uid } = data;
      alert.show(`您的 uid 为 ${uid}，请及时保存！`, {
        timeout: 60000,
        title: '注册成功',
        onClose: () => {
          reset();
          navigate('/login');
        },
      });
    }
  };

  return { onSubmit };
}

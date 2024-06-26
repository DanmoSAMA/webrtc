/**
 * description: 登陆注册组件
 * date: 2024-02-07 21:08:01 +0800
 */

import { IRegister } from '@/network/user/register';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Theme } from '@/enums';
import { ILogin } from '@/network/user/login';
import ThemeStore from '@/mobx/theme';
import { useLoginSubmit } from './hook';
import './index.scss';

function Login() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin & IRegister>();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { onSubmit } = useLoginSubmit(pathname, reset);

  return (
    <div
      className={ThemeStore.theme === Theme.Dark ? 'entrance dark' : 'entrance'}
    >
      <div className='entrance-window'>
        <div className='entrance-window-tab'>
          <div
            className={
              pathname === '/login'
                ? 'entrance-window-tab-item selected'
                : 'entrance-window-tab-item'
            }
            onClick={() => {
              navigate('/login');
              reset();
            }}
          >
            登录
          </div>
          <div
            className={
              pathname === '/register'
                ? 'entrance-window-tab-item selected'
                : 'entrance-window-tab-item'
            }
            onClick={() => {
              navigate('/register');
              reset();
            }}
          >
            注册
          </div>
        </div>
        <form
          className='entrance-window-form'
          onSubmit={handleSubmit(onSubmit)}
        >
          {pathname === '/login' ? (
            <>
              <input
                type='text'
                placeholder='uid'
                className='entrance-window-form-input'
                {...register('uid', { required: true, pattern: /^[0-9]+$/ })}
              />
              {errors.uid?.type === 'required' && (
                <span className='entrance-window-form-hint'>uid 不能为空</span>
              )}
              {errors.uid?.type === 'pattern' && (
                <span className='entrance-window-form-hint'>
                  uid 必须为数字
                </span>
              )}
              <input
                type='password'
                placeholder='密码'
                className='entrance-window-form-input'
                {...register('password', { required: true })}
              />
              {errors.password?.type === 'required' && (
                <span className='entrance-window-form-hint'>密码不能为空</span>
              )}
              <button className='entrance-window-form-btn'>登录</button>
            </>
          ) : (
            <>
              <input
                type='text'
                placeholder='用户名'
                className='entrance-window-form-input'
                {...register('name', { required: true })}
              />
              {errors.name?.type === 'required' && (
                <span className='entrance-window-form-hint'>
                  用户名不能为空
                </span>
              )}
              <input
                type='password'
                placeholder='密码'
                className='entrance-window-form-input'
                {...register('password', { required: true })}
              />
              {errors.password?.type === 'required' && (
                <span className='entrance-window-form-hint'>密码不能为空</span>
              )}
              <button className='entrance-window-form-btn'>注册</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
export default Login;

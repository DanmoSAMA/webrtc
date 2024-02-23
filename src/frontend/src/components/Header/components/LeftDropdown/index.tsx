import { observer } from 'mobx-react-lite';
import { CSSObject } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Theme, ToggleType } from '@/enums';
import { MessageStatus } from '../../../../../../shared/enums/index';
import { logout } from '@/network/user/logout';
import MsgStore from '@/mobx/msg';
import UserStore from '@/mobx/user';
import ToggleStore from '@/mobx/toggle';
import SvgIcon from '@/components/SvgIcon';
import Switch from './components/Switch';
import ThemeStore from '@/mobx/theme';
import './index.scss';

interface LeftDropdownProps {
  showLeftDropdown: boolean;
  setShowLeftDropdown: (val: boolean) => void;
}

const iconStyle: CSSObject = {
  width: '25px',
  height: '25px',
  color: 'var(--global-font-primary_lighter)',
  verticalAlign: 'middle',
  marginRight: '20px',
};

function handleToggle(type: ToggleType) {
  ToggleStore.setShowToggle(true);
  ToggleStore.setToggleType(type);
}

function _LeftDropdown({
  showLeftDropdown,
  setShowLeftDropdown,
}: LeftDropdownProps) {
  const navigate = useNavigate();
  const msgCount = [...MsgStore.friendRequest, ...MsgStore.groupNotify].filter(
    (msg) => msg.status === MessageStatus.Unhandled,
  ).length;

  return (
    <ul
      className='c-header-left-dropdown'
      style={{ display: showLeftDropdown ? 'block' : 'none' }}
    >
      <li
        className='c-header-left-dropdown-item'
        onClick={() => {
          setShowLeftDropdown(false);
          navigate('/private');
        }}
      >
        <SvgIcon name='contact' style={iconStyle} />
        联系人
      </li>
      <li
        className='c-header-left-dropdown-item'
        onClick={() => {
          setShowLeftDropdown(false);
          navigate('/group');
        }}
      >
        <SvgIcon name='group' style={iconStyle} />
        群组
      </li>
      <li
        className='c-header-left-dropdown-item'
        onClick={() => {
          handleToggle(ToggleType.Notify);
        }}
      >
        <SvgIcon name='notice' style={iconStyle} />
        通知
        {msgCount !== 0 && (
          <div className='c-header-left-dropdown-msg_count'>{msgCount}</div>
        )}
      </li>
      <li
        className='c-header-left-dropdown-item'
        onClick={() => {
          UserStore.setShowUserInfo(!UserStore.showUserInfo);
        }}
      >
        <SvgIcon name='myself' style={iconStyle} />
        个人信息
      </li>
      <li
        className='c-header-left-dropdown-item'
        onClick={() => {
          handleToggle(ToggleType.AddContact);
        }}
      >
        <SvgIcon name='addContact' style={iconStyle} />
        添加联系人
      </li>
      <li
        className='c-header-left-dropdown-item'
        onClick={() => {
          handleToggle(ToggleType.CreateGroup);
        }}
      >
        <SvgIcon name='createGroup' style={iconStyle} />
        创建群聊
      </li>
      <li className='c-header-left-dropdown-item' id='dark_mode'>
        <SvgIcon name='moon' style={iconStyle} />
        暗黑模式
        <Switch
          checked={ThemeStore.theme === Theme.Dark}
          onChange={(e) => {
            const value = e.target.checked;
            ThemeStore.setTheme(value ? Theme.Dark : Theme.Light);
          }}
        />
      </li>
      <li className='c-header-left-dropdown-item' onClick={logout}>
        <SvgIcon name='myself' style={iconStyle} />
        退出登陆
      </li>
    </ul>
  );
}

const LeftDropdown = observer(_LeftDropdown);

export default LeftDropdown;

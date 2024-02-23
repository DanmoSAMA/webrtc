import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useShowDropDown } from './hooks/useShowDropdown';
import { useAlert } from 'react-alert';
import ChatStore from '@/mobx/chat';
import SvgIcon from '@/components/SvgIcon';
import Search from './components/Search';
import LeftDropdown from './components/LeftDropdown';
import RightDropdown from './components/RightDropdown';
import QueryDropdown from './components/QueryDropdown';
import MultiMediaStore from '@/mobx/multiMedia';
import './index.scss';
import { call } from '@/network/webrtc/call';
import { handleSenderSide } from '@/utils/webrtc';

function _Header() {
  const alert = useAlert();
  const [showLeftDropdown, setShowLeftDropdown] = useState(false);
  const {
    showDropDown: showRightDropDown,
    setShowDropDown: setShowRightDropDown,
  } = useShowDropDown();
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);

  return (
    <div className='c-header'>
      <div className='c-header-left'>
        <SvgIcon
          name='menu'
          style={{
            color: 'var(--global-font-primary_lighter)',
            width: '35px',
            height: '35px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowLeftDropdown(!showLeftDropdown);
          }}
        />
        <LeftDropdown
          showLeftDropdown={showLeftDropdown}
          setShowLeftDropdown={setShowLeftDropdown}
        />
        <Search />
      </div>
      <div className='c-header-right'>
        <div className='c-header-right-info'>
          <span className='c-header-right-info-name'>
            {ChatStore.currentChat?.name}
            <span className='c-header-right-info-name-online'>
              {ChatStore.currentChat?.online && '在线'}
            </span>
          </span>

          {ChatStore.currentChat?.count && ChatStore.currentChat?.gid && (
            <span className='c-header-right-info-num'>
              {ChatStore.currentChat?.count} members
            </span>
          )}
        </div>
        {ChatStore.currentChat && (
          <SvgIcon
            name='phone'
            style={{
              color: 'var(--global-font-primary_lighter)',
              width: '33px',
              height: '33px',
              position: 'absolute',
              right: '280px',
              cursor: 'pointer',
            }}
            onClick={() => {
              // if (ChatStore.currentChat?.uid) {
              //   if (ChatStore.currentChat?.online) {
              //     ChatStore.setIsMultiMedia(true);
              //     MultiMediaStore.setAudioOpenState(true);
              //     MultiMediaStore.setVideoOpenState(false);

              //     call({ uid: ChatStore.currentChat?.uid });
              //   } else {
              //     alert.show('对方处于离线状态，请稍后再试', {
              //       title: '操作失败 ',
              //     });
              //   }
              // }

              ChatStore.setIsMultiMedia(true);
              MultiMediaStore.setAudioOpenState(true);
              MultiMediaStore.setVideoOpenState(false);

              call({ uid: ChatStore.currentChat?.uid });
            }}
          />
        )}
        {ChatStore.currentChat && (
          <SvgIcon
            name='video'
            style={{
              color: 'var(--global-font-primary_lighter)',
              width: '30px',
              height: '30px',
              position: 'absolute',
              right: '210px',
              cursor: 'pointer',
            }}
            onClick={() => {
              // if (ChatStore.currentChat?.uid) {
              //   if (ChatStore.currentChat?.online) {
              //     ChatStore.setIsMultiMedia(true);
              //     MultiMediaStore.setAudioOpenState(true);
              //     MultiMediaStore.setVideoOpenState(true);

              //     call({ uid: ChatStore.currentChat?.uid });
              //   } else {
              //     alert.show('对方处于离线状态，请稍后再试', {
              //       title: '操作失败 ',
              //     });
              //   }
              // }

              ChatStore.setIsMultiMedia(true);
              MultiMediaStore.setAudioOpenState(true);
              MultiMediaStore.setVideoOpenState(true);

              call({ uid: ChatStore.currentChat?.uid });
            }}
          />
        )}
        {ChatStore.currentChat && (
          <SvgIcon
            name='remoteControl'
            style={{
              color: 'var(--global-font-primary_lighter)',
              width: '30px',
              height: '30px',
              position: 'absolute',
              right: '140px',
              cursor: 'pointer',
            }}
            // onClick={(e) => {}}
          />
        )}
        {ChatStore.currentChat && (
          <SvgIcon
            name='search'
            style={{
              color: 'var(--global-font-primary_lighter)',
              width: '35px',
              height: '35px',
              position: 'absolute',
              right: '70px',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              if (ChatStore.currentChat !== null) {
                e.stopPropagation();
                setShowQueryDropdown(!showQueryDropdown);
              }
            }}
          />
        )}
        {ChatStore.currentChat && (
          <SvgIcon
            name='right-menu'
            style={{
              color: 'var(--global-font-primary_lighter)',
              width: '35px',
              height: '35px',
              position: 'absolute',
              right: '20px',
              cursor: 'pointer',

              '&:hover': {
                color: 'var(--global-font-primary)',
              },
            }}
            onClick={(e) => {
              if (ChatStore.currentChat !== null) {
                e.stopPropagation();
                setShowRightDropDown(true);
              }
            }}
          />
        )}

        <QueryDropdown showDropdown={showQueryDropdown} />
        <RightDropdown showDropdown={showRightDropDown} />
      </div>
    </div>
  );
}

const Header = observer(_Header);

export default Header;

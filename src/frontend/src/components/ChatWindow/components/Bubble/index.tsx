/**
 * description: 气泡组件
 * date: 2024-02-17 11:14:33 +0800
 */

import { ChatType, ContentType } from '@/enums';
import { IMessage } from '@/types';
import { observer } from 'mobx-react-lite';
import { getUid } from '@/utils/uid';
import { transformTimestamp } from '@/utils/date';
import { asSender, isMsgRead, isSingleChat } from '@/utils/chat';
import { DefaultAvatarUrl } from '@/consts';
import SvgIcon from '@/components/SvgIcon';
import './index.scss';

function _Bubble({
  sendTime,
  readUids,
  messageContent,
  senderId,
  receiverId,
  chatType,
  avatarUrl,
  name,
  contentType,
}: Partial<IMessage> & { chatType: ChatType }) {
  const uid = getUid();

  return (
    <div
      className='c-chat_window-chat_area-bubble_wrapper'
      id={`bubble_${sendTime}_${messageContent}`}
      style={{
        alignSelf: uid !== senderId ? 'start' : 'end',
        margin: uid !== senderId ? '15px 0 15px 30px' : '15px 30px 15px 0',
        maxWidth: '50%',
        display: 'flex',
      }}
    >
      {isMsgRead(readUids) && asSender(senderId, receiverId) && (
        <SvgIcon
          name='done'
          style={{
            width: '25px',
            height: '25px',
            color: 'var(--global-font-primary_lighter)',
            alignSelf: 'end',
            marginRight: '10px',
          }}
        />
      )}
      {chatType === ChatType.Group && uid !== senderId && (
        <img
          src={avatarUrl ?? DefaultAvatarUrl}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            alignSelf: 'center',
            marginRight: '20px',
            cursor: 'pointer',
          }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!isSingleChat() && uid !== senderId && (
          <div
            style={{
              color: 'var(--global-font-primary_lighter)',
              marginBottom: 5,
            }}
          >
            {name}
          </div>
        )}
        <div
          className={
            uid === senderId
              ? 'c-chat_window-chat_area-bubble right'
              : 'c-chat_window-chat_area-bubble'
          }
        >
          <div className='c-chat_window-chat_area-bubble-content'>
            {contentType === ContentType.Text ? (
              messageContent
            ) : (
              <img src={messageContent} style={{ maxWidth: 200 }} />
            )}
          </div>
          <span className='c-chat_window-chat_area-bubble-time'>
            {transformTimestamp(sendTime as string)}
          </span>
        </div>
      </div>
    </div>
  );
}

const Bubble = observer(_Bubble);

export default Bubble;

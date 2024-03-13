import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { sendMsg } from '@/network/message/sendMsg';
import { ContentType, MessageType } from '@/enums';
import { HttpCode } from '../../../../../../shared/consts/httpCode';
import { isSingleChat } from '@/utils/chat';
import { sendGroupMsg } from '@/network/message/sendGroupMsg';
import { useShowDropDown } from '@/components/Header/hooks/useShowDropdown';
import { useState } from 'react';
import ChatStore from '@/mobx/chat';
import SvgIcon from '@/components/SvgIcon';
import Emitter from '@/utils/eventEmitter';
import './index.scss';

interface ISendMsg {
  content: string;
}

function Sender() {
  const alert = useAlert();
  const { register, reset, handleSubmit } = useForm<ISendMsg>();
  const { showDropDown, setShowDropDown } = useShowDropDown();
  const [showToggle, setShowToggle] = useState(false);
  const [file, setFile] = useState<File | null>();

  async function onSubmit({ content }: ISendMsg) {
    reset();

    if (!ChatStore.currentChat) {
      alert.show('请先选择要发送消息的对象', {
        title: '消息发送失败',
      });
    } else {
      if (isSingleChat()) {
        const { code } = await sendMsg({
          receiver: ChatStore.currentChat.uid as number,
          messageContent: content,
          messageType: MessageType.SingleMessage,
        });

        if (code === HttpCode.SEND_MSG_ERROR) {
          alert.show('发生了未知的错误', {
            title: '消息发送失败',
          });
          return;
        }
      } else {
        const { code } = await sendGroupMsg({
          receiver: ChatStore.currentChat.gid as number,
          messageContent: content,
          messageType: MessageType.GroupMessage,
        });

        if (code === HttpCode.SEND_MSG_ERROR) {
          alert.show('发生了未知的错误', {
            title: '消息发送失败',
          });
          return;
        }
      }

      Emitter.emit('scrollToBottom');
    }
  }

  async function onUploadImage(e: any) {
    setShowToggle(true);
    const file = e.target.files[0];
    setTimeout(() => {
      const selectedImage: any = document.querySelector('#selectedImage');
      const reader = new FileReader();

      reader.onload = (e) => {
        selectedImage.src = e.target!.result;
      };

      reader.readAsDataURL(file);
      setFile(file);
    });
  }

  async function sendImg() {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        const fileArrayBuffer = e.target!.result;

        const { code } = await sendMsg({
          receiver: ChatStore.currentChat?.uid as number,
          messageContent: {
            file: fileArrayBuffer,
            filename: file.name,
          },
          messageType: MessageType.SingleMessage,
          contentType: ContentType.Image,
        });

        if (code === HttpCode.SEND_MSG_ERROR) {
          alert.show('发生了未知的错误', {
            title: '消息发送失败',
          });
          return;
        }
      };
    }
    // setShowToggle(false);
  }

  return (
    <>
      <div className='c-chat_window-sender'>
        <SvgIcon
          name='link'
          style={{
            width: '30px',
            height: '30px',
            color: 'var(--global-font-primary_lighter)',
            margin: '0 15px',
            cursor: ChatStore.currentChat !== null ? 'pointer' : 'default',
          }}
          onClick={(e) => {
            if (ChatStore.currentChat !== null) {
              e.stopPropagation();
              setShowDropDown(!showDropDown);
            }
          }}
        />
        <div
          className='c-chat_window-sender-dropdown'
          style={{ display: showDropDown ? 'flex' : 'none' }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className='c-chat_window-sender-dropdown-item'>
            <SvgIcon
              name='photo'
              style={{
                width: '20px',
                height: '20px',
                color: 'var(--global-font-primary_lighter)',
                margin: '0 10px 0 0',
              }}
            />
            Photo
            <input
              className='c-chat_window-sender-dropdown-item-uploader'
              type='file'
              accept='image/gif, image/jpeg, image/png, image/jpg'
              onChange={onUploadImage}
            />
          </div>
          <div className='c-chat_window-sender-dropdown-item'>
            <SvgIcon
              name='file'
              style={{
                width: '20px',
                height: '20px',
                color: 'var(--global-font-primary_lighter)',
                margin: '0 10px 0 0',
              }}
            />
            Document
            <input
              className='c-chat_window-sender-dropdown-item-uploader'
              type='file'
              accept='image/gif, image/jpeg, image/png, image/jpg'
              // onChange={upload}
            />
          </div>
        </div>

        <form
          className='c-chat_window-sender-form'
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className='c-chat_window-sender-form-input'
            type='text'
            placeholder='Write a message...'
            autoComplete='off'
            {...register('content', { required: true })}
          />
        </form>
        <div style={{ marginRight: '20px' }}>
          <SvgIcon
            name='microphone'
            style={{
              width: '30px',
              height: '30px',
              color: 'var(--global-font-primary_lighter)',
              cursor: ChatStore.currentChat !== null ? 'pointer' : 'default',
            }}
          />
        </div>
      </div>
      {showToggle && (
        <div>
          <div className='c-chat_window-sender-mask'></div>
          <div className='c-chat_window-sender-toggle'>
            <h2 className='c-chat_window-sender-toggle-title'>Send Photo</h2>
            <SvgIcon
              name='cross'
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                position: 'absolute',
                right: '10px',
                top: '10px',

                '&:hover': {
                  color: 'var(--global-font-primary)',
                },
              }}
              onClick={() => setShowToggle(false)}
            />
            <img
              id='selectedImage'
              src='#'
              alt='selectedImage'
              className='c-chat_window-sender-toggle-img'
            />
            <div className='c-chat_window-sender-toggle-send' onClick={sendImg}>
              SEND
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Sender;

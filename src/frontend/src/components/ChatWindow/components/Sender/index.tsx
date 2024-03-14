import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { sendMsg } from '@/network/message/sendMsg';
import { ContentType, MessageType } from '@/enums';
import { HttpCode } from '../../../../../../shared/consts/httpCode';
import { isSingleChat } from '@/utils/chat';
import { sendGroupMsg } from '@/network/message/sendGroupMsg';
import { useShowDropDown } from '@/components/Header/hooks/useShowDropdown';
import { useState } from 'react';
import { transformFileSize } from '@/utils/file';
import { sendFileReq } from '@/network/webrtc/sendFile';
import ChatStore from '@/mobx/chat';
import MultiMediaStore from '@/mobx/multiMedia';
import SvgIcon from '@/components/SvgIcon';
import Emitter from '@/utils/eventEmitter';
import './index.scss';

interface ISendMsg {
  content: string;
}

enum ToggleType {
  Image,
  File,
}

function Sender() {
  const alert = useAlert();
  const { register, reset, handleSubmit } = useForm<ISendMsg>();
  const { showDropDown, setShowDropDown } = useShowDropDown();
  const [showToggle, setShowToggle] = useState(false);
  const [file, setFile] = useState<File | null>();
  const [toggleType, setToggleType] = useState(ToggleType.Image);

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
    setToggleType(ToggleType.Image);
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

  async function onUploadFile(e: any) {
    setShowToggle(true);
    setToggleType(ToggleType.File);

    const file = e.target.files[0];
    setFile(file);
    MultiMediaStore.file = file; // 在下面的 socket 回调里面打印 file 总是 undefined，所以出此下策
  }

  async function sendImg() {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        const fileArrayBuffer = e.target!.result;

        if (isSingleChat()) {
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
        } else {
          const { code } = await sendGroupMsg({
            receiver: ChatStore.currentChat?.gid as number,
            messageContent: {
              file: fileArrayBuffer,
              filename: file.name,
            },
            messageType: MessageType.GroupMessage,
            contentType: ContentType.Image,
          });

          if (code === HttpCode.SEND_MSG_ERROR) {
            alert.show('发生了未知的错误', {
              title: '消息发送失败',
            });
            return;
          }
        }
      };
    }
    setShowToggle(false);
  }

  async function sendFile() {
    if (file) {
      if (isSingleChat()) {
        sendFileReq({ uid: ChatStore.currentChat!.uid, fileName: file.name });
      }
    }
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
              accept='.pdf, .doc, .docx, .zip, .ppt, .pptx'
              onChange={onUploadFile}
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
          <div
            className='c-chat_window-sender-toggle'
            style={{ height: toggleType === ToggleType.Image ? '60%' : '30%' }}
          >
            <h2 className='c-chat_window-sender-toggle-title'>
              {toggleType === ToggleType.Image ? 'Send Photo' : 'Send File'}
            </h2>
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
            {toggleType === ToggleType.Image ? (
              <img
                id='selectedImage'
                src='#'
                alt='selectedImage'
                className='c-chat_window-sender-toggle-img'
              />
            ) : (
              <div className='c-chat_window-sender-toggle-file'>
                <SvgIcon
                  name='file'
                  style={{
                    width: '35px',
                    height: '35px',
                    color: 'var(--global-font-primary_lighter)',
                    margin: '0 15px 0 0',
                  }}
                />
                <div className='c-chat_window-sender-toggle-file-content'>
                  <span style={{ height: 30 }}>{file!.name}</span>
                  <span style={{ fontSize: 12 }}>
                    {transformFileSize(file!.size)}
                  </span>
                </div>
              </div>
            )}
            <div
              className='c-chat_window-sender-toggle-send'
              onClick={toggleType === ToggleType.Image ? sendImg : sendFile}
            >
              SEND
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Sender;

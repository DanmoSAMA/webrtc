import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { sendMsg } from '@/network/message/sendMsg';
import { ContentType, MessageType } from '@/enums';
import { HttpCode } from '../../../../../../shared/consts/httpCode';
import { isSingleChat } from '@/utils/chat';
import { sendGroupMsg } from '@/network/message/sendGroupMsg';
import { useShowDropDown } from '@/components/Header/hooks/useShowDropdown';
import { useEffect, useState } from 'react';
import { generateRandomFileName, transformFileSize } from '@/utils/file';
import { sendFileReq } from '@/network/friend/sendFile';
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
  Audio,
}

function Sender() {
  const alert = useAlert();
  const { register, reset, handleSubmit } = useForm<ISendMsg>();
  const { showDropDown, setShowDropDown } = useShowDropDown();
  const [showToggle, setShowToggle] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const [isRecordComplete, setIsRecordComplete] = useState(false);
  const [isStartRecord, setIsStartRecord] = useState(false);
  const [file, setFile] = useState<File | null>();
  const [toggleType, setToggleType] = useState(ToggleType.Image);
  const [timeText, setTimeText] = useState('');
  const [recordingInterval, setRecordingInterval] = useState<any>();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState('');

  let startTime: any;

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
          contentType: ContentType.Text,
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
          contentType: ContentType.Text,
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
    setShowMask(true);

    const file = e.target.files[0];

    setTimeout(() => {
      const selectedImage: any = document.querySelector('#selectedImage');
      const reader = new FileReader();

      reader.onload = (e) => {
        selectedImage.src = e.target!.result;
      };

      reader.readAsDataURL(file);
      setFile(file);
    }, 0);
  }

  async function onUploadFile(e: any) {
    setShowToggle(true);
    setToggleType(ToggleType.File);
    setShowMask(true);

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
    Emitter.emit('scrollToBottom');

    setShowToggle(false);
    setShowMask(false);
  }

  async function sendFile() {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        const fileArrayBuffer = e.target!.result;

        if (isSingleChat()) {
          sendFileReq({
            uid: ChatStore.currentChat!.uid,
            fileName: file.name,
          });
        } else {
          const { code } = await sendGroupMsg({
            receiver: ChatStore.currentChat?.gid as number,
            messageContent: {
              file: fileArrayBuffer,
              filename: file.name,
            },
            messageType: MessageType.GroupMessage,
            contentType: ContentType.File,
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
    Emitter.emit('scrollToBottom');

    setShowToggle(false);
    setShowMask(false);
  }

  async function sendAudio() {
    if (audioBlob) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlob);

      reader.onload = async (e) => {
        const fileArrayBuffer = e.target!.result;
        const filename = generateRandomFileName('mp3');

        if (isSingleChat()) {
          const { code } = await sendMsg({
            receiver: ChatStore.currentChat?.uid as number,
            messageContent: {
              file: fileArrayBuffer,
              filename: filename,
            },
            messageType: MessageType.SingleMessage,
            contentType: ContentType.Audio,
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
              filename: filename,
            },
            messageType: MessageType.GroupMessage,
            contentType: ContentType.Audio,
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
    Emitter.emit('scrollToBottom');

    setShowToggle(false);
    setShowMask(false);
  }

  const updateRecordingTime = () => {
    const elapsedTime = Date.now() - startTime;
    const ms = (elapsedTime % 100).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedTime / 1000) % 60)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60)
      .toString()
      .padStart(2, '0');
    setTimeText(`${minutes}:${seconds}:${ms}`);
  };

  function handleStartRecord() {
    setIsStartRecord(true);
    startTime = Date.now();
    const interval = setInterval(updateRecordingTime, 16);
    setRecordingInterval(interval);

    mediaRecorder!.start();
  }

  function handleStopRecord() {
    setIsRecordComplete(true);
    clearInterval(recordingInterval);

    mediaRecorder!.stop();
  }

  useEffect(() => {
    if (MultiMediaStore.stream) {
      setMediaRecorder(new MediaRecorder(MultiMediaStore.stream));
    }
  }, [MultiMediaStore.stream]);

  useEffect(() => {
    const chunks: Blob[] = [];
    let url = '';

    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks);
        chunks.length = 0;

        url = URL.createObjectURL(audioBlob);

        setAudioBlob(audioBlob);
        setAudioUrl(url);
      };
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [mediaRecorder]);

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
        <div
          style={{ marginRight: '20px' }}
          onClick={() => {
            if (ChatStore.currentChat !== null) {
              setShowToggle(true);
              setToggleType(ToggleType.Audio);
              setShowMask(true);
            }
          }}
        >
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
      {showMask && <div className='c-chat_window-mask'></div>}
      {showToggle && (
        <div>
          <div
            className='c-chat_window-sender-toggle'
            style={{ height: toggleType === ToggleType.Image ? '60%' : '30%' }}
          >
            <h2 className='c-chat_window-sender-toggle-title'>
              {toggleType === ToggleType.Image && 'Send Photo'}
              {toggleType === ToggleType.File && 'Send File'}
              {toggleType === ToggleType.Audio && 'Record Audio'}
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
              onClick={() => {
                setShowToggle(false);
                setShowMask(false);
                setIsStartRecord(false);
                setIsRecordComplete(false);
                setTimeText('');
                setAudioUrl('');
              }}
            />
            {toggleType === ToggleType.Image && (
              <img
                id='selectedImage'
                src='#'
                alt='selectedImage'
                className='c-chat_window-sender-toggle-img'
              />
            )}
            {toggleType === ToggleType.File && (
              <div className='c-chat_window-sender-toggle-file'>
                <SvgIcon
                  name='file'
                  style={{
                    minWidth: '35px',
                    height: '35px',
                    color: 'var(--global-font-primary_lighter)',
                    margin: '0 15px 0 0',
                  }}
                />
                <div className='c-chat_window-sender-toggle-file-content'>
                  <span>{file!.name}</span>
                  <span style={{ fontSize: 12 }}>
                    {transformFileSize(file!.size)}
                  </span>
                </div>
              </div>
            )}
            {toggleType === ToggleType.Audio && (
              <div className='c-chat_window-sender-toggle-time'>{timeText}</div>
            )}
            {toggleType === ToggleType.Audio && !isStartRecord && (
              <div
                className='c-chat_window-sender-toggle-start'
                onClick={handleStartRecord}
              >
                Start Record
              </div>
            )}
            {toggleType === ToggleType.Audio &&
              isStartRecord &&
              !isRecordComplete && (
                <div
                  className='c-chat_window-sender-toggle-stop'
                  onClick={handleStopRecord}
                >
                  Stop
                </div>
              )}
            {toggleType === ToggleType.Audio && isRecordComplete && (
              <audio src={audioUrl} controls></audio>
            )}
            {toggleType !== ToggleType.Audio && (
              <div
                className='c-chat_window-sender-toggle-send'
                onClick={toggleType === ToggleType.Image ? sendImg : sendFile}
              >
                SEND
              </div>
            )}
            {toggleType === ToggleType.Audio && isRecordComplete && (
              <div
                className='c-chat_window-sender-toggle-send'
                onClick={sendAudio}
              >
                SEND
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default Sender;

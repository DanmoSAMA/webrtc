import MultiMediaStore from '@/mobx/multiMedia';
import './index.scss';

function Desktop() {
  return (
    <>
      <div className='c-multimedia-desktop'>
        <video
          className='c-multimedia-user_list-item-video'
          id='desktop_video'
        />
        <span className='c-multimedia-user_list-item-name'></span>
      </div>
      <div
        className='c-multimedia-operation-stop'
        style={{ marginLeft: 0 }}
        onClick={() => {
          MultiMediaStore.ds.stopConnection();
          // location.reload();
        }}
      >
        终止共享
      </div>
    </>
  );
}

export default Desktop;

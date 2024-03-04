/**
 * description: 多媒体
 * date: 2024-02-21 21:10:49 +0800
 */

import { isSingleChat } from '@/utils/chat';
import MultiMediaSingle from './components/Single';
import MultiMediaGroup from './components/Group';
import './index.scss';

function MultiMedia() {
  return (
    <div className='c-multimedia'>
      {isSingleChat() ? <MultiMediaSingle /> : <MultiMediaGroup />}
    </div>
  );
}

export default MultiMedia;

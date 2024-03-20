/**
 * description: 多媒体
 * date: 2024-02-21 21:10:49 +0800
 */

import { isSingleChat } from '@/utils/chat';
import MultiMediaSingle from './components/Single';
import MultiMediaGroup from './components/Group';
import MultiMediaStore, { MultiMediaType } from '@/mobx/multiMedia';
import Desktop from './components/Desktop';
import './index.scss';

function MultiMedia() {
  return (
    <div className='c-multimedia'>
      {MultiMediaStore.type === MultiMediaType.VoiceCall && isSingleChat() && (
        <MultiMediaSingle />
      )}
      {MultiMediaStore.type === MultiMediaType.VoiceCall && !isSingleChat() && (
        <MultiMediaGroup />
      )}
      {MultiMediaStore.type === MultiMediaType.ShareDesktop && <Desktop />}
    </div>
  );
}

export default MultiMedia;

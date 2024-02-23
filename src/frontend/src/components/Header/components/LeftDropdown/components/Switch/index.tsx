import { observer } from 'mobx-react-lite';
import './index.scss';

interface SwitchProps {
  checked: boolean;
  onChange: (e: any) => any;
  style?: any;
}

function _Switch(props: SwitchProps) {
  const { checked, onChange, style } = props;
  return (
    <div className='switch_wrapper' style={style}>
      <label className='switch_wrapper-switch'>
        <input
          className='switch_wrapper-switch-input'
          checked={checked}
          type='checkbox'
          onChange={onChange}
        />
        <span className='switch_wrapper-switch-slider' />
      </label>
    </div>
  );
}

const Switch = observer(_Switch);

export default Switch;

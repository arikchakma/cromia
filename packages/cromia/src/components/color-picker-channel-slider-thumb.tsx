import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { bool } from '../utils/attrs';
import { CHANNEL_SLIDER_ORIENTATIONS } from '../utils/channel-slider';
import { CHANNEL_LABELS } from '../utils/channels';
import { hsvaToHslString, hsvaToHslaString } from '../utils/hsv';
import { useColorPickerChannelSliderContext } from './color-picker-channel-slider-context';
import { useColorPickerRootContext } from './color-picker-root-context';

type ColorPickerChannelSliderThumbProps = Omit<
  React.ComponentProps<'div'>,
  'color'
> & {
  render?: useRender.RenderProp<ColorPickerChannelSliderThumbState>;
};

export function ColorPickerChannelSliderThumb(
  props: ColorPickerChannelSliderThumb.Props
) {
  const { render, ref, ...rest } = props;

  const { hsva, disabled, dragging } = useColorPickerRootContext();
  const { channel, orientation, value, min, max } =
    useColorPickerChannelSliderContext();

  const position = max > min ? (value - min) / (max - min) : 0;
  const thumbColor =
    channel === 'alpha' ? hsvaToHslaString(hsva) : hsvaToHslString(hsva);

  const isHorizontal = orientation === CHANNEL_SLIDER_ORIENTATIONS.horizontal;
  const positionProp = isHorizontal ? 'left' : 'bottom';
  const crossAxis = isHorizontal ? 'top' : 'left';
  const positionValue = `${position * 100}%`;

  const state: ColorPickerChannelSliderThumbState = {
    disabled,
    dragging,
    channel,
    orientation,
    position,
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: thumbColor,
    [positionProp]: positionValue,
    [crossAxis]: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    '--color-picker-slider-thumb-position': positionValue,
    '--color-picker-thumb-color': thumbColor,
  };

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    state,
    stateAttributesMapping: channelSliderThumbStateMapping,
    props: mergeProps(
      {
        'data-color-picker-channel-slider-thumb': '',
        role: 'slider',
        tabIndex: disabled ? undefined : 0,
        'aria-label': CHANNEL_LABELS[channel],
        'aria-valuenow': Math.round(value * 100) / 100,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-orientation': orientation,
        style,
      },
      rest
    ),
  });

  return element;
}

type ColorPickerChannelSliderThumbState = {
  disabled: boolean;
  dragging: boolean;
  channel: string;
  orientation: string;
  position: number;
};

const channelSliderThumbStateMapping = {
  disabled: bool('disabled'),
  dragging: bool('dragging'),
  channel: (value: string) => ({ 'data-channel': value }),
  orientation: (value: string) => ({ 'data-orientation': value }),
  position: () => null,
};

export namespace ColorPickerChannelSliderThumb {
  export type Props = ColorPickerChannelSliderThumbProps;
  export type State = ColorPickerChannelSliderThumbState;
}

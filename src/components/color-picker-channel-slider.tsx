import * as React from 'react';
import { clamp } from '../utils/math';
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { useColorPickerRootContext } from './color-picker-root-context';
import { useColorPickerHandlers } from '../hooks/use-color-picker-handlers';
import type { Interaction } from '../hooks/use-color-picker-handlers';
import { HSVA_CHANNEL_CONFIG, readHsvaChannel } from '../utils/channels';
import type { HsvaChannel } from '../utils/channels';
import { bool } from '../utils/attrs';
import { ColorPickerChannelSliderContext } from './color-picker-channel-slider-context';
import { CHANNEL_SLIDER_ORIENTATIONS } from '../utils/channel-slider';
import type { ChannelSliderOrientation } from '../utils/channel-slider';

export type ColorPickerChannelSliderProps = Omit<
  React.ComponentProps<'div'>,
  'color'
> & {
  channel: HsvaChannel;
  orientation?: ChannelSliderOrientation;
  render?: useRender.RenderProp<ColorPickerChannelSliderState>;
};

export function ColorPickerChannelSlider(
  props: ColorPickerChannelSlider.Props
) {
  const {
    channel,
    orientation = CHANNEL_SLIDER_ORIENTATIONS.horizontal,
    render,
    ref,
    children,
    ...rest
  } = props;

  const {
    hsva,
    handleUpdateHsva,
    dragging,
    setDragging,
    disabled,
    handleColorCommitted,
  } = useColorPickerRootContext();

  const isDraggingRef = React.useRef(false);

  const config = HSVA_CHANNEL_CONFIG[channel];
  const currentValue = readHsvaChannel(hsva, channel);

  const onMove = (interaction: Interaction) => {
    const position =
      orientation === CHANNEL_SLIDER_ORIENTATIONS.vertical
        ? 1 - interaction.top
        : interaction.left;
    const value = config.min + position * (config.max - config.min);
    handleUpdateHsva({
      [config.key]: clamp(value, [config.min, config.max]),
    });
  };

  const onKeyDown = (offset: Interaction) => {
    const delta =
      orientation === CHANNEL_SLIDER_ORIENTATIONS.vertical
        ? -offset.top
        : offset.left;
    const stepValue = delta * (config.max - config.min);
    handleUpdateHsva({
      [config.key]: clamp(currentValue + stepValue, [config.min, config.max]),
    });
    handleColorCommitted();
  };

  const onMoveStart = () => {
    isDraggingRef.current = true;
    setDragging(true);
  };

  const onMoveEnd = () => {
    isDraggingRef.current = false;
    setDragging(false);
    handleColorCommitted();
  };

  const isBusy = dragging && !isDraggingRef.current;
  const handlers = useColorPickerHandlers({
    onMove,
    onKeyDown,
    onMoveStart,
    onMoveEnd,
    disabled: disabled || isBusy,
    direction: orientation,
  });

  const sliderContextValue: ColorPickerChannelSliderContext.Props = {
    channel,
    orientation,
    value: currentValue,
    min: config.min,
    max: config.max,
    step: config.step,
  };

  const state: ColorPickerChannelSliderState = {
    disabled,
    dragging,
    channel,
    orientation,
  };

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    state,
    stateAttributesMapping: channelSliderStateMapping,
    props: mergeProps(
      {
        'data-color-picker-channel-slider': '',
        style: { touchAction: 'none', position: 'relative' },
        children,
        ...handlers,
      },
      rest
    ),
  });

  return (
    <ColorPickerChannelSliderContext.Provider value={sliderContextValue}>
      {element}
    </ColorPickerChannelSliderContext.Provider>
  );
}

type ColorPickerChannelSliderState = {
  disabled: boolean;
  dragging: boolean;
  channel: string;
  orientation: string;
};

const channelSliderStateMapping = {
  disabled: bool('disabled'),
  dragging: bool('dragging'),
  channel: (value: string) => ({ 'data-channel': value }),
  orientation: (value: string) => ({ 'data-orientation': value }),
};

export namespace ColorPickerChannelSlider {
  export type Props = ColorPickerChannelSliderProps;
  export type State = ColorPickerChannelSliderState;
}

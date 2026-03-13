import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { getChannelSliderStyle } from '../utils/channel-slider';
import { useColorPickerChannelSliderContext } from './color-picker-channel-slider-context';
import { useColorPickerRootContext } from './color-picker-root-context';

type ColorPickerChannelSliderTrackProps = Omit<
  React.ComponentProps<'div'>,
  'color'
> & {
  render?: useRender.RenderProp;
};

export function ColorPickerChannelSliderTrack(
  props: ColorPickerChannelSliderTrack.Props
) {
  const { render, ref, ...rest } = props;

  const { hsva } = useColorPickerRootContext();
  const { channel, orientation } = useColorPickerChannelSliderContext();

  const style = getChannelSliderStyle(hsva, channel, orientation);

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    props: mergeProps(
      {
        'data-color-picker-channel-slider-track': '',
        'data-channel': channel,
        style,
      },
      rest
    ),
  });

  return element;
}

export namespace ColorPickerChannelSliderTrack {
  export type Props = ColorPickerChannelSliderTrackProps;
}

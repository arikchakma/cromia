import * as React from 'react';

import type { ChannelSliderOrientation } from '../utils/channel-slider';
import type { HsvaChannel } from '../utils/channels';
import { CROMIA_NAMESPACE } from '../utils/constants';

type ColorPickerChannelSliderContext = {
  channel: HsvaChannel;
  orientation: ChannelSliderOrientation;
  value: number;
  min: number;
  max: number;
  step: number;
};

export const ColorPickerChannelSliderContext =
  React.createContext<ColorPickerChannelSliderContext | null>(null);

export function useColorPickerChannelSliderContext() {
  const context = React.useContext(ColorPickerChannelSliderContext);
  if (!context) {
    throw new Error(
      `${CROMIA_NAMESPACE}: ColorPickerChannelSliderContext is missing. Slider parts must be placed within <Cromia.ChannelSlider>.`
    );
  }

  return context;
}

export namespace ColorPickerChannelSliderContext {
  export type Props = ColorPickerChannelSliderContext;
}

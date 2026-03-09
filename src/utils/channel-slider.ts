import { HSVA_CHANNEL_CONFIG } from './channels';
import type { HsvaChannel } from './channels';
import type { HsvaColor } from './color';
import { hsvaToHslaString, hsvaToHslString } from './hsv';

const HUE_SPECTRUM =
  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

const CHECKERBOARD_PATTERN =
  'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%)';

export const CHANNEL_SLIDER_ORIENTATIONS = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export type ChannelSliderOrientation =
  (typeof CHANNEL_SLIDER_ORIENTATIONS)[keyof typeof CHANNEL_SLIDER_ORIENTATIONS];

function getGradientDirection(orientation: ChannelSliderOrientation): string {
  return orientation === CHANNEL_SLIDER_ORIENTATIONS.vertical
    ? 'to top'
    : 'to right';
}

function buildHueStyle(
  orientation: ChannelSliderOrientation
): React.CSSProperties {
  const gradient =
    orientation === CHANNEL_SLIDER_ORIENTATIONS.vertical
      ? HUE_SPECTRUM.replace('to right', 'to top')
      : HUE_SPECTRUM;

  return {
    backgroundImage: gradient,
    '--color-picker-slider-gradient': gradient,
    '--color-picker-slider-from': '#f00',
    '--color-picker-slider-to': '#f00',
  };
}

function buildAlphaStyle(
  hsva: HsvaColor,
  orientation: ChannelSliderOrientation
): React.CSSProperties {
  const direction = getGradientDirection(orientation);
  const from = hsvaToHslaString({ ...hsva, a: 0 });
  const to = hsvaToHslaString({ ...hsva, a: 1 });
  const gradient = `linear-gradient(${direction}, ${from}, ${to})`;

  return {
    backgroundImage: `${gradient}, ${CHECKERBOARD_PATTERN}`,
    backgroundSize: '100% 100%, 8px 8px',
    '--color-picker-slider-gradient': gradient,
    '--color-picker-slider-from': from,
    '--color-picker-slider-to': to,
  };
}

function buildColorChannelStyle(
  hsva: HsvaColor,
  channel: HsvaChannel,
  orientation: ChannelSliderOrientation
): React.CSSProperties {
  const direction = getGradientDirection(orientation);
  const { key } = HSVA_CHANNEL_CONFIG[channel];
  const from = hsvaToHslString({ ...hsva, [key]: 0 });
  const to = hsvaToHslString({ ...hsva, [key]: 100 });
  const gradient = `linear-gradient(${direction}, ${from}, ${to})`;

  return {
    backgroundImage: gradient,
    '--color-picker-slider-gradient': gradient,
    '--color-picker-slider-from': from,
    '--color-picker-slider-to': to,
  };
}

export function getChannelSliderStyle(
  hsva: HsvaColor,
  channel: HsvaChannel,
  orientation: ChannelSliderOrientation
): React.CSSProperties {
  switch (channel) {
    case 'hue':
      return buildHueStyle(orientation);
    case 'alpha':
      return buildAlphaStyle(hsva, orientation);
    default:
      return buildColorChannelStyle(hsva, channel, orientation);
  }
}

import type { HsvaColor } from './color';

export const HSVA_CHANNEL = {
  Hue: 'hue',
  Saturation: 'saturation',
  Brightness: 'brightness',
  Alpha: 'alpha',
} as const;

export type HsvaChannel = (typeof HSVA_CHANNEL)[keyof typeof HSVA_CHANNEL];

export const CHANNEL_LABELS: Record<HsvaChannel, string> = {
  [HSVA_CHANNEL.Hue]: 'Hue',
  [HSVA_CHANNEL.Saturation]: 'Saturation',
  [HSVA_CHANNEL.Brightness]: 'Brightness',
  [HSVA_CHANNEL.Alpha]: 'Alpha',
};

export const HSVA_CHANNEL_CONFIG = {
  [HSVA_CHANNEL.Hue]: { key: 'h' as const, min: 0, max: 360, step: 1 },
  [HSVA_CHANNEL.Saturation]: { key: 's' as const, min: 0, max: 100, step: 1 },
  [HSVA_CHANNEL.Brightness]: { key: 'v' as const, min: 0, max: 100, step: 1 },
  [HSVA_CHANNEL.Alpha]: { key: 'a' as const, min: 0, max: 1, step: 0.01 },
} as const;

export function readHsvaChannel(hsva: HsvaColor, channel: HsvaChannel): number {
  return hsva[HSVA_CHANNEL_CONFIG[channel].key];
}

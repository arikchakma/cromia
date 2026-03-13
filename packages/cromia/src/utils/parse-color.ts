import type {
  AnyColor,
  HslaColor,
  HslColor,
  HsvaColor,
  HsvColor,
  RgbaColor,
  RgbColor,
} from './color';
import { CROMIA_ERROR_PREFIX } from './constants';
import { hexToHsva } from './hex';
import { hslaStringToHsva, hslaToHsva } from './hsl';
import { hsvaStringToHsva } from './hsv';
import { rgbaStringToHsva, rgbaToHsva } from './rgb';

export function parseAnyColor(input: AnyColor): HsvaColor {
  if (typeof input === 'string') {
    return string(input);
  }

  return object(input);
}

const TRANSPARENT: HsvaColor = { h: 0, s: 0, v: 0, a: 0 };
const DEFAULT: HsvaColor = { h: 0, s: 0, v: 0, a: 1 };

function string(raw: string): HsvaColor {
  const value = raw.trim();
  const lower = value.toLowerCase();

  if (lower === '' || lower === 'none') {
    return DEFAULT;
  }

  if (lower === 'transparent') {
    return TRANSPARENT;
  }

  if (value.startsWith('#')) {
    return hexToHsva(value);
  }

  if (value.startsWith('rgb')) {
    return rgbaStringToHsva(value);
  }

  if (value.startsWith('hsl')) {
    return hslaStringToHsva(value);
  }

  if (value.startsWith('hsv') || value.startsWith('hsb')) {
    // Normalize hsb/hsba → hsv/hsva for the regex parser
    return hsvaStringToHsva(value.replace(/^hsb/, 'hsv'));
  }

  throw new Error(`${CROMIA_ERROR_PREFIX}: Invalid color string: ${value}`);
}

function object(input: Exclude<AnyColor, string>): HsvaColor {
  if ('v' in input) {
    return 'a' in input
      ? (input as HsvaColor)
      : { ...(input as HsvColor), a: 1 };
  }

  if ('l' in input) {
    return 'a' in input
      ? hslaToHsva(input as HslaColor)
      : hslaToHsva({ ...(input as HslColor), a: 1 });
  }

  if ('r' in input) {
    return 'a' in input
      ? rgbaToHsva(input as RgbaColor)
      : rgbaToHsva({ ...(input as RgbColor), a: 1 });
  }

  throw new Error(
    `${CROMIA_ERROR_PREFIX}: Invalid color object: ${JSON.stringify(input)}`
  );
}

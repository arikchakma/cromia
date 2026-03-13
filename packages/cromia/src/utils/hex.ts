import type { HsvaColor, RgbaColor } from './color';
import { round } from './math';
import { isObjectDeepEqual } from './object';
import { rgbaToHsva } from './rgb';

export function hexToRgba(hex: string): RgbaColor {
  const h = hex[0] === '#' ? hex.substring(1) : hex;

  if (h.length < 6) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
      a: h.length === 4 ? round(parseInt(h[3] + h[3], 16) / 255, 2) : 1,
    };
  }

  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
    a: h.length === 8 ? round(parseInt(h.substring(6, 8), 16) / 255, 2) : 1,
  };
}

export function hexToHsva(hex: string): HsvaColor {
  return rgbaToHsva(hexToRgba(hex));
}

const HEX_MATCHER = /^#?([0-9A-F]{3,8})$/i;

export function isHexValid(value: string, alpha?: boolean): boolean {
  const match = HEX_MATCHER.exec(value);
  const length = match ? match[1].length : 0;

  return (
    length === 3 ||
    length === 6 ||
    (!!alpha && length === 4) ||
    (!!alpha && length === 8)
  );
}

export function isHexEqual(first: string, second: string): boolean {
  if (first.toLowerCase() === second.toLowerCase()) {
    return true;
  }

  return isObjectDeepEqual(hexToRgba(first), hexToRgba(second));
}

import type { HsvaColor, RgbaColor, RgbColor } from './color';
import { round } from './math';

export function rgbaToHsva(color: RgbaColor): HsvaColor {
  const { r, g, b, a } = color;

  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh), 2),
    s: round(max ? (delta / max) * 100 : 0, 2),
    v: round((max / 255) * 100, 2),
    a,
  };
}

export function rgbaToHex(color: RgbaColor): string {
  const { r, g, b, a } = color;

  const alphaHex =
    a < 1
      ? round(a * 255, 0)
          .toString(16)
          .padStart(2, '0')
      : '';
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0') +
    alphaHex
  );
}

const RGBA_STRING_REGEX =
  /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

export function rgbaStringToHsva(rgbaString: string): HsvaColor {
  const match = RGBA_STRING_REGEX.exec(rgbaString);
  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }

  return rgbaToHsva({
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
  });
}

export function rgbStringToHsva(rgbString: string): HsvaColor {
  return rgbaStringToHsva(rgbString);
}

export function rgbaToHexInt(rgba: RgbaColor, alpha?: boolean): number {
  const { r, g, b, a } = rgba;
  const rgb = (r << 16) | (g << 8) | b;
  if (!alpha) {
    return rgb;
  }

  return rgb * 256 + Math.round(a * 255);
}

export function hexIntToRgba(int: number, alpha?: boolean): RgbaColor {
  if (!alpha) {
    return {
      r: (int >> 16) & 0xff,
      g: (int >> 8) & 0xff,
      b: int & 0xff,
      a: 1,
    };
  }

  const a255 = int & 0xff;
  const rgb = (int - a255) / 256;
  return {
    r: (rgb >> 16) & 0xff,
    g: (rgb >> 8) & 0xff,
    b: rgb & 0xff,
    a: round(a255 / 255, 2),
  };
}

export function rgbaToRgb(rgba: RgbaColor): RgbColor {
  const { r, g, b } = rgba;
  return { r, g, b };
}

import type { HslaColor, HslColor, HsvaColor } from './color';
import { parseHue } from './hue';

export function hslaToHsva(color: HslaColor): HsvaColor {
  let { h, s, l, a } = color;
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
    a,
  };
}

const HSL_STRING_REGEX =
  /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

export function hslaStringToHsva(hslString: string): HsvaColor {
  const match = HSL_STRING_REGEX.exec(hslString);

  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }

  return hslaToHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    l: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  });
}

export function hslStringToHsva(hslString: string): HsvaColor {
  return hslaStringToHsva(hslString);
}

export function hslaToHsl(hsla: HslaColor): HslColor {
  const { h, s, l } = hsla;
  return { h, s, l };
}

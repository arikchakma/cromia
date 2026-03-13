import type { HslaColor, HsvaColor, HsvColor, RgbaColor } from './color';
import { parseHue } from './hue';
import { round } from './math';
import { rgbaToHex } from './rgb';

const HSV_STRING_REGEX =
  /hsva?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

export function hsvaStringToHsva(hsvString: string): HsvaColor {
  const match = HSV_STRING_REGEX.exec(hsvString);
  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }

  return roundHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    v: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  });
}

export function hsvStringToHsva(hsvString: string): HsvaColor {
  return hsvaStringToHsva(hsvString);
}

export function roundHsva(hsva: HsvaColor): HsvaColor {
  return {
    h: round(hsva.h, 0),
    s: round(hsva.s, 0),
    v: round(hsva.v, 0),
    a: round(hsva.a, 2),
  };
}

export function hsvaToHsv(hsva: HsvaColor): HsvColor {
  const { h, s, v } = roundHsva(hsva);
  return { h, s, v };
}

export function hsvaToHsla(hsva: HsvaColor): HslaColor {
  const { h, s, v, a } = hsva;
  const hh = ((200 - s) * v) / 100;

  return {
    h: round(h, 0),
    s: round(
      hh > 0 && hh < 200
        ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100
        : 0,
      0
    ),
    l: round(hh / 2, 0),
    a: round(a, 2),
  };
}

export function hsvaToRgba(hsva: HsvaColor): RgbaColor {
  let { h, s, v, a } = hsva;
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  const hh = Math.floor(h);
  const b = v * (1 - s);
  const c = v * (1 - (h - hh) * s);
  const d = v * (1 - (1 - h + hh) * s);
  const module = hh % 6;

  return {
    r: round([v, c, b, b, d, v][module] * 255, 0),
    g: round([d, v, v, c, b, b][module] * 255, 0),
    b: round([b, b, d, v, v, c][module] * 255, 0),
    a: round(a, 2),
  };
}

export function hsvaToHex(hsva: HsvaColor): string {
  return rgbaToHex(hsvaToRgba(hsva));
}

export function hsvaToHslString(hsva: HsvaColor): string {
  const { h, s, l } = hsvaToHsla(hsva);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function hsvaToHslaString(hsva: HsvaColor): string {
  const { h, s, l, a } = hsvaToHsla(hsva);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export function hsvaToHsvString(hsva: HsvaColor): string {
  const { h, s, v } = roundHsva(hsva);
  return `hsv(${h}, ${s}%, ${v}%)`;
}

export function hsvaToHsvaString(hsva: HsvaColor): string {
  const { h, s, v, a } = roundHsva(hsva);
  return `hsva(${h}, ${s}%, ${v}%, ${a})`;
}

export function hsvaToRgbString(hsva: HsvaColor): string {
  const { r, g, b } = hsvaToRgba(hsva);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hsvaToRgbaString(hsva: HsvaColor): string {
  const { r, g, b, a } = hsvaToRgba(hsva);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function getHsvaStyleVariables(hsva: HsvaColor): React.CSSProperties {
  return {
    '--color-picker-hue': hsva.h,
    '--color-picker-saturation': hsva.s,
    '--color-picker-brightness': hsva.v,
    '--color-picker-alpha': hsva.a,
  };
}

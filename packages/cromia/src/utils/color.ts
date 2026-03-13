import { isObjectDeepEqual } from './object';

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type HslColor = {
  h: number;
  s: number;
  l: number;
};

export type HsvColor = {
  h: number;
  s: number;
  v: number;
};

type WithAlpha<O> = O & { a: number };

export type RgbaColor = WithAlpha<RgbColor>;
export type HslaColor = WithAlpha<HslColor>;
export type HsvaColor = WithAlpha<HsvColor>;

export type ObjectColor =
  | RgbColor
  | HslColor
  | HsvColor
  | RgbaColor
  | HslaColor
  | HsvaColor;

export type AnyColor = string | ObjectColor;

export function isColorStringsEqual(first: string, second: string): boolean {
  return first.replace(/\s/g, '') === second.replace(/\s/g, '');
}

export function isAnyColorEqual(
  a: AnyColor | undefined,
  b: AnyColor | undefined
): boolean {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return isObjectDeepEqual(a, b);
  }

  return false;
}

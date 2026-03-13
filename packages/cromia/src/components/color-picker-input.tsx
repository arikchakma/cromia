import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { HSVA_CHANNEL_CONFIG, readHsvaChannel } from '../utils/channels';
import type { HsvaChannel } from '../utils/channels';
import type { HsvaColor } from '../utils/color';
import { ARROW_DOWN, ARROW_UP, ENTER, HOME, END } from '../utils/composite';
import { CROMIA_ERROR_PREFIX } from '../utils/constants';
import { hexToHsva, isHexValid } from '../utils/hex';
import { hsvaToHex, hsvaToRgba } from '../utils/hsv';
import { clamp } from '../utils/math';
import { rgbaToHsva, rgbaToHexInt, hexIntToRgba } from '../utils/rgb';
import { useColorPickerRootContext } from './color-picker-root-context';

type InputChannel = HsvaChannel | 'hex' | 'hex-alpha';

const LARGE_STEP_MULTIPLIER = 10;
const HEX_STEP = 1;
const HEX_LARGE_STEP = 16;

const ALLOWED_KEYS = new Set([ARROW_UP, ARROW_DOWN, ENTER, HOME, END]);

const CHANNEL_SUFFIX: Record<HsvaChannel, string> = {
  hue: '°',
  saturation: '%',
  brightness: '%',
  alpha: '%',
};

type ColorPickerInputProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange' | 'color'
> & {
  channel: InputChannel;
  prefixed?: boolean;
  render?: useRender.RenderProp;
};

export function ColorPickerInput(props: ColorPickerInput.Props) {
  const { channel, prefixed = true, render, ref, ...rest } = props;

  const { hsva, handleUpdateHsva, handleColorCommitted } =
    useColorPickerRootContext();

  const displayValue = React.useMemo(() => {
    if (channel === 'hex' || channel === 'hex-alpha') {
      const hex = hsvaToHex(channel === 'hex' ? { ...hsva, a: 1 } : hsva);
      return prefixed ? hex : hex.replace('#', '');
    }

    const val = readHsvaChannel(hsva, channel);
    const suffix = CHANNEL_SUFFIX[channel];
    if (channel === 'alpha') {
      return `${Math.round(val * 100)}${suffix}`;
    }

    return `${Math.round(val)}${suffix}`;
  }, [hsva, channel]);

  const [editValue, setEditValue] = React.useState<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setEditValue(raw);

    const update = parseChannelInput(raw, channel);
    if (!update) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    handleUpdateHsva(update);
  };

  const handleBlur = () => {
    setEditValue(null);
    setInvalid(false);
    handleColorCommitted();
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.target;
    queueMicrotask(input.select.bind(input));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ALLOWED_KEYS.has(event.key)) {
      return;
    }

    if (event.key === ENTER) {
      event.currentTarget.blur();
      return;
    }

    const update = getKeyUpdate(hsva, event.key, event.shiftKey, channel);
    if (!update) {
      return;
    }

    event.preventDefault();
    handleUpdateHsva(update);
    setEditValue(null);
    setInvalid(false);
    handleColorCommitted();

    const input = event.currentTarget;
    queueMicrotask(input.select.bind(input));
  };

  const element = useRender({
    render,
    defaultTagName: 'input',
    ref,
    props: mergeProps(
      {
        'data-color-picker-input': '',
        'data-channel': channel,
        ...(invalid ? { 'data-invalid': '' } : {}),
        'aria-invalid': invalid || undefined,
        value: editValue ?? displayValue,
        spellCheck: false,
        autoComplete: 'off',
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
      },
      rest
    ),
  });

  return element;
}

function parseChannelInput(
  raw: string,
  channel: InputChannel
): Partial<HsvaColor> | null {
  const value = raw.trim();
  const isAlpha = channel === 'hex-alpha' || channel === 'alpha';

  if (channel === 'hex' || channel === 'hex-alpha') {
    const hex = value.startsWith('#') ? value : `#${value}`;
    if (!isHexValid(hex, isAlpha)) {
      return null;
    }

    const parsed = hexToHsva(hex);
    return isAlpha ? parsed : { h: parsed.h, s: parsed.s, v: parsed.v };
  }

  const cleaned = isAlpha
    ? value.replace(/%/g, '')
    : value.replace(/[°%]/g, '');

  const num = Number(cleaned.trim());
  if (Number.isNaN(num)) {
    return null;
  }

  if (isAlpha) {
    if (num < 0 || num > 100) {
      return null;
    }

    return { a: clamp(num / 100, [0, 1]) };
  }

  const config = HSVA_CHANNEL_CONFIG[channel];
  if (num < config.min || num > config.max) {
    return null;
  }

  return { [config.key]: clamp(num, [config.min, config.max]) };
}

function getKeyUpdate(
  hsva: HsvaColor,
  key: string,
  shiftKey: boolean,
  channel: InputChannel
): Partial<HsvaColor> | null {
  if (channel === 'hex' || channel === 'hex-alpha') {
    const alpha = channel === 'hex-alpha';
    const step = shiftKey ? HEX_LARGE_STEP : HEX_STEP;

    switch (key) {
      case ARROW_UP:
      case ARROW_DOWN: {
        const delta = key === ARROW_UP ? step : -step;
        const rgba = hsvaToRgba(hsva);
        const rgbInt = rgbaToHexInt(rgba);
        const stepped = clamp(rgbInt + delta, [0, 0xffffff]);
        const steppedRgba = hexIntToRgba(stepped);
        steppedRgba.a = rgba.a;
        const result = rgbaToHsva(steppedRgba);
        return alpha ? result : { h: result.h, s: result.s, v: result.v };
      }
      case HOME: {
        const min = hexToHsva(alpha ? '#00000000' : '#000000');
        return alpha ? min : { h: min.h, s: min.s, v: min.v };
      }
      case END: {
        const max = hexToHsva(alpha ? '#ffffffff' : '#ffffff');
        return alpha ? max : { h: max.h, s: max.s, v: max.v };
      }
      default:
        throw new Error(
          `${CROMIA_ERROR_PREFIX}: It should be impossible to reach this code path.`
        );
    }
  }

  const config = HSVA_CHANNEL_CONFIG[channel];
  const currentValue = readHsvaChannel(hsva, channel);
  const step = shiftKey ? config.step * LARGE_STEP_MULTIPLIER : config.step;

  switch (key) {
    case ARROW_UP:
      return {
        [config.key]: clamp(currentValue + step, [config.min, config.max]),
      };
    case ARROW_DOWN:
      return {
        [config.key]: clamp(currentValue - step, [config.min, config.max]),
      };
    case HOME:
      return { [config.key]: config.min };
    case END:
      return { [config.key]: config.max };
    default:
      throw new Error(
        `${CROMIA_ERROR_PREFIX}: It should be impossible to reach this code path.`
      );
  }
}

export namespace ColorPickerInput {
  export type Props = ColorPickerInputProps;
}

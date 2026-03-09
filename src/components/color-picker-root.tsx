import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { getHsvaStyleVariables, hsvaToHex } from '../utils/hsv';
import { isAnyColorEqual } from '../utils/color';
import type { AnyColor, HsvaColor } from '../utils/color';
import { parseAnyColor } from '../utils/parse-color';
import { ColorPickerRootContext } from './color-picker-root-context';
import { useValueAsRef } from '../hooks/use-value-as-ref';
import { bool } from '../utils/attrs';

function noop(): void {}

const DEFAULT_HSVA: HsvaColor = { h: 0, s: 0, v: 0, a: 1 };

type ColorPickerRootProps = Omit<React.ComponentProps<'div'>, 'color'> & {
  color?: AnyColor;
  defaultColor?: AnyColor;
  onColorChange?: (color: string) => void;
  onColorCommitted?: (color: string) => void;
  disabled?: boolean;
  render?: useRender.RenderProp<ColorPickerRootState>;
};

export function ColorPickerRoot(props: ColorPickerRoot.Props) {
  const {
    color: colorProp,
    defaultColor,
    onColorChange = noop,
    onColorCommitted = noop,
    disabled = false,

    render,

    ref,
    children,
    ...rest
  } = props;

  const [hsva, setHsva] = React.useState<HsvaColor>(() => {
    if (colorProp !== undefined) {
      return parseAnyColor(colorProp);
    }

    if (defaultColor !== undefined) {
      return parseAnyColor(defaultColor);
    }

    return DEFAULT_HSVA;
  });

  const hsvaRef = useValueAsRef(hsva);
  const currentHex = hsvaToHex(hsva);

  const isControlled = colorProp !== undefined;
  const prevColorProp = React.useRef(colorProp);

  if (isControlled && !isAnyColorEqual(colorProp, prevColorProp.current)) {
    prevColorProp.current = colorProp;
    const parsed = parseAnyColor(colorProp);
    if (hsvaToHex(parsed) !== currentHex) {
      setHsva(parsed);
      hsvaRef.current = parsed;
    }
  }

  const [dragging, setDragging] = React.useState(false);

  const handleUpdateHsva = (partial: Partial<HsvaColor>) => {
    const next = { ...hsvaRef.current, ...partial };
    setHsva(next);
    hsvaRef.current = next;
    onColorChange(hsvaToHex(next));
  };

  const handleColorCommitted = () => {
    const value = hsvaToHex(hsvaRef.current);
    onColorCommitted(value);
  };

  const contextValue: ColorPickerRootContext.Props = {
    hsva,
    handleUpdateHsva,
    dragging,
    setDragging,
    disabled,
    handleColorCommitted,
  };

  const state: ColorPickerRoot.State = { disabled, dragging };

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    state,
    stateAttributesMapping: rootStateAttributesMapping,
    props: mergeProps(
      {
        'data-color-picker-root': '',
        children,
        style: getHsvaStyleVariables(hsva),
      },
      rest
    ),
  });

  return (
    <ColorPickerRootContext.Provider value={contextValue}>
      {element}
    </ColorPickerRootContext.Provider>
  );
}

type ColorPickerRootState = {
  disabled: boolean;
  dragging: boolean;
};

export const rootStateAttributesMapping = {
  disabled: bool('disabled'),
  dragging: bool('dragging'),
};

export namespace ColorPickerRoot {
  export type Props = ColorPickerRootProps;
  export type State = ColorPickerRootState;
}

import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { bool } from '../utils/attrs';
import { hsvaToHslString } from '../utils/hsv';
import { useColorPickerRootContext } from './color-picker-root-context';

type ColorPickerAreaThumbProps = Omit<React.ComponentProps<'div'>, 'color'> & {
  render?: useRender.RenderProp<ColorPickerAreaThumbState>;
};

export function ColorPickerAreaThumb(props: ColorPickerAreaThumb.Props) {
  const { render, ref, ...rest } = props;

  const { hsva, disabled, dragging } = useColorPickerRootContext();

  const left = hsva.s / 100;
  const top = 1 - hsva.v / 100;
  const thumbColor = hsvaToHslString(hsva);

  const state: ColorPickerAreaThumbState = {
    disabled,
    dragging,
    left,
    top,
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${left * 100}%`,
    top: `${top * 100}%`,
    backgroundColor: thumbColor,
    transform: 'translateX(-50%) translateY(-50%)',
    '--color-picker-area-thumb-x': `${left * 100}%`,
    '--color-picker-area-thumb-y': `${top * 100}%`,
    '--color-picker-thumb-color': thumbColor,
  };

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    state,
    stateAttributesMapping: areaThumbStateMapping,
    props: mergeProps(
      {
        'data-color-picker-area-thumb': '',
        role: 'slider',
        tabIndex: disabled ? undefined : 0,
        'aria-label': 'Color',
        'aria-valuetext': `Saturation ${Math.round(
          hsva.s
        )}%, Brightness ${Math.round(hsva.v)}%`,
        style,
      },
      rest
    ),
  });

  return element;
}

type ColorPickerAreaThumbState = {
  disabled: boolean;
  dragging: boolean;
  left: number;
  top: number;
};

const areaThumbStateMapping = {
  disabled: bool('disabled'),
  dragging: bool('dragging'),
  left: () => null,
  top: () => null,
};

export namespace ColorPickerAreaThumb {
  export type Props = ColorPickerAreaThumbProps;
  export type State = ColorPickerAreaThumbState;
}

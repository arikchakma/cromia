import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { bool } from '../utils/attrs';

type ColorPickerSwatchProps = Omit<
  React.ComponentProps<'button'>,
  'color' | 'value' | 'onSelect'
> & {
  value: string;
  selected?: boolean;
  onSelect?: (color: string) => void;
  render?: useRender.RenderProp<ColorPickerSwatch.State>;
};

type ColorPickerSwatchState = {
  selected: boolean;
  disabled: boolean;
};

const swatchStateMapping = {
  selected: bool('selected'),
  disabled: bool('disabled'),
};

export function ColorPickerSwatch(props: ColorPickerSwatch.Props) {
  const {
    value,
    selected = false,
    onSelect,
    disabled = false,
    render,
    ref,
    ...rest
  } = props;

  const handleClick = () => {
    if (disabled) {
      return;
    }

    onSelect?.(value);
  };

  const state: ColorPickerSwatch.State = { selected, disabled };

  const element = useRender({
    render,
    defaultTagName: 'button',
    ref,
    state,
    stateAttributesMapping: swatchStateMapping,
    props: mergeProps(
      {
        'data-color-picker-swatch': '',
        'data-swatch-color': value,
        type: 'button',
        role: 'radio',
        'aria-checked': selected,
        'aria-label': value,
        style: { backgroundColor: value },
        onClick: handleClick,
      },
      rest
    ),
  });

  return element;
}

export namespace ColorPickerSwatch {
  export type Props = ColorPickerSwatchProps;
  export type State = ColorPickerSwatchState;
}

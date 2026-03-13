import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

type ColorPickerSwatchGroupProps = Omit<
  React.ComponentProps<'div'>,
  'color'
> & {
  render?: useRender.RenderProp;
};

export function ColorPickerSwatchGroup(props: ColorPickerSwatchGroup.Props) {
  const { render, ref, children, ...rest } = props;

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    props: mergeProps(
      {
        'data-color-picker-swatch-group': '',
        role: 'radiogroup',
        children,
      },
      rest
    ),
  });

  return element;
}

export namespace ColorPickerSwatchGroup {
  export type Props = ColorPickerSwatchGroupProps;
}

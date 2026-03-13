import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { useColorPickerRootContext } from './color-picker-root-context';

type ColorPickerAreaBackgroundProps = Omit<
  React.ComponentProps<'div'>,
  'color'
> & {
  render?: useRender.RenderProp;
};

export function ColorPickerAreaBackground(
  props: ColorPickerAreaBackground.Props
) {
  const { render, ref, ...rest } = props;

  const { hsva } = useColorPickerRootContext();

  const hueColor = `hsl(${hsva.h}, 100%, 50%)`;

  const style = {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: hueColor,
    backgroundImage:
      'linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent)',
    '--color-picker-hue-color': hueColor,
  };

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    props: mergeProps(
      {
        'data-color-picker-area-background': '',
        style,
      },
      rest
    ),
  });

  return element;
}

export namespace ColorPickerAreaBackground {
  export type Props = ColorPickerAreaBackgroundProps;
}

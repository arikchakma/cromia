import * as React from 'react';
import { clamp } from '../utils/math';
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { rootStateAttributesMapping } from './color-picker-root';
import type { ColorPickerRoot } from './color-picker-root';
import { useColorPickerRootContext } from './color-picker-root-context';
import { useColorPickerHandlers } from '../hooks/use-color-picker-handlers';
import type { Interaction } from '../hooks/use-color-picker-handlers';

export type ColorPickerAreaProps = Omit<
  React.ComponentProps<'div'>,
  'color'
> & {
  render?: useRender.RenderProp<ColorPickerAreaState>;
};

export function ColorPickerArea(props: ColorPickerArea.Props) {
  const { render, ref, children, ...rest } = props;

  const {
    hsva,
    handleUpdateHsva,
    dragging,
    setDragging,
    disabled,
    handleColorCommitted,
  } = useColorPickerRootContext();

  const isDraggingRef = React.useRef(false);

  const onMove = (interaction: Interaction) => {
    handleUpdateHsva({
      s: interaction.left * 100,
      v: (1 - interaction.top) * 100,
    });
  };

  const onKeyDown = (offset: Interaction) => {
    handleUpdateHsva({
      s: clamp(hsva.s + offset.left * 100, [0, 100]),
      v: clamp(hsva.v - offset.top * 100, [0, 100]),
    });
    handleColorCommitted();
  };

  const onMoveStart = () => {
    isDraggingRef.current = true;
    setDragging(true);
  };

  const onMoveEnd = () => {
    isDraggingRef.current = false;
    setDragging(false);
    handleColorCommitted();
  };

  const isBusy = dragging && !isDraggingRef.current;
  const handlers = useColorPickerHandlers({
    onMove,
    onKeyDown,
    onMoveStart,
    onMoveEnd,
    disabled: disabled || isBusy,
  });

  const state: ColorPickerAreaState = { disabled, dragging };

  const element = useRender({
    render,
    defaultTagName: 'div',
    ref,
    state,
    stateAttributesMapping: rootStateAttributesMapping,
    props: mergeProps(
      {
        'data-color-picker-area': '',
        role: 'group',
        tabIndex: disabled ? undefined : 0,
        style: { touchAction: 'none', position: 'relative' },
        children,
        ...handlers,
      },
      rest
    ),
  });

  return element;
}

type ColorPickerAreaState = ColorPickerRoot.State;

export namespace ColorPickerArea {
  export type Props = ColorPickerAreaProps;
  export type State = ColorPickerAreaState;
}

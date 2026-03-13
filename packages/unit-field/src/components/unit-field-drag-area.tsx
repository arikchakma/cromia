import type { ComponentProps } from 'react';
import * as React from 'react';

import { useMergeRefs } from '~/hooks/use-merge-refs';

import { useUnitFieldContext } from './unit-field-context';

const DEFAULT_SENSITIVITY = 2;
const ESCAPE = 'Escape';
const ALLOWED_EVENT_KEYS = new Set([ESCAPE]);

type UnitFieldDragAreaProps = Pick<
  ComponentProps<'span'>,
  'children' | 'ref' | 'className' | 'style'
> & {
  sensitivity?: number;
};

export function UnitFieldDragArea(props: UnitFieldDragArea.Props) {
  const { ref, style, sensitivity = DEFAULT_SENSITIVITY, ...rest } = props;

  const {
    value,
    inputRef,
    disabled,
    isFocused,
    isDragging,
    setIsDragging,
    handleUpdateValue,
    step,
    largeStep,
    valueRef,
    handleValueCommitted,
  } = useUnitFieldContext();

  const dragAreaRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = useMergeRefs([ref, dragAreaRef]);

  const focusInput = () => {
    const inputElement = inputRef.current;
    if (!inputElement) {
      return;
    }

    inputElement.focus({ preventScroll: true });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    const isLeftButtonPressed = event.button === 0;
    const isMultiTouch =
      event.pointerType === 'touch' && event.isPrimary === false;

    const dragElement = dragAreaRef.current;
    if (!dragElement || disabled || !isLeftButtonPressed || isMultiTouch) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragElement.setPointerCapture(event.pointerId);
    focusInput();

    let nextValue = valueRef.current;

    let cumulativeMovementX = 0;
    let frameId: number | null = null;

    const applyValue = (updated: boolean = true) => {
      setIsDragging(false);

      if (!updated) {
        return;
      }

      handleUpdateValue(nextValue);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (!ALLOWED_EVENT_KEYS.has(event.key)) {
        return;
      }

      event.preventDefault();
      switch (event.key) {
        case ESCAPE:
          cleanup();
          frameId = null;
          applyValue();
          handleValueCommitted();
          break;
      }
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      const isShiftPressed = moveEvent.shiftKey;
      const finalStep = isShiftPressed ? largeStep : step;

      const { movementX } = moveEvent;
      cumulativeMovementX += movementX;

      // if the cumulative movement is greater than or equal to the sensitivity, update the value
      // basically if sensitivity is 2, the user needs to move the mouse 2 pixels to increase one step
      const shouldUpdate = Math.abs(cumulativeMovementX) >= sensitivity;
      if (!shouldUpdate) {
        return;
      }

      cumulativeMovementX = 0;
      nextValue = valueRef.current + movementX * finalStep;

      frameId = requestAnimationFrame(() => {
        handleUpdateValue(nextValue);
        setIsDragging(true);
        frameId = null;
      });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      dragElement.releasePointerCapture(upEvent.pointerId);

      cleanup();
      frameId = null;
      const updated = value !== nextValue;
      applyValue(updated);
      handleValueCommitted();
    };

    const cleanup = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('pointerup', handlePointerUp, true);
      window.removeEventListener('keydown', handleKeydown);
    };

    window.addEventListener('pointermove', handlePointerMove, true);
    window.addEventListener('pointerup', handlePointerUp, true);
    window.addEventListener('keydown', handleKeydown);
  };

  return (
    <span
      ref={mergedRef}
      role="presentation"
      tabIndex={-1}
      aria-hidden={true}
      aria-label="Drag to adjust value"
      data-disabled={disabled}
      data-dragging={isDragging}
      data-focused={isFocused}
      onPointerDown={handlePointerDown}
      style={{
        cursor: disabled ? 'default' : 'ew-resize',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        ...style,
      }}
      {...rest}
    />
  );
}

export namespace UnitFieldDragArea {
  export type Props = UnitFieldDragAreaProps;
}

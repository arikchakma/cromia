import * as React from 'react';
import { clamp } from '../utils/math';
import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  END,
  HOME,
} from '../utils/composite';

export type Interaction = {
  left: number;
  top: number;
};

type Direction = 'horizontal' | 'vertical' | '2d';

type UseColorPickerHandlersOptions = {
  onMove: (interaction: Interaction) => void;
  onKeyDown: (offset: Interaction) => void;
  onMoveStart?: () => void;
  onMoveEnd?: () => void;
  disabled?: boolean;
  direction?: Direction;
};

const STEP = 0.05;
const LARGE_STEP = 0.1;

const ALLOWED_KEYS = new Set([
  ARROW_RIGHT,
  ARROW_LEFT,
  ARROW_DOWN,
  ARROW_UP,
  HOME,
  END,
]);

export function useColorPickerHandlers(options: UseColorPickerHandlersOptions) {
  const {
    disabled,
    onMove,
    onKeyDown: onKey,
    onMoveStart,
    onMoveEnd,
    direction = '2d',
  } = options;

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) {
      return;
    }

    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);
    el.focus();

    const rect = el.getBoundingClientRect();
    onMoveStart?.();
    onMove(getRelativePosition(rect, event));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    const el = event.currentTarget;

    if (!el.hasPointerCapture(event.pointerId)) {
      return;
    }

    if (event.buttons === 0) {
      el.releasePointerCapture(event.pointerId);
      onMoveEnd?.();
      return;
    }

    const rect = el.getBoundingClientRect();
    onMove(getRelativePosition(rect, event));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    const el = event.currentTarget;
    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    onMoveEnd?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) {
      return;
    }

    if (!ALLOWED_KEYS.has(event.key)) {
      return;
    }

    const finalStep = event.shiftKey ? LARGE_STEP : STEP;
    let offset: Interaction | null = null;

    if (direction === '2d') {
      switch (event.key) {
        case ARROW_RIGHT:
          offset = { left: finalStep, top: 0 };
          break;
        case ARROW_LEFT:
          offset = { left: -finalStep, top: 0 };
          break;
        case ARROW_DOWN:
          offset = { left: 0, top: finalStep };
          break;
        case ARROW_UP:
          offset = { left: 0, top: -finalStep };
          break;
        case HOME:
          offset = { left: -1, top: -1 };
          break;
        case END:
          offset = { left: 1, top: 1 };
          break;
      }
    } else {
      // 1D: right/up increase, left/down decrease (matches WAI-ARIA slider pattern)
      const isVertical = direction === 'vertical';
      const increase = (s: number): Interaction =>
        isVertical ? { left: 0, top: -s } : { left: s, top: 0 };
      const decrease = (s: number): Interaction =>
        isVertical ? { left: 0, top: s } : { left: -s, top: 0 };

      switch (event.key) {
        case ARROW_RIGHT:
        case ARROW_UP:
          offset = increase(finalStep);
          break;
        case ARROW_LEFT:
        case ARROW_DOWN:
          offset = decrease(finalStep);
          break;
        case HOME:
          offset = decrease(1);
          break;
        case END:
          offset = increase(1);
          break;
      }
    }

    if (!offset) {
      return;
    }

    event.preventDefault();
    onKey(offset);
  };

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onKeyDown: handleKeyDown,
  };
}

function getRelativePosition(
  rect: DOMRect,
  event: React.PointerEvent
): Interaction {
  return {
    left: clamp((event.clientX - rect.left) / rect.width, [0, 1]),
    top: clamp((event.clientY - rect.top) / rect.height, [0, 1]),
  };
}

import type { ComponentProps } from 'react';
import * as React from 'react';

import { useMergeRefs } from '~/hooks/use-merge-refs';
import {
  ARROW_DOWN,
  ARROW_UP,
  COMPOSITE_KEYS,
  END,
  ENTER,
  HOME,
  PAGE_DOWN,
  PAGE_UP,
  SHIFT,
} from '~/utils/composite';

import { useUnitFieldContext } from './unit-field-context';

const ALLOWED_EVENT_KEYS = new Set([
  ARROW_UP,
  ARROW_DOWN,
  ENTER,
  SHIFT,
  HOME,
  END,
  PAGE_UP,
  PAGE_DOWN,
]);

type UnitFieldInputProps = Pick<
  ComponentProps<'input'>,
  'ref' | 'className' | 'aria-label' | 'aria-describedby'
>;

export function UnitFieldInput(props: UnitFieldInput.Props) {
  const { ref, ...rest } = props;

  const {
    max,
    min,
    step,
    parse,
    value,
    format,
    inputRef,
    disabled,
    isFocused,
    largeStep,
    isDragging,
    setIsFocused,
    internalValue,
    handleUpdateValue,
    setInternalValue,
    displayValue,
    valueRef,
    id: inputId,
    handleValueCommitted,
  } = useUnitFieldContext();

  const selectInput = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    queueMicrotask(() => {
      input.select();
    });
  };

  const blurInput = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.blur();
    setInternalValue(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInternalValue(value);
  };

  const handleFocus = (_event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    selectInput();
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const value = event.currentTarget.value;
    if (displayValue === value) {
      // Value hasn't changed from displayValue, keep it as-is
      // Just clean up internal state without parsing
      setInternalValue(null);
      return;
    }

    handleUpdateValue(value);
    handleValueCommitted();
    blurInput();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    const inputElement = inputRef.current;
    const isAllowedKey = ALLOWED_EVENT_KEYS.has(event.key);
    if (!isAllowedKey || !inputElement) {
      return;
    }

    if (COMPOSITE_KEYS.has(event.key)) {
      event.stopPropagation();
    }

    const lastValue = valueRef.current;
    const currentValue = internalValue
      ? (parse(internalValue) ?? lastValue)
      : lastValue;
    const isShiftPressed = event.shiftKey;
    const finalStep = isShiftPressed ? largeStep : step;

    let newValue: number | null = null;
    let shouldBlur = false;
    let shouldSelect = true;

    switch (event.key) {
      case ARROW_UP:
        newValue = currentValue + finalStep;
        break;
      case ARROW_DOWN:
        newValue = currentValue - finalStep;
        break;
      case HOME:
        newValue = min;
        break;
      case END:
        newValue = max;
        break;
      case PAGE_UP:
        newValue = currentValue + largeStep;
        break;
      case PAGE_DOWN:
        newValue = currentValue - largeStep;
        break;
      case ENTER:
        shouldBlur = true;
        shouldSelect = false;
        break;
      default:
        shouldSelect = false;
        break;
    }

    if (newValue !== null) {
      handleUpdateValue(newValue);
      handleValueCommitted();
      event.preventDefault();
    }

    if (shouldBlur) {
      blurInput();
    } else if (shouldSelect) {
      selectInput();
    }
  };

  const mergedRef = useMergeRefs([ref, inputRef]);

  const finalValue = React.useMemo(() => {
    if (internalValue !== null) {
      return internalValue;
    }

    return displayValue ?? format(value);
  }, [internalValue, displayValue, format, value]);

  return (
    <input
      id={inputId}
      type="text"
      aria-roledescription="Unit Field"
      ref={mergedRef}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      value={finalValue}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      data-dragging={isDragging}
      data-focused={isFocused}
      data-disabled={disabled}
      disabled={disabled}
      {...rest}
    />
  );
}

export namespace UnitFieldInput {
  export type Props = UnitFieldInputProps;
}

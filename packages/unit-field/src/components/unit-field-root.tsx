import * as React from 'react';

import { useValueAsRef } from '~/hooks/use-value-as-ref';
import { IS_PRODUCTION, UNIT_FIELD_NAMESPACE } from '~/utils/constants';
import { noop } from '~/utils/function';
import { clamp } from '~/utils/math';

import { UnitFieldContext } from './unit-field-context';

export const DEFAULT_MIN = Number.MIN_SAFE_INTEGER;
export const DEFAULT_MAX = Number.MAX_SAFE_INTEGER;
export const DEFAULT_STEP = 1;
export const DEFAULT_LARGE_STEP = 10;

export const DEFAULT_FORMAT = (value: number) => {
  return String(value);
};

export const DEFAULT_PARSE = (value: string) => {
  return parseInt(value);
};

type UnitFieldRootProps = React.ComponentProps<'div'> &
  Partial<
    Pick<
      UnitFieldContext.Props,
      | 'disabled'
      | 'step'
      | 'largeStep'
      | 'min'
      | 'max'
      | 'value'
      | 'format'
      | 'parse'
      | 'displayValue'
    >
  > & {
    onValueChange?: (value: number) => void;
    onValueCommitted?: (value: number) => void;
    defaultValue?: number;
  };

export function UnitFieldRoot(props: UnitFieldRoot.Props) {
  const {
    min,
    max,
    step = DEFAULT_STEP,
    parse = DEFAULT_PARSE,
    format = DEFAULT_FORMAT,
    disabled = false,
    onValueChange = noop,
    onValueCommitted = noop,
    defaultValue,
    value: controlledValue,
    largeStep = DEFAULT_LARGE_STEP,
    id: idProp,
    displayValue,
    ...rest
  } = props;

  const minWithDefault = min ?? Number.MIN_SAFE_INTEGER;
  const maxWithDefault = max ?? Number.MAX_SAFE_INTEGER;
  const minWithZeroDefault = min ?? 0;
  const displayValueWithDefault = displayValue ?? null;

  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? minWithZeroDefault
  );

  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const value = controlledValue ?? uncontrolledValue;
  const setValue = (nextValue: number) => {
    onValueChange(nextValue);
    setUncontrolledValue(nextValue);
  };

  const valueRef = useValueAsRef(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | null>(null);

  const handleUpdateValue = (nextValue: number | string) => {
    if (typeof nextValue === 'string') {
      nextValue = parse(nextValue) ?? valueRef.current;
    }

    const clampedValue = clamp(nextValue, [minWithDefault, maxWithDefault]);
    setValue(clampedValue);
    valueRef.current = clampedValue;
    setInternalValue(null);
  };

  const handleValueCommitted = () => {
    const value = valueRef.current;
    onValueCommitted(value);
  };

  if (!IS_PRODUCTION) {
    if (minWithDefault >= maxWithDefault) {
      console.warn(
        `${UNIT_FIELD_NAMESPACE}: UnitField 'max' must be greater than 'min'.`
      );
    }
  }

  const contextValue: UnitFieldContext.Props = React.useMemo(
    () => ({
      min: minWithDefault,
      max: maxWithDefault,
      step,
      parse,
      value,
      format,
      inputRef,
      id,
      disabled,
      setValue,
      isFocused,
      largeStep,
      isDragging,
      setIsFocused,
      internalValue,
      setIsDragging,
      handleUpdateValue,
      setInternalValue,
      displayValue: displayValueWithDefault,
      valueRef,
      handleValueCommitted,
    }),
    [
      minWithDefault,
      maxWithDefault,
      step,
      parse,
      value,
      format,
      inputRef,
      disabled,
      setValue,
      isFocused,
      largeStep,
      isDragging,
      setIsFocused,
      internalValue,
      setIsDragging,
      handleUpdateValue,
      setInternalValue,
      displayValueWithDefault,
      valueRef,
      id,
      handleValueCommitted,
    ]
  );

  return (
    <UnitFieldContext.Provider value={contextValue}>
      <div
        data-dragging={isDragging}
        data-focused={isFocused}
        data-disabled={disabled}
        role="group"
        {...rest}
      />
    </UnitFieldContext.Provider>
  );
}

export namespace UnitFieldRoot {
  export type Props = UnitFieldRootProps;
}

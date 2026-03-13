import * as React from 'react';

import { UNIT_FIELD_NAMESPACE } from '~/utils/constants';

type UnitFieldContext = {
  disabled: boolean;

  step: number;
  largeStep: number;

  min: number;
  max: number;

  value: number;
  setValue: (value: number) => void;
  valueRef: React.RefObject<number>;

  internalValue: string | null;
  setInternalValue: React.Dispatch<React.SetStateAction<string | null>>;
  displayValue: string | null;

  inputRef: React.RefObject<HTMLInputElement | null>;

  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;

  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;

  handleUpdateValue: (value: number | string) => void;
  handleValueCommitted: () => void;

  format: (value: number) => string;
  parse: (value: string) => number | null;

  id: string;
};

export const UnitFieldContext = React.createContext<UnitFieldContext | null>(
  null
);

export function useUnitFieldContext() {
  const context = React.useContext(UnitFieldContext);
  if (!context) {
    throw new Error(
      `${UNIT_FIELD_NAMESPACE}: UnitFieldContext is missing. Unit Field parts must be placed within <UnitField.Root>.`
    );
  }

  return context;
}

export namespace UnitFieldContext {
  export type Props = UnitFieldContext;
}

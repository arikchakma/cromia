import * as React from 'react';

import type { HsvaColor } from '../utils/color';
import { CROMIA_NAMESPACE } from '../utils/constants';

type ColorPickerRootContext = {
  hsva: HsvaColor;
  handleUpdateHsva: (partial: Partial<HsvaColor>) => void;

  dragging: boolean;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;

  disabled: boolean;

  handleColorCommitted: () => void;
};

export const ColorPickerRootContext =
  React.createContext<ColorPickerRootContext | null>(null);

export function useColorPickerRootContext() {
  const context = React.useContext(ColorPickerRootContext);
  if (!context) {
    throw new Error(
      `${CROMIA_NAMESPACE}: ColorPickerRootContext is missing. Cromia parts must be placed within <Cromia.Root>.`
    );
  }
  return context;
}

export namespace ColorPickerRootContext {
  export type Props = ColorPickerRootContext;
}

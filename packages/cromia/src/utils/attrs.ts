/**
 * Factory for boolean state-to-data-attribute mappers.
 * Usage: `disabled: boolAttr('disabled')` → `data-disabled=""` when true, omitted when false.
 */
export const bool = (name: string) => {
  return (value: boolean) => (value ? { [`data-${name}`]: '' } : null);
};

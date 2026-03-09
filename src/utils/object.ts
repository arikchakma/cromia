export function isObjectDeepEqual(first: object, second: object): boolean {
  const keysA = Object.keys(first);
  const keysB = Object.keys(second);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    const a = (first as Record<string, unknown>)[key];
    const b = (second as Record<string, unknown>)[key];

    if (
      typeof a === 'object' &&
      a !== null &&
      typeof b === 'object' &&
      b !== null
    ) {
      if (!isObjectDeepEqual(a, b)) {
        return false;
      }
    } else if (a !== b) {
      return false;
    }
  }

  return true;
}

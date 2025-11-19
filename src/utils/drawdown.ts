interface NumericBuffer {
  at(index: number): number | undefined;
  size(): number;
}

function calculateMovement(
  buffer: NumericBuffer,
  isPeak: boolean,
  isRelative: boolean
): number {
  let initial = buffer.at(0) ?? 0;
  let startIndex = 0;

  // For relative calculations, skip initial zeros to find first non-zero value
  if (isRelative) {
    while (initial === 0 && startIndex < buffer.size() - 1) {
      startIndex++;
      initial = buffer.at(startIndex) ?? 0;
    }
    if (initial === 0) return 0; // All values are zero
  }

  let extremum = initial;
  let result = 0;

  for (let i = startIndex + 1; i < buffer.size(); i++) {
    const value = buffer.at(i) ?? 0;
    const updateExtremum = isPeak ? value > extremum : value < extremum;

    if (updateExtremum) {
      extremum = value;
    } else {
      const diff = value - extremum;
      const movement = isRelative && extremum !== 0 ? diff / extremum : diff;
      result = isPeak ? Math.min(result, movement) : Math.max(result, movement);
    }
  }

  return result;
}

/**
 * Calculates the maximum absolute drawdown (peak to trough decline) in a numeric buffer.
 * @param buffer - The numeric buffer to analyze
 * @returns The maximum absolute drawdown value
 */
export function maxDrawDown(buffer: NumericBuffer): number {
  return calculateMovement(buffer, true, false);
}

/**
 * Calculates the maximum relative drawdown (peak to trough decline as percentage) in a numeric buffer.
 * @param buffer - The numeric buffer to analyze
 * @returns The maximum relative drawdown value as a percentage
 */
export function maxRelDrawDown(buffer: NumericBuffer): number {
  return calculateMovement(buffer, true, true);
}

/**
 * Calculates the maximum absolute drawup (trough to peak increase) in a numeric buffer.
 * @param buffer - The numeric buffer to analyze
 * @returns The maximum absolute drawup value
 */
export function maxDrawUp(buffer: NumericBuffer): number {
  return calculateMovement(buffer, false, false);
}

/**
 * Calculates the maximum relative drawup (trough to peak increase as percentage) in a numeric buffer.
 * @param buffer - The numeric buffer to analyze
 * @returns The maximum relative drawup value as a percentage
 */
export function maxRelDrawUp(buffer: NumericBuffer): number {
  return calculateMovement(buffer, false, true);
}

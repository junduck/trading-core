export interface NumericBuffer {
  at(index: number): number | undefined;
  length: number;
}

/**
 * QuickSelect algorithm to find the nth smallest element.
 * Partially sorts array so that element at position n is correct.
 * @internal
 */
export function nth_element(
  arr: number[],
  left: number,
  right: number,
  n: number
): number {
  while (left < right - 1) {
    const pivot = arr[midpoint(left, right)]!;

    let i = left;
    let j = right - 1;

    while (i <= j) {
      while (arr[i]! < pivot) i++;
      while (arr[j]! > pivot) j--;
      if (i <= j) {
        const tmp = arr[i]!;
        arr[i] = arr[j]!;
        arr[j] = tmp;
        i++;
        j--;
      }
    }

    if (n <= j) {
      right = j + 1;
    } else if (n >= i) {
      left = i;
    } else {
      return arr[n]!;
    }
  }

  return arr[left]!;
}

/** Greatest common divisor using Euclidean algorithm. */
export function gcd(m: number, n: number): number {
  m = Math.abs(m);
  n = Math.abs(n);
  while (n !== 0) {
    const t = n;
    n = m % n;
    m = t;
  }
  return m;
}

/** Least common multiple. */
export function lcm(m: number, n: number): number {
  if (m === 0 || n === 0) return 0;
  return Math.abs(m * n) / gcd(m, n);
}

/** Midpoint index, avoiding overflow. */
export function midpoint(idxa: number, idxb?: number): number {
  if (idxb === undefined) {
    return Math.floor(idxa / 2);
  } else {
    return Math.floor(idxa + (idxb - idxa) / 2);
  }
}

/** Linear interpolation between a and b. */
export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/** Inverse linear interpolation: find t such that lerp(a, b, t) = v. */
export function invLerp(a: number, b: number, v: number): number {
  return (v - a) / (b - a);
}

/** Remap value from [inMin, inMax] to [outMin, outMax]. */
export function remap(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return lerp(outMin, outMax, invLerp(inMin, inMax, v));
}

/** Clamp value to [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

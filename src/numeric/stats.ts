import { Kahan } from "../utils/accum.js";
import { lerp, nth_element } from "./utils.js";

/**
 * M2 utility for internal use.
 * @internal
 */
export function _m2(x: number[]): { m: number; m2: number } {
  let m = 0;
  let m2 = 0;
  for (let i = 0; i < x.length; i++) {
    const delta = x[i]! - m;
    m += delta / (i + 1);
    m2 += delta * (x[i]! - m);
  }
  return { m, m2 };
}

/**
 * Arithmetic mean of array.
 * @group Numeric Utilities - Statistics
 */
export function mean(x: number[]): number {
  const n = x.length;
  if (n === 0) return NaN;
  let m = 0;
  for (let i = 0; i < n; i++) {
    m += (x[i]! - m) / (i + 1);
  }
  return m;
}

/**
 * Variance of array.
 * @param ddof - Delta degrees of freedom. Use 0 for population variance, 1 for sample variance.
 * @group Numeric Utilities - Statistics
 */
export function variance(x: number[], ddof: number = 0): number {
  const n = x.length;
  if (n <= ddof) return NaN;
  const { m2 } = _m2(x);
  return m2 / (n - ddof);
}

/**
 * Standard deviation of array.
 * @param ddof - Delta degrees of freedom. Use 0 for population, 1 for sample.
 * @group Numeric Utilities - Statistics
 */
export function stddev(x: number[], ddof: number = 0): number {
  return Math.sqrt(variance(x, ddof));
}

/**
 * Sample skewness coefficient (g1).
 * @group Numeric Utilities - Statistics
 */
export function skew(x: number[]): number {
  const n = x.length;
  const { m, m2 } = _m2(x);
  const v = m2 / n;
  if (v === 0) return NaN;
  const k = new Kahan();
  for (let i = 0; i < n; i++) {
    const d = x[i]! - m;
    k.accum(d * d * d);
  }
  const m3 = k.val / n;
  return m3 / Math.pow(v, 1.5);
}

/**
 * Excess kurtosis (Fisher's definition, normal distribution = 0).
 * @group Numeric Utilities - Statistics
 */
export function kurt(x: number[]): number {
  const n = x.length;
  const { m, m2 } = _m2(x);
  const v = m2 / n;
  if (v === 0) return NaN;
  const k = new Kahan();
  for (let i = 0; i < n; i++) {
    const d = x[i]! - m;
    const d2 = d * d;
    k.accum(d2 * d2);
  }
  const m4 = k.val / n;
  return m4 / (v * v) - 3;
}

/**
 * Covariance between two series.
 * @param ddof - Delta degrees of freedom.
 * @group Numeric Utilities - Statistics
 */
export function cov(x: number[], y: number[], ddof: number = 0): number {
  const n = x.length;
  if (n !== y.length || n <= ddof) return NaN;
  let mx = 0;
  let my = 0;
  let mxy = 0;
  for (let i = 0; i < n; i++) {
    const a = 1 / (i + 1);
    const dy = y[i]! - my;
    mx += (x[i]! - mx) * a;
    my += dy * a;
    mxy += (x[i]! - mx) * dy;
  }
  return mxy / (n - ddof);
}

/**
 * Pearson correlation coefficient.
 * @group Numeric Utilities - Statistics
 */
export function corr(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return NaN;
  let mx = 0;
  let my = 0;
  let mxy = 0;
  let m2x = 0;
  let m2y = 0;
  for (let i = 0; i < n; i++) {
    const a = 1 / (i + 1);
    const dx = x[i]! - mx;
    const dy = y[i]! - my;
    mx += dx * a;
    my += dy * a;
    mxy += (x[i]! - mx) * dy;
    m2x += (x[i]! - mx) * dx;
    m2y += (y[i]! - my) * dy;
  }
  const denom = Math.sqrt(m2x * m2y);
  return denom === 0 ? 0 : mxy / denom;
}

/**
 * Median value. Mutates a copy of input array.
 * @group Numeric Utilities - Statistics
 */
export function median(x: number[]): number {
  const n = x.length;
  if (n === 0) return NaN;
  const arr = x.slice();
  const mid = Math.floor(n / 2);
  if (n % 2 === 1) {
    return nth_element(arr, 0, n, mid);
  }
  const a = nth_element(arr, 0, n, mid - 1);
  let b = arr[mid]!;
  for (let i = mid + 1; i < n; i++) {
    if (arr[i]! < b) b = arr[i]!;
  }
  return (a + b) / 2;
}

/**
 * Quantile using linear interpolation. Mutates a copy of input array.
 * @group Numeric Utilities - Statistics
 */
export function quantile(x: number[], q: number): number {
  const n = x.length;
  if (n === 0 || q < 0 || q > 1) return NaN;
  if (n === 1) return x[0]!;
  const arr = x.slice();
  const pos = q * (n - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) {
    return nth_element(arr, 0, n, lo);
  }
  const a = nth_element(arr, 0, n, lo);
  const b = nth_element(arr, lo, n, hi);
  return lerp(a, b, pos - lo);
}

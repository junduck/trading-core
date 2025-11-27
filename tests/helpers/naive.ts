/**
 * Naive implementations of statistical functions for testing purposes.
 * These implementations use straightforward formulas without optimizations.
 */

/**
 * Generate exponential weights for a window of size n.
 * Weights decay exponentially with alpha as the decay factor.
 * Index 0 is the oldest observation (smallest weight).
 * Index n-1 is the newest observation (largest weight).
 *
 * Formula: weight[i] = alpha^(n-1-i) / sum(alpha^k for k=0 to n-1)
 *
 * @param n Window size
 * @param alpha Decay factor (0 < alpha <= 1)
 * @returns Array of normalized exponential weights summing to 1
 */
export function naiveExpWeights(n: number, alpha: number): number[] {
  if (n <= 0) return [];
  if (alpha <= 0) return [];

  const weights: number[] = new Array(n);
  let sum = 0;

  for (let i = 0; i < n; i++) {
    weights[i] = Math.pow(alpha, n - 1 - i);
    sum += weights[i];
  }

  for (let i = 0; i < n; i++) {
    weights[i] /= sum;
  }

  return weights;
}

/**
 * Calculate the arithmetic mean of an array of numbers.
 *
 * @param x Array of numbers
 * @returns The arithmetic mean
 */
export function naiveMean(x: number[]): number {
  const n = x.length;
  if (n === 0) return NaN;

  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += x[i];
  }

  return sum / n;
}

/**
 * Calculate the weighted mean of an array of numbers.
 * Formula: sum(x * w) / sum(w)
 *
 * @param x Array of numbers
 * @param w Array of weights
 * @returns The weighted mean
 */
export function naiveWeightedMean(x: number[], w: number[]): number {
  const n = x.length;
  if (n === 0 || n !== w.length) return NaN;

  let sumXW = 0;
  let sumW = 0;

  for (let i = 0; i < n; i++) {
    sumXW += x[i] * w[i];
    sumW += w[i];
  }

  if (sumW === 0) return NaN;

  return sumXW / sumW;
}

/**
 * Calculate the variance of an array of numbers.
 *
 * @param x Array of numbers
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @returns The variance
 */
export function naiveVariance(x: number[], ddof: number = 0): number {
  const n = x.length;
  if (n <= ddof) return NaN;

  const mean = naiveMean(x);

  let sumSquaredDiff = 0;
  for (let i = 0; i < n; i++) {
    const diff = x[i] - mean;
    sumSquaredDiff += diff * diff;
  }

  return sumSquaredDiff / (n - ddof);
}

/**
 * Calculate the weighted variance of an array of numbers.
 *
 * Weight interpretation for ddof=1 (sample variance):
 * - 'frequency': sum(w) * (n-1)/n (treats weights as frequency counts)
 * - 'reliability': sum(w) - sum(w²)/sum(w) (treats weights as reliability measures)
 * - 'simple': sum(w) - 1 (simple Bessel correction)
 *
 * @param x Array of numbers
 * @param w Array of weights
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @param weightType Weight interpretation method (only applies when ddof=1)
 * @returns The weighted variance
 */
export function naiveWeightedVariance(
  x: number[],
  w: number[],
  ddof: number = 0,
  weightType: "frequency" | "reliability" | "simple" = "frequency"
): number {
  const n = x.length;
  if (n === 0 || n !== w.length) return NaN;

  const weightedMean = naiveWeightedMean(x, w);

  let sumWeightedSquaredDiff = 0;
  let sumW = 0;
  let sumW2 = 0;

  for (let i = 0; i < n; i++) {
    const diff = x[i] - weightedMean;
    sumWeightedSquaredDiff += w[i] * diff * diff;
    sumW += w[i];
    sumW2 += w[i] * w[i];
  }

  if (sumW === 0) return NaN;

  let denominator: number;
  if (ddof === 0) {
    denominator = sumW;
  } else if (ddof === 1) {
    if (weightType === "frequency") {
      denominator = (sumW * (n - 1)) / n;
    } else if (weightType === "reliability") {
      denominator = sumW - sumW2 / sumW;
    } else {
      denominator = sumW - 1;
    }
  } else {
    return NaN;
  }

  return sumWeightedSquaredDiff / denominator;
}

/**
 * Calculate the standard deviation of an array of numbers.
 * Formula: sqrt(variance)
 *
 * @param x Array of numbers
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @returns The standard deviation
 */
export function naiveStddev(x: number[], ddof: number = 0): number {
  return Math.sqrt(naiveVariance(x, ddof));
}

/**
 * Calculate the weighted standard deviation of an array of numbers.
 * Formula: sqrt(weighted variance)
 *
 * @param x Array of numbers
 * @param w Array of weights
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @param weightType Weight interpretation method (only applies when ddof=1)
 * @returns The weighted standard deviation
 */
export function naiveWeightedStddev(
  x: number[],
  w: number[],
  ddof: number = 0,
  weightType: "frequency" | "reliability" | "simple" = "frequency"
): number {
  return Math.sqrt(naiveWeightedVariance(x, w, ddof, weightType));
}

/**
 * Calculate the covariance between two arrays of numbers.
 *
 * @param x First array of numbers
 * @param y Second array of numbers
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @returns The covariance
 */
export function naiveCovariance(
  x: number[],
  y: number[],
  ddof: number = 0
): number {
  const n = x.length;
  if (n === 0 || n !== y.length || n <= ddof) return NaN;

  const meanX = naiveMean(x);
  const meanY = naiveMean(y);

  let sumProduct = 0;
  for (let i = 0; i < n; i++) {
    sumProduct += (x[i] - meanX) * (y[i] - meanY);
  }

  return sumProduct / (n - ddof);
}

/**
 * Calculate the weighted covariance between two arrays of numbers.
 *
 * Weight interpretation for ddof=1 (sample covariance):
 * - 'frequency': sum(w) * (n-1)/n (treats weights as frequency counts)
 * - 'reliability': sum(w) - sum(w²)/sum(w) (treats weights as reliability measures)
 * - 'simple': sum(w) - 1 (simple Bessel correction)
 *
 * @param x First array of numbers
 * @param y Second array of numbers
 * @param w Array of weights (same weight applies to corresponding xi, yi pair)
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @param weightType Weight interpretation method (only applies when ddof=1)
 * @returns The weighted covariance
 */
export function naiveWeightedCovariance(
  x: number[],
  y: number[],
  w: number[],
  ddof: number = 0,
  weightType: "frequency" | "reliability" | "simple" = "frequency"
): number {
  const n = x.length;
  if (n === 0 || n !== y.length || n !== w.length) return NaN;

  const weightedMeanX = naiveWeightedMean(x, w);
  const weightedMeanY = naiveWeightedMean(y, w);

  let sumWeightedProduct = 0;
  let sumW = 0;
  let sumW2 = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - weightedMeanX;
    const diffY = y[i] - weightedMeanY;
    sumWeightedProduct += w[i] * diffX * diffY;
    sumW += w[i];
    sumW2 += w[i] * w[i];
  }

  if (sumW === 0) return NaN;

  let denominator: number;
  if (ddof === 0) {
    denominator = sumW;
  } else if (ddof === 1) {
    if (weightType === "frequency") {
      denominator = (sumW * (n - 1)) / n;
    } else if (weightType === "reliability") {
      denominator = sumW - sumW2 / sumW;
    } else {
      denominator = sumW - 1;
    }
  } else {
    return NaN;
  }

  return sumWeightedProduct / denominator;
}

/**
 * Calculate the Pearson correlation coefficient between two arrays.
 * Formula: cov(x, y) / (stddev(x) * stddev(y))
 *
 * @param x First array of numbers
 * @param y Second array of numbers
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @returns The correlation coefficient (range: -1 to 1)
 */
export function naiveCorrelation(
  x: number[],
  y: number[],
  ddof: number = 0
): number {
  const cov = naiveCovariance(x, y, ddof);
  const stdX = naiveStddev(x, ddof);
  const stdY = naiveStddev(y, ddof);

  if (stdX === 0 || stdY === 0) return NaN;

  return cov / (stdX * stdY);
}

/**
 * Calculate the weighted Pearson correlation coefficient between two arrays.
 * Formula: weighted_cov(x, y, w) / (weighted_stddev(x, w) * weighted_stddev(y, w))
 *
 * @param x First array of numbers
 * @param y Second array of numbers
 * @param w Array of weights (same weight applies to corresponding xi, yi pair)
 * @param ddof Delta degrees of freedom (0 for population, 1 for sample)
 * @param weightType Weight interpretation method (only applies when ddof=1)
 * @returns The weighted correlation coefficient (range: -1 to 1)
 */
export function naiveWeightedCorrelation(
  x: number[],
  y: number[],
  w: number[],
  ddof: number = 0,
  weightType: "frequency" | "reliability" | "simple" = "frequency"
): number {
  const cov = naiveWeightedCovariance(x, y, w, ddof, weightType);
  const stdX = naiveWeightedStddev(x, w, ddof, weightType);
  const stdY = naiveWeightedStddev(y, w, ddof, weightType);

  if (stdX === 0 || stdY === 0) return NaN;

  return cov / (stdX * stdY);
}

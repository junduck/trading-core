export type { NumericBuffer } from "./numeric/utils.js";

export {
  gcd,
  lcm,
  midpoint,
  lerp,
  invLerp,
  remap,
  clamp,
  normalPDF,
  invNormalCDF,
} from "./numeric/utils.js";

export { sum, min, max, argmin, argmax } from "./numeric/array.js";

export {
  norm,
  sign,
  cumsum,
  diff,
  pctChange,
  returns,
  logReturns,
  lag,
  lead,
  coalesce,
  locf,
  winsorize,
} from "./numeric/series.js";

export {
  mean,
  variance,
  stddev,
  skew,
  kurt,
  cov,
  corr,
  median,
  quantile,
} from "./numeric/stats.js";

export { argsort, rank, spearman } from "./numeric/rank.js";

export {
  historicalCVaR,
  parametricCVaR,
  expWeightedCVaR,
} from "./numeric/CVaR.js";

export {
  maxDrawDown,
  maxRelDrawDown,
  maxDrawUp,
  maxRelDrawUp,
} from "./numeric/drawdown.js";

export type { DrawdownResult } from "./numeric/drawdown.js";

export {
  sharpe,
  sortino,
  calmar,
  winRate,
  gainLoss,
  expectancy,
  profitFactor,
} from "./numeric/metrics.js";

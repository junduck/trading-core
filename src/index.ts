// Export all types
export type {
  Asset,
  Portfolio,
  LongPositionLot,
  LongPosition,
  ShortPositionLot,
  ShortPosition,
  Position,
  CloseStrategy,
  Universe,
  MarketSnapshot,
  MarketQuote,
  MarketBarInterval,
  MarketBar,
  OrderType,
  OrderStatus,
  OrderAction,
  OrderSide,
  PositionEffect,
  Order,
  OrderState,
  Fill,
} from "./types/index.js";

// Export all utility functions and types
export {
  pu,
  createUniverse,
  appraisePosition,
  appraisePortfolio,
  calculateUnrealizedPnL,
  calculateUnrealisedPnL,
  isAssetValidAt,
  updateSnapshotQuote,
  updateSnapshotBar,
  validatePosition,
  pushLongPositionLot,
  amendLongPositionLot,
  pushShortPositionLot,
  amendShortPositionLot,
  openLong,
  closeLong,
  openShort,
  closeShort,
  getAverageCost,
  getAverageProceeds,
  handleSplit,
  handleCashDividend,
  handleSpinoff,
  handleMerger,
  handleHardFork,
  handleAirdrop,
  handleTokenSwap,
  handleStakingReward,
  validateOrder,
  applyFill,
  applyFills,
  create,
  hasAsset,
  getPosition,
  getCash,
  getCurrencies,
  getAllSymbols,
  createPosition,
  getOrSetPosition,
  portfolioOpenLong,
  portfolioCloseLong,
  portfolioOpenShort,
  portfolioCloseShort,
  portfolioHandleSplit,
  portfolioHandleCashDividend,
  portfolioHandleSpinoff,
  portfolioHandleMerger,
  portfolioHandleHardFork,
  portfolioHandleAirdrop,
  portfolioHandleTokenSwap,
  portfolioHandleStakingReward,
} from "./utils/index.js";

// Export types from utils
export type {
  OrderValidationError,
  OrderValidationResult,
  ApplyFillResult,
} from "./utils/index.js";

// Export containers
export { CircularBuffer } from "./containers/circular-buffer.js";
export { Deque } from "./containers/deque.js";
export { PriorityQueue } from "./containers/priority-queue.js";
export { RBTree } from "./containers/rbtree.js";

// Export online statistics
export { CMA } from "./online/average.js";
export { CountMinSketch, BloomFilter } from "./online/probs.js";
export { CuVar, CuStddev, CuCov, CuCorr, CuBeta } from "./online/stats.js";
export { CuSkew, CuKurt } from "./online/moments.js";
export { CuHistogram } from "./online/histogram.js";

// Export rolling statistics
export { RollingSum, SMA, EMA, EWMA } from "./rolling/average.js";
export {
  RollingVar,
  RollingVarEW,
  RollingStddev,
  RollingStddevEW,
  RollingZScore,
  RollingZScoreEW,
  RollingCov,
  RollingCovEW,
  RollingCorr,
  RollingCorrEW,
  RollingBeta,
  RollingBetaEW,
} from "./rolling/stats.js";
export {
  RollingMin,
  RollingMax,
  RollingMinMax,
  RollingArgMin,
  RollingArgMax,
  RollingArgMinMax,
} from "./rolling/minmax.js";
export { RollingMedian, RollingQuantile } from "./rolling/rank.js";
export { RollingSkew, RollingKurt } from "./rolling/moments.js";
export { RollingHistogram } from "./rolling/histogram.js";

// Export drawdown utilities
export {
  maxDrawDown,
  maxRelDrawDown,
  maxDrawUp,
  maxRelDrawUp,
} from "./utils/drawdown.js";

// Export accumulators
export {
  Kahan,
  SmoothedAccum,
  exp_factor,
  wilders_factor,
} from "./utils/accum.js";

// Export numeric utilities
export type { NumericBuffer } from "./numeric/utils.js";
export {
  gcd,
  lcm,
  midpoint,
  lerp,
  invLerp,
  remap,
  clamp,
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

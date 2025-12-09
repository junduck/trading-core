// Portfolio
export type { Portfolio } from "./types/portfolio.js";

export {
  create,
  hasAsset,
  getPosition,
  getCash,
  getCurrencies,
  getAllSymbols,
  getOrSetPosition,
  openLong as portfolioOpenLong,
  closeLong as portfolioCloseLong,
  openShort as portfolioOpenShort,
  closeShort as portfolioCloseShort,
  createPosition as portfolioCreatePosition,
  handleSplit as portfolioHandleSplit,
  handleCashDividend as portfolioHandleCashDividend,
  handleSpinoff as portfolioHandleSpinoff,
  handleMerger as portfolioHandleMerger,
  handleHardFork as portfolioHandleHardFork,
  handleAirdrop as portfolioHandleAirdrop,
  handleTokenSwap as portfolioHandleTokenSwap,
  handleStakingReward as portfolioHandleStakingReward,
} from "./utils/portfolio.utils.js";

// Position
export type {
  LongPositionLot,
  LongPosition,
  ShortPositionLot,
  ShortPosition,
  Position,
} from "./types/position.js";

export type { CloseStrategy } from "./types/trade.js";

export {
  createPosition,
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
  q,
} from "./utils/position.utils.js";

export {
  handleSplit,
  handleCashDividend,
  handleSpinoff,
  handleMerger,
} from "./utils/stock.utils.js";

export {
  handleHardFork,
  handleAirdrop,
  handleTokenSwap,
  handleStakingReward,
} from "./utils/crypto.utils.js";

export {
  fillOrder,
  processFill,
  applyFill,
  applyFills,
} from "./utils/fill.utils.js";

export type { ApplyFillResult } from "./utils/fill.utils.js";

// Market Data
export type { Asset } from "./types/asset.js";

export type {
  Universe,
  MarketSnapshot,
  MarketQuote,
  MarketBarInterval,
  MarketBar,
} from "./types/market.js";

export {
  createUniverse,
  appraisePosition,
  appraisePortfolio,
  calculateUnrealizedPnL,
  calculateUnrealisedPnL,
  isAssetValidAt,
  updateSnapshotQuote,
  updateSnapshotBar,
} from "./utils/market.utils.js";

// Order Management
export type {
  OrderType,
  OrderStatus,
  OrderAction,
  OrderSide,
  PositionEffect,
  Order,
  OrderState,
  PartialOrder,
  Fill,
  FillEffect,
} from "./types/order.js";

export { validateOrder } from "./utils/order.validation.js";

export type {
  OrderValidationError,
  OrderValidationResult,
} from "./utils/order.validation.js";

export {
  type OrderOpts,
  buyOrder,
  sellOrder,
  shortOrder,
  coverOrder,
  acceptOrder,
  rejectOrder,
  cancelOrder,
} from "./utils/order.utils.js";

// Data Structures
export { CircularBuffer } from "./containers/circular-buffer.js";
export { BlockQueue } from "./containers/block-queue.js";
export { Deque } from "./containers/deque.js";
export { PriorityQueue } from "./containers/priority-queue.js";
export { RBTree } from "./containers/rbtree.js";

// Online Statistics
export { CMA } from "./online/average.js";
export { CountMinSketch, BloomFilter } from "./online/probs.js";
export { CuVar, CuStddev, CuCov, CuCorr, CuBeta } from "./online/stats.js";
export { CuSkew, CuKurt } from "./online/moments.js";
export { CuHistogram } from "./online/histogram.js";
export { RollingSum, SMA, EMA, EWMA } from "./rolling/average.js";

// Rolling Statistics
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

export {
  MeanAbsDeviation,
  MedianAbsDeviation,
  IQR,
} from "./rolling/deviation.js";

export { RollingMedian, RollingQuantile } from "./rolling/rank.js";
export { RollingSkew, RollingKurt } from "./rolling/moments.js";
export { RollingHistogram } from "./rolling/histogram.js";

// Performance Analysis - Online
export type {
  RunningDrawDurationResult,
  RunningDrawResult,
} from "./online/perf-drawdown.js";

export {
  RunningDrawdown,
  RunningDrawup,
  RunningRelDrawdown,
  RunningRelDrawup,
  RunningLongestDrawdown,
  RunningLongestDrawup,
} from "./online/perf-drawdown.js";

export {
  RunningDownStats,
  RunningSharpe,
  RunningSortino,
  RunningWinRate,
  RunningExpectancy,
  RunningGainLoss,
  RunningProfitFactor,
} from "./online/perf-metrics.js";

// Performance Analysis
export {
  maxDrawDown,
  maxRelDrawDown,
  maxDrawUp,
  maxRelDrawUp,
} from "./numeric/drawdown.js";

export type { DrawdownResult } from "./numeric/drawdown.js";

// Numeric Utilities - Accumulator
export {
  Kahan,
  SmoothedAccum,
  exp_factor,
  wilders_factor,
} from "./numeric/accum.js";

// Numeric Utilities
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

// Numeric Utilities - Array Reducers
export { sum, min, max, argmin, argmax } from "./numeric/array.js";

// Numeric Utilities - Series Transform
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

// Numeric Utilities - Statistics
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

// Numeric Utilities - Risk Metrics
export {
  historicalCVaR,
  parametricCVaR,
  expWeightedCVaR,
} from "./numeric/CVaR.js";

// Numeric Utilities - Performance Metrics
export {
  sharpe,
  sortino,
  calmar,
  winRate,
  gainLoss,
  expectancy,
  profitFactor,
} from "./numeric/metrics.js";

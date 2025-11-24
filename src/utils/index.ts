// Portfolio utilities - namespace export
export * as pu from "./portfolio.utils.js";

// Portfolio utilities - explicit exports
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
  handleSplit as portfolioHandleSplit,
  handleCashDividend as portfolioHandleCashDividend,
  handleSpinoff as portfolioHandleSpinoff,
  handleMerger as portfolioHandleMerger,
  handleHardFork as portfolioHandleHardFork,
  handleAirdrop as portfolioHandleAirdrop,
  handleTokenSwap as portfolioHandleTokenSwap,
  handleStakingReward as portfolioHandleStakingReward,
} from "./portfolio.utils.js";

// Market utilities
export {
  createUniverse,
  appraisePosition,
  appraisePortfolio,
  calculateUnrealizedPnL,
  calculateUnrealisedPnL,
  isAssetValidAt,
  updateSnapshotQuote,
  updateSnapshotBar,
} from "./market.utils.js";

// Position utilities
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
} from "./position.utils.js";

// Stock utilities
export {
  handleSplit,
  handleCashDividend,
  handleSpinoff,
  handleMerger,
} from "./stock.utils.js";

// Crypto utilities
export {
  handleHardFork,
  handleAirdrop,
  handleTokenSwap,
  handleStakingReward,
} from "./crypto.utils.js";

// Order validation
export type {
  OrderValidationError,
  OrderValidationResult,
} from "./order.validation.js";

export { validateOrder } from "./order.validation.js";

// Order factories
export {
  buyOrder,
  sellOrder,
  shortOrder,
  coverOrder,
} from "./order.utils.js";

// Fill utilities
export { processFill, applyFill, applyFills } from "./fill.utils.js";

export type { FillEffect, ApplyFillResult } from "./fill.utils.js";

export {
  maxDrawDown,
  maxRelDrawDown,
  maxDrawUp,
  maxRelDrawUp,
} from "./drawdown.js";

export type { DrawdownResult } from "./drawdown.js";

export { Kahan, SmoothedAccum, exp_factor, wilders_factor } from "./accum.js";

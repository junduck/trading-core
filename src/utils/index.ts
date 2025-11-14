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
  createPosition,
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

// Order utilities
export { validateOrder } from "./order.utils.js";

export type {
  OrderValidationError,
  OrderValidationResult,
} from "./order.utils.js";

// Fill utilities
export { applyFill, applyFills } from "./fill.utils.js";

export type { ApplyFillResult } from "./fill.utils.js";

// Portfolio
export * as pu from "./utils/portfolio.utils.js";
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
  fillOrder, // Order Management
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

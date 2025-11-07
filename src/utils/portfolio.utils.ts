import type { Portfolio } from "../types/portfolio.js";
import type { Asset } from "../types/asset.js";
import type { Position } from "../types/position.js";
import type { CloseStrategy } from "../types/trade.js";
import * as posUtils from "./position.utils.js";
import * as stockUtils from "./stock.utils.js";
import * as cryptoUtils from "./crypto.utils.js";

/**
 * Creates a new Portfolio data structure.
 * @param id - Unique identifier for the portfolio
 * @param name - Human-readable name for the portfolio
 * @param positions - Optional initial positions map
 * @param modified - Optional modification timestamp (defaults to current date)
 * @returns A new Portfolio instance
 */
export function create(
  id: string,
  name: string,
  positions?: Map<string, Position>,
  modified?: Date
): Portfolio {
  const now = new Date();
  return {
    id,
    name,
    positions: positions ?? new Map<string, Position>(),
    modified: modified ?? now,
  };
}

/**
 * Checks if an asset exists in the portfolio.
 * @param portfolio - The portfolio to check
 * @param asset - The asset to look for
 * @returns True if the asset has a long or short position
 */
export function hasAsset(portfolio: Portfolio, asset: Asset): boolean {
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return false;

  const hasLong = pos.long?.has(asset.symbol) ?? false;
  const hasShort = pos.short?.has(asset.symbol) ?? false;
  return hasLong || hasShort;
}

/**
 * Gets the position for a specific currency.
 * @param portfolio - The portfolio to query
 * @param currency - The currency code to look up
 * @returns The Position for that currency, or undefined if not found
 */
export function getPosition(
  portfolio: Portfolio,
  currency: string
): Position | undefined {
  return portfolio.positions.get(currency);
}

/**
 * Gets the cash balance for a specific currency.
 * @param portfolio - The portfolio to query
 * @param currency - The currency code to look up
 * @returns The cash balance, or 0 if currency not found
 */
export function getCash(portfolio: Portfolio, currency: string): number {
  return portfolio.positions.get(currency)?.cash ?? 0;
}

/**
 * Gets all currencies in the portfolio.
 * @param portfolio - The portfolio to query
 * @returns Array of currency codes
 */
export function getCurrencies(portfolio: Portfolio): string[] {
  return Array.from(portfolio.positions.keys());
}

/**
 * Creates a new Position data structure with initial cash.
 * @param initialCash - Initial cash balance (default: 0)
 * @param time - Optional creation timestamp (defaults to current date)
 * @returns A new Position instance
 */
export function createPosition(
  initialCash: number = 0,
  time?: Date
): Position {
  return {
    cash: initialCash,
    totalCommission: 0,
    realisedPnL: 0,
    modified: time ?? new Date(),
  };
}

function getOrSetPosition(
  p: Portfolio,
  currency: string,
  time: Date
): Position {
  let pos = p.positions.get(currency);
  if (!pos) {
    pos = {
      cash: 0,
      totalCommission: 0,
      realisedPnL: 0,
      modified: time,
    };
    p.positions.set(currency, pos);
  }
  return pos;
}

/** Opens a long position by purchasing an asset. Mutates portfolio. */
export function openLong(
  portfolio: Portfolio,
  asset: Asset,
  price: number,
  quantity: number,
  commission: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  // Initialize position if needed
  const pos = getOrSetPosition(portfolio, asset.currency, actTime);

  const cashFlow = posUtils.openLong(
    pos,
    asset.symbol,
    price,
    quantity,
    commission,
    actTime
  );
  portfolio.modified = actTime;
  return cashFlow;
}

/** Closes a long position by selling an asset. Mutates portfolio. */
export function closeLong(
  portfolio: Portfolio,
  asset: Asset,
  price: number,
  quantity: number,
  commission: number = 0,
  strategy: CloseStrategy = "FIFO",
  time?: Date
): number {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) {
    throw new Error(`No position found for currency ${asset.currency}`);
  }

  const pnl = posUtils.closeLong(
    pos,
    asset.symbol,
    price,
    quantity,
    commission,
    strategy,
    actTime
  );
  portfolio.modified = actTime;
  return pnl;
}

/** Opens a short position by borrowing and selling an asset. Mutates portfolio. */
export function openShort(
  portfolio: Portfolio,
  asset: Asset,
  price: number,
  quantity: number,
  commission: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  // Initialize position if needed
  const pos = getOrSetPosition(portfolio, asset.currency, actTime);

  const proceeds = posUtils.openShort(
    pos,
    asset.symbol,
    price,
    quantity,
    commission,
    actTime
  );
  portfolio.modified = actTime;
  return proceeds;
}

/** Closes a short position by buying back the asset. Mutates portfolio. */
export function closeShort(
  portfolio: Portfolio,
  asset: Asset,
  price: number,
  quantity: number,
  commission: number = 0,
  strategy: CloseStrategy = "FIFO",
  time?: Date
): number {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) {
    throw new Error(`No position found for currency ${asset.currency}`);
  }

  const pnl = posUtils.closeShort(
    pos,
    asset.symbol,
    price,
    quantity,
    commission,
    strategy,
    actTime
  );
  portfolio.modified = actTime;
  return pnl;
}

/** Handles a stock split by adjusting position quantities and costs. Mutates portfolio. */
export function handleSplit(
  portfolio: Portfolio,
  asset: Asset,
  ratio: number,
  time?: Date
): void {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return;

  stockUtils.handleSplit(pos, asset.symbol, ratio, actTime);
  portfolio.modified = actTime;
}

/** Handles a cash dividend payment. Mutates portfolio. */
export function handleCashDividend(
  portfolio: Portfolio,
  asset: Asset,
  amountPerShare: number,
  taxRate: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return 0;

  const cashFlow = stockUtils.handleCashDividend(
    pos,
    asset.symbol,
    amountPerShare,
    taxRate,
    actTime
  );
  portfolio.modified = actTime;
  return cashFlow;
}

/** Handles a corporate spinoff. Mutates portfolio. */
export function handleSpinoff(
  portfolio: Portfolio,
  asset: Asset,
  newSymbol: string,
  ratio: number,
  time?: Date
): void {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return;

  stockUtils.handleSpinoff(pos, asset.symbol, newSymbol, ratio, actTime);
  portfolio.modified = actTime;
}

/** Handles a corporate merger. Mutates portfolio. */
export function handleMerger(
  portfolio: Portfolio,
  asset: Asset,
  newSymbol: string,
  ratio: number,
  cashComponent: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return 0;

  const cashFlow = stockUtils.handleMerger(
    pos,
    asset.symbol,
    newSymbol,
    ratio,
    cashComponent,
    actTime
  );
  portfolio.modified = actTime;
  return cashFlow;
}

/** Handles a hard fork. Mutates portfolio. */
export function handleHardFork(
  portfolio: Portfolio,
  asset: Asset,
  newSymbol: string,
  ratio: number = 1,
  time?: Date
): void {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return;

  cryptoUtils.handleHardFork(pos, asset.symbol, newSymbol, ratio, actTime);
  portfolio.modified = actTime;
}

/** Handles an airdrop. Mutates portfolio. */
export function handleAirdrop(
  portfolio: Portfolio,
  currency: string,
  holderSymbol: string | null,
  airdropSymbol: string,
  amountPerToken: number = 0,
  fixedAmount: number = 0,
  time?: Date
): void {
  const actTime = time ?? new Date();

  // Initialize position if needed for fixed airdrops
  let pos = portfolio.positions.get(currency);
  if (!pos) {
    pos = {
      cash: 0,
      totalCommission: 0,
      realisedPnL: 0,
      modified: actTime,
    };
    portfolio.positions.set(currency, pos);
  }

  cryptoUtils.handleAirdrop(
    pos,
    holderSymbol,
    airdropSymbol,
    amountPerToken,
    fixedAmount,
    actTime
  );
  portfolio.modified = actTime;
}

/** Handles a token swap/migration. Mutates portfolio. */
export function handleTokenSwap(
  portfolio: Portfolio,
  asset: Asset,
  newSymbol: string,
  ratio: number = 1,
  time?: Date
): void {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return;

  cryptoUtils.handleTokenSwap(pos, asset.symbol, newSymbol, ratio, actTime);
  portfolio.modified = actTime;
}

/** Handles staking rewards. Mutates portfolio. */
export function handleStakingReward(
  portfolio: Portfolio,
  asset: Asset,
  rewardPerToken: number,
  time?: Date
): number {
  const actTime = time ?? new Date();
  const pos = portfolio.positions.get(asset.currency);
  if (!pos) return 0;

  const rewards = cryptoUtils.handleStakingReward(
    pos,
    asset.symbol,
    rewardPerToken,
    actTime
  );
  portfolio.modified = actTime;
  return rewards;
}

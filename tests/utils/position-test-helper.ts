import type { Position } from "../../src/types/position.js";
import type { Asset } from "../../src/types/asset.js";
import type { CloseStrategy } from "../../src/types/trade.js";
import * as posUtils from "../../src/utils/position.utils.js";
import * as stockUtils from "../../src/utils/stock.utils.js";
import * as cryptoUtils from "../../src/utils/crypto.utils.js";

/**
 * Creates a test position with the specified starting cash.
 */
export function createTestPosition(cashAmount: number = 100_000): Position {
  const now = new Date();
  return {
    cash: cashAmount,
    long: new Map(),
    short: new Map(),
    totalCommission: 0,
    realisedPnL: 0,
    modified: now,
  };
}

/**
 * Opens a long position by purchasing an asset.
 */
export function openLong(
  pos: Position,
  symbol: string,
  price: number,
  quantity: number,
  commission: number = 0,
  time?: Date
): number {
  return posUtils.openLong(pos, symbol, price, quantity, commission, time);
}

/**
 * Closes a long position by selling an asset.
 */
export function closeLong(
  pos: Position,
  symbol: string,
  price: number,
  quantity: number,
  commission: number = 0,
  strategy: CloseStrategy = "FIFO",
  time?: Date
): number {
  return posUtils.closeLong(
    pos,
    symbol,
    price,
    quantity,
    commission,
    strategy,
    time
  );
}

/**
 * Opens a short position by selling an asset.
 */
export function openShort(
  pos: Position,
  symbol: string,
  price: number,
  quantity: number,
  commission: number = 0,
  time?: Date
): number {
  return posUtils.openShort(pos, symbol, price, quantity, commission, time);
}

/**
 * Closes a short position by buying back an asset.
 */
export function closeShort(
  pos: Position,
  symbol: string,
  price: number,
  quantity: number,
  commission: number = 0,
  strategy: CloseStrategy = "FIFO",
  time?: Date
): number {
  return posUtils.closeShort(
    pos,
    symbol,
    price,
    quantity,
    commission,
    strategy,
    time
  );
}

/**
 * Handles a stock split.
 */
export function handleSplit(
  pos: Position,
  symbol: string,
  ratio: number,
  time?: Date
): void {
  return stockUtils.handleSplit(pos, symbol, ratio, time);
}

/**
 * Handles a cash dividend payment.
 */
export function handleCashDividend(
  pos: Position,
  symbol: string,
  amountPerShare: number,
  taxRate: number = 0,
  time?: Date
): number {
  return stockUtils.handleCashDividend(
    pos,
    symbol,
    amountPerShare,
    taxRate,
    time
  );
}

/**
 * Handles a stock spinoff.
 */
export function handleSpinoff(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number,
  time?: Date
): void {
  return stockUtils.handleSpinoff(pos, symbol, newSymbol, ratio, time);
}

/**
 * Handles a stock merger.
 */
export function handleMerger(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number,
  cashComponent: number = 0,
  time?: Date
): number {
  return stockUtils.handleMerger(
    pos,
    symbol,
    newSymbol,
    ratio,
    cashComponent,
    time
  );
}

/**
 * Handles a hard fork.
 */
export function handleHardFork(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number = 1,
  time?: Date
): void {
  return cryptoUtils.handleHardFork(pos, symbol, newSymbol, ratio, time);
}

/**
 * Handles an airdrop.
 */
export function handleAirdrop(
  pos: Position,
  holderSymbol: string | null,
  airdropSymbol: string,
  amountPerToken: number = 0,
  fixedAmount: number = 0,
  time?: Date
): void {
  return cryptoUtils.handleAirdrop(
    pos,
    holderSymbol,
    airdropSymbol,
    amountPerToken,
    fixedAmount,
    time
  );
}

/**
 * Handles a token swap.
 */
export function handleTokenSwap(
  pos: Position,
  oldSymbol: string,
  newSymbol: string,
  ratio: number = 1,
  time?: Date
): void {
  return cryptoUtils.handleTokenSwap(pos, oldSymbol, newSymbol, ratio, time);
}

/**
 * Handles a staking reward.
 */
export function handleStakingReward(
  pos: Position,
  symbol: string,
  rewardPerToken: number,
  time?: Date
): number {
  return cryptoUtils.handleStakingReward(pos, symbol, rewardPerToken, time);
}

/**
 * Creates a test asset with default values.
 */
export function createTestAsset(
  symbol: string = "AAPL",
  overrides?: Partial<Asset>
): Asset {
  return {
    symbol,
    type: "stock",
    name: `Test Asset ${symbol}`,
    exchange: "TEST",
    currency: "USD",
    lotSize: 1,
    tickSize: 0.01,
    ...overrides,
  };
}

/**
 * Rounds a number to 2 decimal places for easier comparison in tests.
 */
export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

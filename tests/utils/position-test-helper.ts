import type { Position } from "../../src/types/position.js";
import type { Asset } from "../../src/types/asset.js";

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

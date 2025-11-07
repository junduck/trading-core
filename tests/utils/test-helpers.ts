import type { Portfolio } from '../../src/types/portfolio.js';
import type { Asset } from '../../src/types/asset.js';

/**
 * Creates a fresh portfolio for testing with the specified starting cash.
 * @param cashAmount Starting cash in USD (default: 100,000)
 * @param portfolioId Portfolio ID (default: 'test-portfolio')
 * @returns A new Portfolio instance
 */
export function createTestPortfolio(
  cashAmount: number = 100_000,
  portfolioId: string = 'test-portfolio'
): Portfolio {
  const now = new Date();
  return {
    id: portfolioId,
    name: 'Test Portfolio',
    cash: new Map([['USD', cashAmount]]),
    longPosition: new Map(),
    shortPosition: new Map(),
    totalCommission: new Map(),
    realisedPnL: new Map(),
    created: now,
    modified: now,
  };
}

/**
 * Creates a test asset with default values.
 * @param symbol Asset symbol (default: 'AAPL')
 * @param overrides Optional overrides for specific properties
 * @returns A new Asset instance
 */
export function createTestAsset(
  symbol: string = 'AAPL',
  overrides?: Partial<Asset>
): Asset {
  return {
    symbol,
    type: 'stock',
    name: `Test Asset ${symbol}`,
    exchange: 'TEST',
    currency: 'USD',
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

/**
 * Gets the cash balance for USD from a portfolio.
 */
export function getCash(portfolio: Portfolio): number {
  return portfolio.cash.get('USD') ?? 0;
}

/**
 * Helper to assert position values with rounding.
 */
export function assertPositionValues(
  actual: { quantity: number; totalCost: number; averageCost: number },
  expected: { quantity: number; totalCost: number; averageCost: number }
) {
  return {
    quantity: round(actual.quantity),
    totalCost: round(actual.totalCost),
    averageCost: round(actual.averageCost),
  };
}

/**
 * Helper to assert short position values with rounding.
 */
export function assertShortPositionValues(
  actual: { quantity: number; totalProceeds: number; averageProceeds: number },
  expected: { quantity: number; totalProceeds: number; averageProceeds: number }
) {
  return {
    quantity: round(actual.quantity),
    totalProceeds: round(actual.totalProceeds),
    averageProceeds: round(actual.averageProceeds),
  };
}

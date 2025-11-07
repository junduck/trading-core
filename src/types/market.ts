import type { Asset } from "./asset.js";

/**
 * Defines the set of all available assets in the trading universe.
 * Used in backtesting to specify which assets are available for trading.
 */
export interface Universe {
  /** Set of asset symbols available for trading */
  assets: Map<string, Asset>;

  /** Optional timestamp when this universe definition is valid */
  timestamp?: Date;

  /**
   * Get all assets that are valid at a specific timestamp.
   * An asset is valid if:
   * - validFrom is null/undefined OR timestamp >= validFrom
   * - validUntil is null/undefined OR timestamp <= validUntil
   */
  getValidAssets(timestamp: Date): Map<string, Asset>;

  /**
   * Check if a specific asset is valid at a given timestamp
   */
  isAssetValid(symbol: string, timestamp: Date): boolean;

  /**
   * Get all symbols in the universe
   */
  getSymbols(): string[];

  /**
   * Get the type of an asset by symbol.
   * Returns empty string if asset not found.
   */
  getType(symbol: string): string;

  /**
   * Get the exchange of an asset by symbol.
   * Returns empty string if asset not found.
   */
  getExchange(symbol: string): string;

  /**
   * Get the currency of an asset by symbol.
   * Returns empty string if asset not found (useful for single-currency universes).
   */
  getCurrency(symbol: string): string;

  /**
   * Filter assets by type (e.g., "crypto", "stock", "forex").
   * If universe has a timestamp, only valid assets at that time are considered.
   */
  filterByType(type: string): Asset[];

  /**
   * Filter assets by exchange.
   * If universe has a timestamp, only valid assets at that time are considered.
   */
  filterByExchange(exchange: string): Asset[];

  /**
   * Filter assets by currency.
   * If universe has a timestamp, only valid assets at that time are considered.
   */
  filterByCurrency(currency: string): Asset[];
}

/**
 * Represents a snapshot of market prices at a specific point in time.
 * Used for portfolio valuation and backtesting.
 */
export interface MarketSnapshot {
  /** Map of asset symbols to their current prices */
  price: Map<string, number>;

  /** Timestamp when this snapshot was captured */
  timestamp: Date;
}

export interface MarketQuote {
  /** Symbol of the asset this quote refers to */
  symbol: string;

  /** Last traded price */
  price: number;

  /** Volume of the last trade (optional) */
  volume?: number;

  /** Timestamp when this quote was generated */
  timestamp: Date;

  /** Best bid price (highest buy order) */
  bid?: number;

  /** Volume available at the bid price */
  bid_vol?: number;

  /** Best ask price (lowest sell order) */
  ask?: number;

  /** Volume available at the ask price */
  ask_vol?: number;
}

/** Standard time intervals for market bar data */
export type MarketBarInterval =
  | "1m" | "5m" | "15m" | "30m"
  | "1h" | "2h" | "4h"
  | "1d" | "1w" | "1M";

/**
 * OHLCV (Open-High-Low-Close-Volume) bar data for a specific time interval.
 * Represents aggregated trading data over a period.
 */
export interface MarketBar {
  /** Symbol of the asset */
  symbol: string;

  /** Opening price at the start of the interval */
  open: number;

  /** Highest price during the interval */
  high: number;

  /** Lowest price during the interval */
  low: number;

  /** Closing price at the end of the interval */
  close: number;

  /** Total trading volume during the interval */
  volume: number;

  /** Timestamp marking the end of the interval */
  timestamp: Date;

  /** Time interval this bar represents */
  interval: MarketBarInterval;
}

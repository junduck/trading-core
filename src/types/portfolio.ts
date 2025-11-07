import type { Position } from "./position.js";

/**
 * Represents a trading portfolio for tracking assets and positions in SPOT markets.
 * Pure data structure containing cash balances, positions, and profit/loss tracking.
 */
export interface Portfolio {
  /** Unique identifier for the portfolio */
  readonly id: string;

  /** Human-readable name for the portfolio */
  readonly name: string;

  /** Map of currency code to Position (e.g., "USD" -> Position) */
  positions: Map<string, Position>;

  /** Timestamp when the portfolio was last modified */
  modified: Date;
}

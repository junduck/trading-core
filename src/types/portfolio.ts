import type { LongPosition, ShortPosition } from "./position.js";

/**
 * Represents a trading portfolio for tracking assets and positions in SPOT markets.
 * Contains cash balances, positions, and profit/loss tracking.
 */
export interface Portfolio {
  /** Unique identifier for the portfolio */
  readonly id: string;

  /** Human-readable name for the portfolio */
  readonly name: string;

  /** Cash balances by currency (e.g., "USD" -> 10000, "EUR" -> 5000) */
  cash: Map<string, number>;

  /** Long positions held in the portfolio, keyed by asset symbol */
  longPosition?: Map<string, LongPosition>;

  /** Short positions held in the portfolio, keyed by asset symbol */
  shortPosition?: Map<string, ShortPosition>;

  /** Total commission paid */
  totalCommission: number;

  /** Total realised profit and loss from closed positions */
  realisedPnL: number;

  /** Timestamp when the portfolio was created */
  created: Date;

  /** Timestamp when the portfolio was last modified */
  modified: Date;
}

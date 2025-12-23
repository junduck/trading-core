/**
 * Type of tradable instrument.
 * @group Market Data
 */
export type InstrumentType =
  // Spot market instrument
  | "SPOT"
  // Linear futures contract
  | "FUTURE"
  // Inverse futures contract
  | "INV_FUTURE"
  // Perpetual swap contract
  | "PERP"
  // Option contract
  | "OPTION";

/**
 * Represents a tradable instrument (spot, futures, options, perps, etc.).
 * Contains metadata and trading specifications for the instrument.
 * @group Market Data
 */
export interface Instrument {
  /** Global unique symbol identifier (e.g., "BTCUSDT", "AAPL", "BTC-PERP", "SPX-20260320-5000-C") */
  symbol: string;

  /** Type of instrument */
  type: InstrumentType;

  /** Human-readable name of the instrument */
  name?: string;

  /** Exchange or trading venue where the instrument is traded */
  exchange?: string;

  /** Accounting/valuation/settlement currency used by this instrument (quote currency for spot, settlement currency for derivatives) */
  currency: string;

  /** Minimum quantity increment for trading (minimum order size) */
  lotSize?: number;

  /** Minimum price increment (smallest price movement allowed) */
  tickSize?: number;

  /** Date from which this instrument becomes valid/tradable */
  validFrom?: Date;

  /** Date until which this instrument is valid/tradable */
  validUntil?: Date;

  /** Contract size multiplier for futures and options (default 1 for spot) */
  multiplier?: number;

  /** Underlying symbol for derivatives (e.g., "BTC" for "BTC-PERP") */
  underlying?: string;

  /** Expiry date for derivatives (futures, options) */
  expiry?: Date;

  /** Strike price for options */
  strike?: number;

  /** Option type (call or put) */
  option?: "CALL" | "PUT";
}

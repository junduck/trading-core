/**
 * Represents a tradable asset in a SPOT market.
 * Contains metadata and trading specifications for the asset.
 */
export interface Asset {
  /** Unique identifier for the asset (e.g., "BTCUSDT", "AAPL") */
  symbol: string;

  /** Type of asset (e.g., "crypto", "stock", "forex") */
  type: string;

  /** Human-readable name of the asset */
  name: string;

  /** Exchange or trading venue where the asset is traded */
  exchange: string;

  /** Base currency used for pricing (e.g., "USD", "USDT") */
  currency: string;

  /** Minimum quantity increment for trading (minimum order size) */
  lotSize: number;

  /** Minimum price increment (smallest price movement allowed) */
  tickSize: number;
}

/**
 * Represents a price quote for an asset at a specific point in time.
 * Includes both the last traded price and optional order book data.
 */
export interface Quote {
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

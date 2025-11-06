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

  /** Date from which this asset becomes valid/tradable (null means always valid) */
  validFrom?: Date;

  /** Date until which this asset is valid/tradable (null means no expiry) */
  validUntil?: Date;
}

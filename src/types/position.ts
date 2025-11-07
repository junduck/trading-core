/**
 * Represents a single lot (trade) within a long position.
 * Used for tracking individual purchases with their specific price and commission.
 */
export interface LongPositionLot {
  /** Quantity of the asset in this lot */
  quantity: number;

  /** Purchase price per unit at which this lot was acquired */
  price: number;

  /** Total cost for this lot including commission (cost = price * quantity + commission). This is deducted proportionally when closing positions. */
  totalCost: number;
}

/**
 * Represents a long position for book-keeping.
 * Aggregates multiple lots to track overall holdings, and profit/loss.
 */
export interface LongPosition {
  /** Total open quantity of this position */
  quantity: number;

  /** Total cost of all open lots combined (sum of all lot totalCosts). This is deducted when closing positions. */
  totalCost: number;

  /** Realised profit and loss accumulated when reducing position size */
  realisedPnL: number;

  /** Individual lots that make up this position. New lots are pushed to the end. Quantities are mutated in-place when closing positions. */
  lots: LongPositionLot[];

  /** Timestamp when this position was created */
  created: Date;

  /** Timestamp when this position was last modified */
  modified: Date;
}

/**
 * Represents a single lot (trade) within a short position.
 * Used for tracking individual short sales with their specific price and commission.
 */
export interface ShortPositionLot {
  /** Quantity of the asset in this lot */
  quantity: number;

  /** Sale price per unit at which this lot was opened */
  price: number;

  /** Total proceeds from this lot after commission (proceeds = price * quantity - commission). This is deducted proportionally when closing positions. */
  totalProceeds: number;
}

/**
 * Represents a short position for book-keeping.
 * Aggregates multiple lots to track overall short holdings, and profit/loss.
 */
export interface ShortPosition {
  /** Total open quantity of this short position */
  quantity: number;

  /** Total proceeds from all open lots combined (sum of all lot totalProceeds). This is deducted when closing positions. */
  totalProceeds: number;

  /** Realised profit and loss accumulated when reducing position size */
  realisedPnL: number;

  /** Individual lots that make up this position. New lots are pushed to the end. Quantities are mutated in-place when closing positions. */
  lots: ShortPositionLot[];

  /** Timestamp when this position was created */
  created: Date;

  /** Timestamp when this position was last modified */
  modified: Date;
}

/**
 * Represents a currency account within a portfolio.
 * Groups all assets, cash, and P&L for a specific currency.
 */
export interface Position {
  /** Cash balance in this currency */
  cash: number;

  /** Long positions in assets denominated in this currency */
  long?: Map<string, LongPosition>;

  /** Short positions in assets denominated in this currency */
  short?: Map<string, ShortPosition>;

  /** Total commission paid in this currency */
  totalCommission: number;

  /** Total realised profit and loss in this currency */
  realisedPnL: number;

  /** Timestamp when this position was created */
  created: Date;

  /** Timestamp when this position was last modified */
  modified: Date;
}

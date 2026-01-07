import type {
  LongPositionLot,
  Position,
  ShortPositionLot,
} from "../types/position.js";
import {
  amendLongPositionLot,
  amendShortPositionLot,
  pushLongPositionLot,
  pushShortPositionLot,
} from "./position.utils.js";

/**
 * Represents the incremental shares to be added or modified for a symbol.
 * @group Position
 */
export interface AdjustLot {
  /** The asset symbol. */
  symbol: string;
  /** Incremental long position lot details. */
  long?: LongPositionLot | undefined;
  /** Incremental short position lot details. */
  short?: ShortPositionLot | undefined;
}

/**
 * Method to handle fractional shares during stock adjustments.
 * @group Position
 */
export type AdjustRoundingMethod =
  /** Keep fractional shares as is. */
  | "fractional"
  /** Round down to the nearest whole share; fractions are discarded. */
  | "floor"
  /** Round down to the nearest whole share; fractions are converted to cash. */
  | "cashInLieu";

/**
 * Represents the cash flow generated from rounding fractional shares.
 * @group Position
 */
export interface AdjustRoundingCashflow {
  /** Cash received from long position fractions. */
  cash: number;
  /** Cash liability incurred from short position fractions. */
  liab: number;
}

/**
 * Calculates the incremental adjustment lot for a stock split.
 *
 * @param pos - The current position.
 * @param symbol - The stock symbol.
 * @param splitPerShare - Incremental shares per share (e.g., 1 for a 2-for-1 split, where 1 original becomes 1+1).
 * @returns The adjustment lot containing incremental quantities.
 * @group Position
 */
export function adjustLotForSplit(
  pos: Position,
  symbol: string,
  splitPerShare: number
) {
  let result: AdjustLot = { symbol };

  const long = pos.long?.get(symbol);
  if (long) {
    result.long = {
      quantity: long.quantity * splitPerShare,
      price: 0,
      totalCost: 0,
    };
  }

  const short = pos.short?.get(symbol);
  if (short) {
    result.short = {
      quantity: short.quantity * splitPerShare,
      price: 0,
      totalProceeds: 0,
    };
  }

  return result;
}

/**
 * Rounds the quantities in the given AdjustLot and calculates resulting cash flow components.
 *
 * This function has a single concern: adjusting quantities and calculating the gross cash
 * equivalents for fractional parts. Tax calculations should be handled by the caller.
 *
 * @param lot - The AdjustLot to round.
 * @param rounding - The rounding method to apply.
 * @param cashInLieuPrice - The price per share for cash in lieu calculations (if applicable).
 * @returns The cash flow components resulting from rounding.
 * @group Position
 */
export function roundAdjustLot(
  lot: AdjustLot,
  rounding: AdjustRoundingMethod,
  cashInLieuPrice: number = 0
): AdjustRoundingCashflow {
  let cash = 0;
  let liab = 0;
  switch (rounding) {
    case "fractional":
      return { cash, liab };
    case "floor": {
      // simply round down quantities, no other side effects
      if (lot.long) {
        lot.long.quantity = Math.floor(lot.long.quantity);
      }
      if (lot.short) {
        lot.short.quantity = Math.floor(lot.short.quantity);
      }
      return { cash, liab };
    }
    case "cashInLieu": {
      if (lot.long) {
        const newQty = Math.floor(lot.long.quantity);
        const frac = lot.long.quantity - newQty;
        lot.long.quantity = newQty;
        cash = frac * cashInLieuPrice;
      }
      if (lot.short) {
        const newQty = Math.floor(lot.short.quantity);
        const frac = lot.short.quantity - newQty;
        lot.short.quantity = newQty;
        liab = frac * cashInLieuPrice;
      }
      return { cash, liab };
    }
  }
}

/**
 * Applies the given AdjustLot to the Position.
 *
 * @param pos - The Position to modify.
 * @param lot - The AdjustLot to apply.
 * @param cashflow - The cash flow to apply to the position's cash (default: 0).
 * @param time - The time of the adjustment (default: current time).
 * @param disableLot - If true, merges into current lot instead of tracking separate lots (default: false).
 * @group Position
 */
export function applyAdjustLot(
  pos: Position,
  lot: AdjustLot,
  cashflow: number = 0,
  time?: Date,
  disableLot?: boolean
) {
  const actTime = time ?? new Date();

  if (lot.long) {
    if (disableLot) {
      amendLongPositionLot(pos, lot.symbol, lot.long, actTime, false);
    } else {
      pushLongPositionLot(pos, lot.symbol, lot.long, actTime);
    }
  }

  if (lot.short) {
    if (disableLot) {
      amendShortPositionLot(pos, lot.symbol, lot.short, actTime, false);
    } else {
      pushShortPositionLot(pos, lot.symbol, lot.short, actTime);
    }
  }

  pos.cash += cashflow;

  if (lot.long || lot.short) {
    pos.modified = actTime;
  }
}

/**
 * Sets the price for both long and short lots in an AdjustLot.
 *
 * @param lot - The AdjustLot to modify.
 * @param price - The price per share to set.
 * @group Position
 */
export function setPriceForAdjustLot(lot: AdjustLot, price: number) {
  if (lot.short) {
    lot.short.price = price;
  }
  if (lot.long) {
    lot.long.price = price;
  }
}

/**
 * Calculates the total fair market value for the long portion of an AdjustLot.
 *
 * This represents the gross value of the incremental shares.
 * Short portions are excluded as they represent liabilities rather than asset value.
 *
 * @param lot - The AdjustLot to calculate value for.
 * @param fmvPerShare - Fair market value per share.
 * @returns The total value of the long incremental shares.
 * @group Position
 */
export function valueForAdjustLot(lot: AdjustLot, fmvPerShare: number) {
  if (lot.long) {
    return lot.long.quantity * fmvPerShare;
  }
  return 0;
}

/**
 * Calculates the tax amount for the long portion of an AdjustLot.
 *
 * Tax is typically only calculated on the receipt of new assets (bonus shares).
 *
 * @param lot - The AdjustLot to calculate tax for.
 * @param fmvPerShare - Fair market value per share for tax calculation.
 * @param taxRate - The applicable tax rate.
 * @returns The total tax amount.
 * @group Position
 */
export function taxForAdjustLot(
  lot: AdjustLot,
  fmvPerShare: number,
  taxRate: number
) {
  if (lot.long) {
    return lot.long.quantity * fmvPerShare * taxRate;
  }
  return 0;
}

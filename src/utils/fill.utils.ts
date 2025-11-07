import type { Position } from "../types/position.js";
import type { Fill } from "../types/order.js";
import type { CloseStrategy } from "../types/trade.js";
import {
  openLong,
  closeLong,
  openShort,
  closeShort,
} from "./position.utils.js";

/**
 * Result of applying fill(s) to a position.
 */
export interface ApplyFillResult {
  /** The fills that were applied */
  fills: Fill[];
  /** Cumulative cash flow from the fills (negative for buying, positive for selling) */
  cashFlow: number;
  /** Cumulative realized PnL from the fills (0 for opening positions, actual PnL for closing) */
  realisedPnL: number;
}

/**
 * Applies a single fill to update a position.
 * Routes to appropriate position utility based on fill effect.
 * @param position - The position to modify
 * @param fill - The fill to apply
 * @param closeStrategy - Lot closing strategy for closing positions (default: "FIFO")
 * @returns Result with fill, cash flow, and realized PnL
 */
export function applyFill(
  position: Position,
  fill: Fill,
  closeStrategy: CloseStrategy = "FIFO"
): ApplyFillResult {
  let cashFlow: number;
  let realisedPnL: number;

  switch (fill.effect) {
    case "OPEN_LONG":
      cashFlow = openLong(
        position,
        fill.symbol,
        fill.price,
        fill.quantity,
        fill.commission,
        fill.timestamp
      );
      realisedPnL = 0;
      break;

    case "CLOSE_LONG":
      realisedPnL = closeLong(
        position,
        fill.symbol,
        fill.price,
        fill.quantity,
        fill.commission,
        closeStrategy,
        fill.timestamp
      );
      cashFlow = fill.price * fill.quantity - fill.commission;
      break;

    case "OPEN_SHORT":
      cashFlow = openShort(
        position,
        fill.symbol,
        fill.price,
        fill.quantity,
        fill.commission,
        fill.timestamp
      );
      realisedPnL = 0;
      break;

    case "CLOSE_SHORT":
      realisedPnL = closeShort(
        position,
        fill.symbol,
        fill.price,
        fill.quantity,
        fill.commission,
        closeStrategy,
        fill.timestamp
      );
      cashFlow = -(fill.price * fill.quantity + fill.commission);
      break;
  }

  return {
    fills: [fill],
    cashFlow,
    realisedPnL,
  };
}

/**
 * Applies multiple fills to a position sequentially.
 * Returns cumulative result with all fills, total cash flow, and total realized PnL.
 * @param position - The position to modify
 * @param fills - The fills to apply in order
 * @param closeStrategy - Lot closing strategy for closing positions (default: "FIFO")
 * @returns Cumulative result with all fills and totals
 * @throws Error if any fill cannot be applied
 */
export function applyFills(
  position: Position,
  fills: Fill[],
  closeStrategy: CloseStrategy = "FIFO"
): ApplyFillResult {
  const appliedFills: Fill[] = [];
  let totalCashFlow = 0;
  let totalRealisedPnL = 0;

  for (const fill of fills) {
    const result = applyFill(position, fill, closeStrategy);
    appliedFills.push(fill);
    totalCashFlow += result.cashFlow;
    totalRealisedPnL += result.realisedPnL;
  }

  return {
    fills: appliedFills,
    cashFlow: totalCashFlow,
    realisedPnL: totalRealisedPnL,
  };
}

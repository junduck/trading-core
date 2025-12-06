import type { Position } from "../types/position.js";
import type {
  Fill,
  FillEffect,
  OrderAction,
  OrderState,
} from "../types/order.js";
import type { CloseStrategy } from "../types/trade.js";
import {
  openLong,
  closeLong,
  openShort,
  closeShort,
} from "./position.utils.js";

/**
 * Fills an order (fully or partially) and returns the fill receipt.
 * @param opts - Fill options including state to update and fill details
 * @returns Fill receipt for the matched quantity
 * @group Order Management
 */
export function fillOrder(opts: {
  state: OrderState;
  id?: string;
  quant: number;
  price: number;
  commission?: number;
  created?: Date;
}): Fill {
  const {
    state,
    id = "",
    quant,
    price,
    commission = 0,
    created = new Date(),
  } = opts;

  state.filledQuantity += quant;
  state.remainingQuantity -= quant;
  state.status = state.remainingQuantity <= 0 ? "FILLED" : "PARTIAL";
  state.modified = created;

  return {
    ...({ side: state.side, effect: state.effect } as OrderAction),
    id,
    orderId: state.id,
    symbol: state.symbol,
    quantity: quant,
    price,
    commission,
    created,
  };
}

/**
 * Result of applying fill(s) to a position.
 * @group Position
 * @deprecated Use FillEffect with processFill instead. This interface will be removed in v3.0.
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
 * Processes a single fill to update a position and returns its effect.
 * Routes to appropriate position utility based on fill effect.
 *
 * @remarks
 * This function delegates to low-level position primitives that operate permissively without
 * enforcing business logic or validation. It will:
 * - Route fills to openLong, closeLong, openShort, or closeShort based on fill.effect
 * - Not prevent contradictory operations (e.g., opening short while holding long)
 * - Not validate sufficient cash, margin, or asset availability
 * - Not enforce trading strategy rules or constraints
 *
 * Validation and business logic enforcement is the caller's responsibility.
 *
 * @param position - The position to modify
 * @param fill - The fill to process
 * @param closeStrategy - Lot closing strategy for closing positions (default: "FIFO")
 * @returns Effect of the fill including cash flow and realized PnL
 * @group Position
 */
export function processFill(
  position: Position,
  fill: Fill,
  closeStrategy: CloseStrategy = "FIFO"
): FillEffect {
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
        fill.created
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
        fill.created
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
        fill.created
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
        fill.created
      );
      cashFlow = -(fill.price * fill.quantity + fill.commission);
      break;
  }

  return {
    fill,
    cashFlow,
    realisedPnL,
  };
}

/**
 * Applies a single fill to update a position.
 * Routes to appropriate position utility based on fill effect.
 * @param position - The position to modify
 * @param fill - The fill to apply
 * @param closeStrategy - Lot closing strategy for closing positions (default: "FIFO")
 * @returns Result with fill, cash flow, and realized PnL
 * @group Position
 * @deprecated Use processFill instead. This function will be removed in v3.0.
 */
export function applyFill(
  position: Position,
  fill: Fill,
  closeStrategy: CloseStrategy = "FIFO"
): ApplyFillResult {
  const impact = processFill(position, fill, closeStrategy);
  return {
    fills: [fill],
    cashFlow: impact.cashFlow,
    realisedPnL: impact.realisedPnL,
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
 * @group Position
 * @deprecated Use processFill with map/reduce instead. This function will be removed in v3.0.
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
    const impact = processFill(position, fill, closeStrategy);
    appliedFills.push(fill);
    totalCashFlow += impact.cashFlow;
    totalRealisedPnL += impact.realisedPnL;
  }

  return {
    fills: appliedFills,
    cashFlow: totalCashFlow,
    realisedPnL: totalRealisedPnL,
  };
}

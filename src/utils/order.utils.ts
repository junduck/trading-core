import type { Order, OrderState } from "../types/order.js";

type OrderPrice =
  | { price?: never; stopPrice?: never }
  | { price: number; stopPrice?: never }
  | { price?: never; stopPrice: number };

export type OrderOpts = OrderPrice & {
  id?: string;
  symbol: string;
  quant: number;
  created?: Date;
};

/**
 * Creates a BUY order to open a long position.
 * Order type is determined by price parameters:
 * - No price/stopPrice → MARKET
 * - price only → LIMIT
 * - stopPrice only → STOP
 * @group Order Management
 */
export function buyOrder(opts: OrderOpts): Order {
  const {
    id = "",
    symbol,
    quant,
    price,
    stopPrice,
    created = new Date(),
  } = opts;

  let type: Order["type"];
  if (price === undefined && stopPrice === undefined) {
    type = "MARKET";
  } else if (price !== undefined) {
    type = "LIMIT";
  } else {
    type = "STOP";
  }

  return {
    id,
    symbol,
    side: "BUY",
    effect: "OPEN_LONG",
    type,
    quantity: quant,
    ...(price !== undefined && { price }),
    ...(stopPrice !== undefined && { stopPrice }),
    created,
  };
}

/**
 * Creates a SELL order to close a long position.
 * Order type is determined by price parameters:
 * - No price/stopPrice → MARKET
 * - price only → LIMIT
 * - stopPrice only → STOP
 * @group Order Management
 */
export function sellOrder(opts: OrderOpts): Order {
  const {
    id = "",
    symbol,
    quant,
    price,
    stopPrice,
    created = new Date(),
  } = opts;

  let type: Order["type"];
  if (price === undefined && stopPrice === undefined) {
    type = "MARKET";
  } else if (price !== undefined) {
    type = "LIMIT";
  } else {
    type = "STOP";
  }

  return {
    id,
    symbol,
    side: "SELL",
    effect: "CLOSE_LONG",
    type,
    quantity: quant,
    ...(price !== undefined && { price }),
    ...(stopPrice !== undefined && { stopPrice }),
    created,
  };
}

/**
 * Creates a SELL order to open a short position.
 * Order type is determined by price parameters:
 * - No price/stopPrice → MARKET
 * - price only → LIMIT
 * - stopPrice only → STOP
 * @group Order Management
 */
export function shortOrder(opts: OrderOpts): Order {
  const {
    id = "",
    symbol,
    quant,
    price,
    stopPrice,
    created = new Date(),
  } = opts;

  let type: Order["type"];
  if (price === undefined && stopPrice === undefined) {
    type = "MARKET";
  } else if (price !== undefined) {
    type = "LIMIT";
  } else {
    type = "STOP";
  }

  return {
    id,
    symbol,
    side: "SELL",
    effect: "OPEN_SHORT",
    type,
    quantity: quant,
    ...(price !== undefined && { price }),
    ...(stopPrice !== undefined && { stopPrice }),
    created,
  };
}

/**
 * Creates a BUY order to close a short position (cover).
 * Order type is determined by price parameters:
 * - No price/stopPrice → MARKET
 * - price only → LIMIT
 * - stopPrice only → STOP
 * @group Order Management
 */
export function coverOrder(opts: OrderOpts): Order {
  const {
    id = "",
    symbol,
    quant,
    price,
    stopPrice,
    created = new Date(),
  } = opts;

  let type: Order["type"];
  if (price === undefined && stopPrice === undefined) {
    type = "MARKET";
  } else if (price !== undefined) {
    type = "LIMIT";
  } else {
    type = "STOP";
  }

  return {
    id,
    symbol,
    side: "BUY",
    effect: "CLOSE_SHORT",
    type,
    quantity: quant,
    ...(price !== undefined && { price }),
    ...(stopPrice !== undefined && { stopPrice }),
    created,
  };
}

/**
 * Accepts an order and creates OrderState ready for execution.
 * Initializes tracking with status "OPEN" and quantity counters.
 * @param order - The order to accept
 * @param time - Optional acceptance timestamp (defaults to current time)
 * @returns New OrderState ready to be filled
 * @group Order Management
 */
export function acceptOrder(order: Order, time?: Date): OrderState {
  const modified = time ?? new Date();
  return {
    ...order,
    filledQuantity: 0,
    remainingQuantity: order.quantity,
    status:
      // Default OPEN on live order and PENDING on stop order
      order.type === "LIMIT" || order.type === "MARKET" ? "OPEN" : "PENDING",
    modified,
  };
}

/**
 * Rejects an order and creates OrderState with rejected status.
 * @param order - The order to reject
 * @param time - Optional rejection timestamp (defaults to current time)
 * @returns New OrderState marked as rejected
 * @group Order Management
 */
export function rejectOrder(order: Order, time?: Date): OrderState {
  const modified = time ?? new Date();
  return {
    ...order,
    filledQuantity: 0,
    remainingQuantity: order.quantity,
    status: "REJECT",
    modified,
  };
}

/**
 * Cancels an active order by updating its state.
 * @param state - The order state to cancel
 * @param time - Optional cancellation timestamp (defaults to current time)
 * @group Order Management
 */
export function cancelOrder(state: OrderState, time?: Date): void {
  state.status = "CANCELLED";
  state.modified = time ?? new Date();
}

/**
 * Convert a pending STOP/STOP_LIMIT order by updating its state.
 * @param state - The triggerred order state to convert
 * @param time - Optional conversion timestamp (defaults to current time)
 * @group Order Management
 */
export function convertOrder(state: OrderState, time?: Date): void {
  switch (state.type) {
    case "STOP":
      // convert to MARKET order
      state.type = "MARKET";
      state.status = "OPEN";
      state.modified = time ?? new Date();
      return;
    case "STOP_LIMIT":
      // convert to LIMIT order
      state.type = "LIMIT";
      state.status = "OPEN";
      state.modified = time ?? new Date();
      return;
    default:
    // no-op
  }
}

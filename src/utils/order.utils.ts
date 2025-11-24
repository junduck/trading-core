import type { Order } from "../types/order.js";

type OrderPrice =
  | { price?: never; stopPrice?: never }
  | { price: number; stopPrice?: never }
  | { price?: never; stopPrice: number };

type OrderOpts = OrderPrice & {
  id?: string;
  symbol: string;
  quant: number;
  create?: Date;
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
  const { id = "", symbol, quant, price, stopPrice, create = new Date() } = opts;

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
    created: create,
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
  const { id = "", symbol, quant, price, stopPrice, create = new Date() } = opts;

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
    created: create,
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
  const { id = "", symbol, quant, price, stopPrice, create = new Date() } = opts;

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
    created: create,
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
  const { id = "", symbol, quant, price, stopPrice, create = new Date() } = opts;

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
    created: create,
  };
}

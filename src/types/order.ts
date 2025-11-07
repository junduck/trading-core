/**
 * Type of order execution for SPOT markets
 */
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";

/**
 * Current status of the order
 */
export type OrderStatus =
  | "OPEN" // Order placed but not filled yet
  | "PARTIAL" // Partially filled
  | "FILLED" // Completely filled
  | "CANCELLED"; // Order cancelled

/**
 * Order action combining side and position effect.
 * Type-safe combinations ensure BUY can only open long or close short,
 * and SELL can only close long or open short.
 */
export type OrderAction =
  | { side: "BUY"; effect: "OPEN_LONG" }
  | { side: "BUY"; effect: "CLOSE_SHORT" }
  | { side: "SELL"; effect: "CLOSE_LONG" }
  | { side: "SELL"; effect: "OPEN_SHORT" };

/** Helper type for order side */
export type OrderSide = OrderAction["side"];

/** Helper type for position effect */
export type PositionEffect = OrderAction["effect"];

/**
 * Order represents the intent to trade.
 * Contains immutable order parameters that don't change during execution.
 * Uses OrderAction to ensure type-safe side/effect combinations.
 */
export type Order = OrderAction & {
  /** Unique identifier for this order */
  id: string;

  /** Symbol being traded (e.g., "BTCUSDT", "AAPL") */
  symbol: string;

  /** Type of order */
  type: OrderType;

  /** Total quantity intended to trade */
  quantity: number;

  /** Limit price (for LIMIT and STOP_LIMIT orders) */
  price?: number;

  /** Stop price (for STOP and STOP_LIMIT orders) */
  stopPrice?: number;

  /** When the order was created */
  created: Date;
};

/**
 * OrderState extends Order with execution state.
 * Tracks the current state of order execution (GTC - Good Till Cancelled).
 * Can be partially filled over multiple Fill records.
 */
export type OrderState = Order & {
  /** Quantity filled so far */
  filledQuantity: number;

  /** Remaining quantity to fill */
  remainingQuantity: number;

  /** Current status of the order */
  status: OrderStatus;

  /** When the order state was modified */
  modified: Date;
};

/**
 * Fill represents an actual execution of an order.
 * Multiple fills can occur for a single order (partial fills).
 * Uses OrderAction to ensure type-safe side/effect combinations.
 */
export type Fill = OrderAction & {
  /** Unique identifier for this fill (for audit trail) */
  id: string;

  /** Reference to the order that was filled */
  orderId: string;

  /** Symbol being traded */
  symbol: string;

  /** Quantity filled in this execution */
  quantity: number;

  /** Actual fill price (with slippage applied) */
  price: number;

  /** Commission paid for this fill */
  commission: number;

  /** When this fill occurred */
  created: Date;
};

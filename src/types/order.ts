/**
 * Type of order execution for SPOT markets
 * @group Order Management
 */
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";

/**
 * Current status of the order
 * @group Order Management
 */
export type OrderStatus =
  | "PENDING" // Stop order pending
  | "OPEN" // Order placed but not filled yet
  | "PARTIAL" // Partially filled
  | "FILLED" // Completely filled
  | "CANCELLED" // Order cancelled
  | "REJECT"; //Order rejected

/**
 * Order action combining side and position effect.
 * Type-safe combinations ensure BUY can only open long or close short,
 * and SELL can only close long or open short.
 * @group Order Management
 */
export type OrderAction =
  | { side: "BUY"; effect: "OPEN_LONG" }
  | { side: "BUY"; effect: "CLOSE_SHORT" }
  | { side: "SELL"; effect: "CLOSE_LONG" }
  | { side: "SELL"; effect: "OPEN_SHORT" };

/**
 * Helper type for order side
 * @group Order Management
 */
export type OrderSide = OrderAction["side"];

/**
 *  Helper type for position effect
 * @group Order Management
 */
export type PositionEffect = OrderAction["effect"];

/**
 * Order represents the intent to trade.
 * Contains immutable order parameters that don't change during execution.
 * Uses OrderAction to ensure type-safe side/effect combinations.
 * @group Order Management
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

  /** When the order was created (optional - intent time, not audit time) */
  created?: Date;
};

/**
 * OrderState extends Order with execution state.
 * Tracks the current state of order execution (GTC - Good Till Cancelled).
 * Can be partially filled over multiple Fill records.
 * @group Order Management
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
 * PartialOrder represents order data with optional fields.
 * Used for order updates, queries, or when only partial order information is available.
 * All fields are optional except for the required id field.
 * @group Order Management
 */
export type PartialOrder = {
  id: string;
  side?: "BUY" | "SELL";
  effect?: "OPEN_LONG" | "CLOSE_SHORT" | "CLOSE_LONG" | "OPEN_SHORT";
  symbol?: string;
  type?: OrderType;
  quantity?: number;
  price?: number;
  stopPrice?: number;
  created?: Date;
};

/**
 * Fill represents an actual execution of an order.
 * Multiple fills can occur for a single order (partial fills).
 * Uses OrderAction to ensure type-safe side/effect combinations.
 * @group Order Management
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

/**
 * Effect of processing a single fill on a position.
 * @group Order Management
 */
export interface FillEffect {
  /** The fill that was processed */
  fill: Fill;
  /** Cash flow from the fill (negative for buying, positive for selling) */
  cashFlow: number;
  /** Realized PnL from the fill (0 for opening positions, actual PnL for closing) */
  realisedPnL: number;
}

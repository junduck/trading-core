/**
 * Side of the order - buy or sell
 */
export type OrderSide = "BUY" | "SELL";

/**
 * Type of order execution for SPOT markets
 */
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";

/**
 * Time in force - how long the order remains active
 * - GTC: Good Till Cancelled - remains active until filled or cancelled
 * - IOC: Immediate Or Cancel - fill immediately or cancel unfilled portion
 * - FOK: Fill Or Kill - fill entire order immediately or cancel completely
 * - DAY: Valid until end of trading day
 */
export type TimeInForce = "GTC" | "IOC" | "FOK" | "DAY";

/**
 * Execution preferences for order matching (primarily for crypto exchanges)
 * - POST_ONLY: Order will only execute as maker (rejected if would take liquidity)
 * - ALLOW_TAKER: Order can execute as taker or maker (default behavior)
 * Note: Not all exchanges/markets support these flags (e.g., traditional stock markets)
 */
export type ExecutionPreference = "POST_ONLY" | "ALLOW_TAKER";

/**
 * Current status of the order
 */
export type OrderStatus =
  | "PENDING" // Order created but not yet submitted
  | "SUBMITTED" // Order submitted to exchange/broker
  | "ACCEPTED" // Order accepted by exchange/broker
  | "PARTIAL" // Partially filled
  | "FILLED" // Completely filled
  | "CANCELLED" // Cancelled by user
  | "REJECTED" // Rejected by exchange/broker
  | "EXPIRED"; // Expired due to time in force

/**
 * Represents a SPOT market trading order with all relevant details.
 * Used for both live trading and backtesting scenarios.
 * Does not track individual fills - use separate fill/trade records for audit trail.
 */
export interface Order {
  /** Unique identifier for this order */
  id: string;

  /** Client-assigned order ID (optional, for tracking) */
  clientOrderId?: string;

  /** Symbol being traded (e.g., "BTCUSDT", "AAPL") */
  symbol: string;

  /** Exchange where order is placed */
  exchange: string;

  /** Buy or sell */
  side: OrderSide;

  /** Type of order */
  type: OrderType;

  /** Time in force specification */
  timeInForce: TimeInForce;

  /** Execution preference (optional, not supported by all exchanges) */
  executionPreference?: ExecutionPreference;

  /** Total quantity to be traded */
  quantity: number;

  /** Limit price (required for LIMIT and STOP_LIMIT orders) */
  price?: number;

  /** Stop price (required for STOP and STOP_LIMIT orders) */
  stopPrice?: number;

  /** Current status of the order */
  status: OrderStatus;

  /** Quantity that has been filled */
  filledQuantity: number;

  /** Remaining quantity to be filled */
  remainingQuantity: number;

  /** Average price of filled portion */
  averagePrice: number;

  /** Total commission paid for this order (in asset's currency) */
  commission: number;

  /** When the order was created */
  createdAt: Date;

  /** When the order was last updated */
  updatedAt: Date;

  /** When the order was submitted (if applicable) */
  submittedAt?: Date;

  /** When the order was filled/cancelled/rejected (if applicable) */
  closedAt?: Date;

  /** Reason for rejection (if status is REJECTED) */
  rejectReason?: string;

  /** Additional metadata or notes */
  metadata?: Record<string, unknown>;
}

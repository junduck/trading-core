/**
 * Structured validation errors for order validation failures.
 * Each error type contains relevant fields to describe the failure.
 */
export type OrderValidationError =
  | {
      type: "INSUFFICIENT_CASH";
      required: number;
      available: number;
    }
  | {
      type: "INSUFFICIENT_POSITION";
      symbol: string;
      positionType: "LONG" | "SHORT";
      required: number;
      available: number;
    }
  | {
      type: "POSITION_NOT_FOUND";
      symbol: string;
      positionType: "LONG" | "SHORT";
    }
  | {
      type: "INVALID_PRICE";
      value?: number;
    }
  | {
      type: "INVALID_QUANTITY";
      value: number;
    }
  | {
      type: "INVALID_STOP_PRICE";
      value?: number;
    }
  | {
      type: "MISSING_PRICE";
    }
  | {
      type: "MISSING_STOP_PRICE";
    }
  | {
      type: "MARKET_DATA_MISSING";
      symbol: string;
    }
  | {
      type: "INVALID_STOP_DIRECTION";
      stopPrice: number;
      currentPrice: number;
      expectedDirection: "ABOVE" | "BELOW";
    };

/**
 * Validation result for order checks
 */
export interface OrderValidationResult {
  /** Whether the order is valid */
  valid: boolean;
  /** Structured error if invalid */
  error?: OrderValidationError;
}

// Re-export the main validation function
export { validateOrder } from "./order.validation.js";

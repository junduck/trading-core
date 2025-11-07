import type { Order } from "../types/order.js";
import type { Position } from "../types/position.js";
import type { MarketSnapshot } from "../types/market.js";
import type { OrderValidationResult } from "./order.utils.js";

/**
 * Validates a MARKET order against current position and market state.
 * MARKET orders execute immediately at current market price.
 *
 * @param order - The MARKET order to validate
 * @param position - Current position in the currency
 * @param snapshot - Current market prices (required for MARKET orders)
 * @returns Validation result with structured error if invalid
 */
function validateMarketOrder(
  order: Order,
  position: Position,
  snapshot: MarketSnapshot
): OrderValidationResult {
  const marketPrice = snapshot.price.get(order.symbol);
  if (!marketPrice) {
    return {
      valid: false,
      error: {
        type: "MARKET_DATA_MISSING",
        symbol: order.symbol,
      },
    };
  }

  switch (order.effect) {
    case "OPEN_LONG": {
      // Need enough cash to buy at market price (estimated)
      const cost = marketPrice * order.quantity;
      if (position.cash < cost) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_CASH",
            required: cost,
            available: position.cash,
          },
        };
      }
      return { valid: true };
    }

    case "CLOSE_LONG": {
      const longPos = position.long?.get(order.symbol);
      if (!longPos) {
        return {
          valid: false,
          error: {
            type: "POSITION_NOT_FOUND",
            symbol: order.symbol,
            positionType: "LONG",
          },
        };
      }
      if (longPos.quantity < order.quantity) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_POSITION",
            symbol: order.symbol,
            positionType: "LONG",
            required: order.quantity,
            available: longPos.quantity,
          },
        };
      }
      return { valid: true };
    }

    case "OPEN_SHORT": {
      // Selling to open short - no cash requirement
      return { valid: true };
    }

    case "CLOSE_SHORT": {
      const shortPos = position.short?.get(order.symbol);
      if (!shortPos) {
        return {
          valid: false,
          error: {
            type: "POSITION_NOT_FOUND",
            symbol: order.symbol,
            positionType: "SHORT",
          },
        };
      }
      if (shortPos.quantity < order.quantity) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_POSITION",
            symbol: order.symbol,
            positionType: "SHORT",
            required: order.quantity,
            available: shortPos.quantity,
          },
        };
      }

      // Need enough cash to buy at market price (estimated)
      const cost = marketPrice * order.quantity;
      if (position.cash < cost) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_CASH",
            required: cost,
            available: position.cash,
          },
        };
      }
      return { valid: true };
    }
  }
}

/**
 * Validates a LIMIT order against current position and market state.
 * LIMIT orders execute at specified price or better.
 *
 * @param order - The LIMIT order to validate
 * @param position - Current position in the currency
 * @param _snapshot - Current market prices (optional)
 * @returns Validation result with structured error if invalid
 */
function validateLimitOrder(
  order: Order,
  position: Position,
  _snapshot: MarketSnapshot
): OrderValidationResult {
  switch (order.effect) {
    case "OPEN_LONG": {
      const cost = order.price! * order.quantity;
      if (position.cash < cost) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_CASH",
            required: cost,
            available: position.cash,
          },
        };
      }
      return { valid: true };
    }

    case "CLOSE_LONG": {
      const longPos = position.long?.get(order.symbol);
      if (!longPos) {
        return {
          valid: false,
          error: {
            type: "POSITION_NOT_FOUND",
            symbol: order.symbol,
            positionType: "LONG",
          },
        };
      }
      if (longPos.quantity < order.quantity) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_POSITION",
            symbol: order.symbol,
            positionType: "LONG",
            required: order.quantity,
            available: longPos.quantity,
          },
        };
      }
      return { valid: true };
    }

    case "OPEN_SHORT": {
      // Selling to open short - no cash requirement
      return { valid: true };
    }

    case "CLOSE_SHORT": {
      const shortPos = position.short?.get(order.symbol);
      if (!shortPos) {
        return {
          valid: false,
          error: {
            type: "POSITION_NOT_FOUND",
            symbol: order.symbol,
            positionType: "SHORT",
          },
        };
      }
      if (shortPos.quantity < order.quantity) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_POSITION",
            symbol: order.symbol,
            positionType: "SHORT",
            required: order.quantity,
            available: shortPos.quantity,
          },
        };
      }

      const cost = order.price! * order.quantity;
      if (position.cash < cost) {
        return {
          valid: false,
          error: {
            type: "INSUFFICIENT_CASH",
            required: cost,
            available: position.cash,
          },
        };
      }
      return { valid: true };
    }
  }
}

/**
 * Validates stop order price direction makes sense vs current market.
 * Stop orders are triggers - no cash/position validation at placement.
 * Validation happens when the order is triggered and converted to MARKET/LIMIT.
 *
 * @param order - The STOP or STOP_LIMIT order to validate
 * @param snapshot - Current market prices (required for direction check)
 * @returns Validation result with structured error if invalid
 */
function validateStopOrderDirection(
  order: Order,
  snapshot: MarketSnapshot
): OrderValidationResult {
  const currentPrice = snapshot.price.get(order.symbol);
  if (!currentPrice) {
    return {
      valid: false,
      error: {
        type: "MARKET_DATA_MISSING",
        symbol: order.symbol,
      },
    };
  }

  const stopPrice = order.stopPrice!;

  switch (order.effect) {
    case "OPEN_LONG":
    case "CLOSE_SHORT":
      // Stop-buy: trigger must be above current price (breakout/stop-loss)
      if (stopPrice <= currentPrice) {
        return {
          valid: false,
          error: {
            type: "INVALID_STOP_DIRECTION",
            stopPrice,
            currentPrice,
            expectedDirection: "ABOVE",
          },
        };
      }
      return { valid: true };

    case "CLOSE_LONG":
    case "OPEN_SHORT":
      // Stop-sell: trigger must be below current price (stop-loss/breakdown)
      if (stopPrice >= currentPrice) {
        return {
          valid: false,
          error: {
            type: "INVALID_STOP_DIRECTION",
            stopPrice,
            currentPrice,
            expectedDirection: "BELOW",
          },
        };
      }
      return { valid: true };
  }
}

/**
 * Main dispatcher for order validation.
 * Validates order structure and delegates to type-specific validators.
 *
 * @param order - The order to validate
 * @param position - Current position in the currency
 * @param snapshot - Current market prices (optional, but recommended)
 * @returns Validation result with structured error if invalid
 */
export function validateOrder(
  order: Order,
  position: Position,
  snapshot: MarketSnapshot
): OrderValidationResult {
  // Validate quantity
  if (order.quantity <= 0) {
    return {
      valid: false,
      error: {
        type: "INVALID_QUANTITY",
        value: order.quantity,
      },
    };
  }

  // Dispatch to type-specific validator
  switch (order.type) {
    case "MARKET":
      return validateMarketOrder(order, position, snapshot);

    case "LIMIT":
      // Validate price is set
      if (order.price === undefined || order.price === null) {
        return {
          valid: false,
          error: { type: "MISSING_PRICE" },
        };
      }
      if (order.price <= 0) {
        return {
          valid: false,
          error: {
            type: "INVALID_PRICE",
            value: order.price,
          },
        };
      }
      return validateLimitOrder(order, position, snapshot);

    case "STOP":
      // Validate stopPrice is set
      if (order.stopPrice === undefined || order.stopPrice === null) {
        return {
          valid: false,
          error: { type: "MISSING_STOP_PRICE" },
        };
      }
      if (order.stopPrice <= 0) {
        return {
          valid: false,
          error: {
            type: "INVALID_STOP_PRICE",
            value: order.stopPrice,
          },
        };
      }
      // STOP orders are triggers - only validate direction sanity
      // No cash/position validation at placement time
      return validateStopOrderDirection(order, snapshot);

    case "STOP_LIMIT":
      // Validate both price and stopPrice are set
      if (order.price === undefined || order.price === null) {
        return {
          valid: false,
          error: { type: "MISSING_PRICE" },
        };
      }
      if (order.price <= 0) {
        return {
          valid: false,
          error: {
            type: "INVALID_PRICE",
            value: order.price,
          },
        };
      }
      if (order.stopPrice === undefined || order.stopPrice === null) {
        return {
          valid: false,
          error: { type: "MISSING_STOP_PRICE" },
        };
      }
      if (order.stopPrice <= 0) {
        return {
          valid: false,
          error: {
            type: "INVALID_STOP_PRICE",
            value: order.stopPrice,
          },
        };
      }
      // STOP_LIMIT orders are triggers - only validate direction sanity
      // No cash/position validation at placement time
      return validateStopOrderDirection(order, snapshot);
  }
}

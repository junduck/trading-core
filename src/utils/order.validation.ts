import type { Order } from "../types/order.js";
import type { Position } from "../types/position.js";
import type { MarketSnapshot } from "../types/market.js";
import type { OrderValidationResult } from "./order.utils.js";

/**
 * Validates that price field exists and is positive.
 */
function validatePriceField(
  price: number | undefined | null
): OrderValidationResult {
  if (price === undefined || price === null) {
    return {
      valid: false,
      error: { type: "MISSING_PRICE" },
    };
  }
  if (price <= 0) {
    return {
      valid: false,
      error: {
        type: "INVALID_PRICE",
        value: price,
      },
    };
  }
  return { valid: true };
}

/**
 * Validates that stopPrice field exists and is positive.
 */
function validateStopPriceField(
  stopPrice: number | undefined | null
): OrderValidationResult {
  if (stopPrice === undefined || stopPrice === null) {
    return {
      valid: false,
      error: { type: "MISSING_STOP_PRICE" },
    };
  }
  if (stopPrice <= 0) {
    return {
      valid: false,
      error: {
        type: "INVALID_STOP_PRICE",
        value: stopPrice,
      },
    };
  }
  return { valid: true };
}

/**
 * Validates OPEN_LONG effect - requires sufficient cash at the given price.
 */
function validateOpenLongEffect(
  quantity: number,
  price: number,
  position: Position
): OrderValidationResult {
  const cost = price * quantity;
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

/**
 * Validates CLOSE_LONG effect - requires sufficient long position.
 */
function validateCloseLongEffect(
  symbol: string,
  quantity: number,
  position: Position
): OrderValidationResult {
  const longPos = position.long?.get(symbol);
  if (!longPos) {
    return {
      valid: false,
      error: {
        type: "POSITION_NOT_FOUND",
        symbol: symbol,
        positionType: "LONG",
      },
    };
  }
  if (longPos.quantity < quantity) {
    return {
      valid: false,
      error: {
        type: "INSUFFICIENT_POSITION",
        symbol: symbol,
        positionType: "LONG",
        required: quantity,
        available: longPos.quantity,
      },
    };
  }
  return { valid: true };
}

/**
 * Validates OPEN_SHORT effect - no requirements (selling to open short).
 */
function validateOpenShortEffect(): OrderValidationResult {
  return { valid: true };
}

/**
 * Validates CLOSE_SHORT effect - requires sufficient short position and cash to cover.
 */
function validateCloseShortEffect(
  symbol: string,
  quantity: number,
  price: number,
  position: Position
): OrderValidationResult {
  const shortPos = position.short?.get(symbol);
  if (!shortPos) {
    return {
      valid: false,
      error: {
        type: "POSITION_NOT_FOUND",
        symbol: symbol,
        positionType: "SHORT",
      },
    };
  }
  if (shortPos.quantity < quantity) {
    return {
      valid: false,
      error: {
        type: "INSUFFICIENT_POSITION",
        symbol: symbol,
        positionType: "SHORT",
        required: quantity,
        available: shortPos.quantity,
      },
    };
  }

  // Need enough cash to buy at the given price to cover short
  const cost = price * quantity;
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
    case "OPEN_LONG":
      return validateOpenLongEffect(order.quantity, marketPrice, position);

    case "CLOSE_LONG":
      return validateCloseLongEffect(order.symbol, order.quantity, position);

    case "OPEN_SHORT":
      return validateOpenShortEffect();

    case "CLOSE_SHORT":
      return validateCloseShortEffect(
        order.symbol,
        order.quantity,
        marketPrice,
        position
      );
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
    case "OPEN_LONG":
      return validateOpenLongEffect(order.quantity, order.price!, position);

    case "CLOSE_LONG":
      return validateCloseLongEffect(order.symbol, order.quantity, position);

    case "OPEN_SHORT":
      return validateOpenShortEffect();

    case "CLOSE_SHORT":
      return validateCloseShortEffect(
        order.symbol,
        order.quantity,
        order.price!,
        position
      );
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

    case "LIMIT": {
      const priceValidation = validatePriceField(order.price);
      if (!priceValidation.valid) {
        return priceValidation;
      }
      return validateLimitOrder(order, position, snapshot);
    }

    case "STOP": {
      const stopPriceValidation = validateStopPriceField(order.stopPrice);
      if (!stopPriceValidation.valid) {
        return stopPriceValidation;
      }
      return validateStopOrderDirection(order, snapshot);
    }

    case "STOP_LIMIT": {
      const priceValidation = validatePriceField(order.price);
      if (!priceValidation.valid) {
        return priceValidation;
      }
      const stopPriceValidation = validateStopPriceField(order.stopPrice);
      if (!stopPriceValidation.valid) {
        return stopPriceValidation;
      }
      return validateStopOrderDirection(order, snapshot);
    }
  }
}

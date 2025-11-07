import { describe, it, expect } from "vitest";
import { validateOrder } from "../../src/utils/order.validation.js";
import type { Order } from "../../src/types/order.js";
import type { Position } from "../../src/types/position.js";
import type { MarketSnapshot } from "../../src/types/market.js";

describe("Order Validation", () => {
  const basePosition: Position = {
    cash: 10000,
    long: new Map([["AAPL", { quantity: 100 }]]),
    short: new Map([["TSLA", { quantity: 50 }]]),
  };

  const snapshot: MarketSnapshot = {
    timestamp: new Date("2024-01-01"),
    price: new Map([
      ["AAPL", 100],
      ["TSLA", 150],
      ["MSFT", 300],
    ]),
  };

  describe("MARKET orders", () => {
    it("should validate OPEN_LONG with sufficient cash", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "MARKET",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should reject OPEN_LONG with insufficient cash", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "MARKET",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 200,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("INSUFFICIENT_CASH");
    });

    it("should validate CLOSE_LONG with sufficient position", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "MARKET",
        side: "SELL",
        effect: "CLOSE_LONG",
        quantity: 50,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should reject CLOSE_LONG with insufficient position", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "MARKET",
        side: "SELL",
        effect: "CLOSE_LONG",
        quantity: 200,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("INSUFFICIENT_POSITION");
    });
  });

  describe("LIMIT orders", () => {
    it("should validate OPEN_LONG with sufficient cash", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "LIMIT",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        price: 100,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should reject LIMIT order with missing price", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "LIMIT",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("MISSING_PRICE");
    });
  });

  describe("STOP orders - direction validation only", () => {
    it("should validate OPEN_LONG (stop-buy) when stopPrice > currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        stopPrice: 150, // currentPrice is 100
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should reject OPEN_LONG (stop-buy) when stopPrice <= currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        stopPrice: 80, // currentPrice is 100
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("INVALID_STOP_DIRECTION");
    });

    it("should validate CLOSE_LONG (stop-sell) when stopPrice < currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "SELL",
        effect: "CLOSE_LONG",
        quantity: 50,
        stopPrice: 80, // currentPrice is 100
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should reject CLOSE_LONG (stop-sell) when stopPrice >= currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "SELL",
        effect: "CLOSE_LONG",
        quantity: 50,
        stopPrice: 150, // currentPrice is 100
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("INVALID_STOP_DIRECTION");
    });

    it("should validate CLOSE_SHORT (stop-buy to cover) when stopPrice > currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "TSLA",
        type: "STOP",
        side: "BUY",
        effect: "CLOSE_SHORT",
        quantity: 20,
        stopPrice: 200, // currentPrice is 150
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should validate OPEN_SHORT (stop-sell short) when stopPrice < currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "MSFT",
        type: "STOP",
        side: "SELL",
        effect: "OPEN_SHORT",
        quantity: 10,
        stopPrice: 250, // currentPrice is 300
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should NOT check cash for OPEN_LONG stop orders at placement", () => {
      const poorPosition: Position = {
        cash: 100, // Not enough for 50 shares at stopPrice 150
        long: new Map(),
        short: new Map(),
      };

      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        stopPrice: 150, // Would cost 7500
        created: new Date(),
      };

      // Should pass validation at placement despite insufficient cash
      const result = validateOrder(order, poorPosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should NOT check position for CLOSE_LONG stop orders at placement", () => {
      const emptyPosition: Position = {
        cash: 10000,
        long: new Map(), // No AAPL position
        short: new Map(),
      };

      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "SELL",
        effect: "CLOSE_LONG",
        quantity: 50,
        stopPrice: 80,
        created: new Date(),
      };

      // Should pass validation at placement despite no position
      const result = validateOrder(order, emptyPosition, snapshot);
      expect(result.valid).toBe(true);
    });
  });

  describe("STOP_LIMIT orders - direction validation only", () => {
    it("should validate OPEN_LONG when stopPrice > currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP_LIMIT",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        stopPrice: 150,
        price: 155,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(true);
    });

    it("should reject CLOSE_LONG when stopPrice >= currentPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP_LIMIT",
        side: "SELL",
        effect: "CLOSE_LONG",
        quantity: 50,
        stopPrice: 150,
        price: 145,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("INVALID_STOP_DIRECTION");
    });

    it("should NOT check cash for STOP_LIMIT orders at placement", () => {
      const poorPosition: Position = {
        cash: 100,
        long: new Map(),
        short: new Map(),
      };

      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP_LIMIT",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        stopPrice: 150,
        price: 155,
        created: new Date(),
      };

      // Should pass despite insufficient cash
      const result = validateOrder(order, poorPosition, snapshot);
      expect(result.valid).toBe(true);
    });
  });

  describe("Invalid orders", () => {
    it("should reject order with invalid quantity", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "MARKET",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 0,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("INVALID_QUANTITY");
    });

    it("should reject STOP order with missing stopPrice", () => {
      const order: Order = {
        id: "1",
        symbol: "AAPL",
        type: "STOP",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("MISSING_STOP_PRICE");
    });

    it("should reject order when market data is missing", () => {
      const order: Order = {
        id: "1",
        symbol: "UNKNOWN",
        type: "MARKET",
        side: "BUY",
        effect: "OPEN_LONG",
        quantity: 50,
        created: new Date(),
      };

      const result = validateOrder(order, basePosition, snapshot);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe("MARKET_DATA_MISSING");
    });
  });
});

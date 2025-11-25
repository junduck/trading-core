import { describe, it, expect } from "vitest";
import {
  buyOrder,
  acceptOrder,
  rejectOrder,
  cancelOrder,
} from "../../src/utils/order.utils.js";

describe("Order Lifecycle Functions", () => {
  describe("acceptOrder", () => {
    it("should create OrderState with OPEN status", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10, price: 50000 });
      const state = acceptOrder(order);

      expect(state.id).toBe(order.id);
      expect(state.symbol).toBe("BTC");
      expect(state.quantity).toBe(10);
      expect(state.filledQuantity).toBe(0);
      expect(state.remainingQuantity).toBe(10);
      expect(state.status).toBe("OPEN");
      expect(state.modified).toBeInstanceOf(Date);
    });

    it("should preserve all order properties", () => {
      const order = buyOrder({
        id: "order-123",
        symbol: "BTC",
        quant: 10,
        price: 50000,
      });
      const state = acceptOrder(order);

      expect(state.side).toBe("BUY");
      expect(state.effect).toBe("OPEN_LONG");
      expect(state.type).toBe("LIMIT");
      expect(state.price).toBe(50000);
    });

    it("should use provided timestamp", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10 });
      const timestamp = new Date("2025-01-01T00:00:00Z");
      const state = acceptOrder(order, timestamp);

      expect(state.modified).toEqual(timestamp);
    });
  });

  describe("rejectOrder", () => {
    it("should create OrderState with REJECT status", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10, price: 50000 });
      const state = rejectOrder(order);

      expect(state.id).toBe(order.id);
      expect(state.symbol).toBe("BTC");
      expect(state.quantity).toBe(10);
      expect(state.filledQuantity).toBe(0);
      expect(state.remainingQuantity).toBe(10);
      expect(state.status).toBe("REJECT");
      expect(state.modified).toBeInstanceOf(Date);
    });

    it("should use provided timestamp", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10 });
      const timestamp = new Date("2025-01-01T00:00:00Z");
      const state = rejectOrder(order, timestamp);

      expect(state.modified).toEqual(timestamp);
    });
  });

  describe("cancelOrder", () => {
    it("should update OrderState to CANCELLED", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10, price: 50000 });
      const state = acceptOrder(order);

      expect(state.status).toBe("OPEN");

      cancelOrder(state);

      expect(state.status).toBe("CANCELLED");
      expect(state.modified).toBeInstanceOf(Date);
    });

    it("should use provided timestamp", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10 });
      const state = acceptOrder(order);
      const timestamp = new Date("2025-01-01T00:00:00Z");

      cancelOrder(state, timestamp);

      expect(state.status).toBe("CANCELLED");
      expect(state.modified).toEqual(timestamp);
    });

    it("should work on partially filled orders", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10, price: 50000 });
      const state = acceptOrder(order);

      // Simulate partial fill
      state.filledQuantity = 5;
      state.remainingQuantity = 5;
      state.status = "PARTIAL";

      cancelOrder(state);

      expect(state.status).toBe("CANCELLED");
      expect(state.filledQuantity).toBe(5);
      expect(state.remainingQuantity).toBe(5);
    });
  });

  describe("Complete workflow", () => {
    it("should demonstrate order -> accept -> cancel workflow", () => {
      // Create order
      const order = buyOrder({
        id: "order-1",
        symbol: "BTC",
        quant: 100,
        price: 50000,
      });

      // Accept order
      const state = acceptOrder(order);
      expect(state.status).toBe("OPEN");
      expect(state.remainingQuantity).toBe(100);

      // Cancel order
      cancelOrder(state);
      expect(state.status).toBe("CANCELLED");
    });

    it("should demonstrate order -> reject workflow", () => {
      // Create order
      const order = buyOrder({
        id: "order-2",
        symbol: "BTC",
        quant: 100,
        price: 50000,
      });

      // Reject order
      const state = rejectOrder(order);
      expect(state.status).toBe("REJECT");
      expect(state.remainingQuantity).toBe(100);
    });
  });
});

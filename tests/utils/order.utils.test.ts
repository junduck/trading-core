import { describe, it, expect } from "vitest";
import {
  buyOrder,
  sellOrder,
  shortOrder,
  coverOrder,
} from "../../src/utils/order.utils.js";

describe("Order Factory Functions", () => {
  describe("buyOrder", () => {
    it("should create MARKET order when no price specified", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10 });

      expect(order.type).toBe("MARKET");
      expect(order.side).toBe("BUY");
      expect(order.effect).toBe("OPEN_LONG");
      expect(order.quantity).toBe(10);
      expect(order.symbol).toBe("BTC");
      expect(order.id).toBe("");
      expect(order.price).toBeUndefined();
      expect(order.stopPrice).toBeUndefined();
    });

    it("should create LIMIT order when price specified", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10, price: 100 });

      expect(order.type).toBe("LIMIT");
      expect(order.price).toBe(100);
      expect(order.stopPrice).toBeUndefined();
    });

    it("should create STOP order when stopPrice specified", () => {
      const order = buyOrder({ symbol: "BTC", quant: 10, stopPrice: 100 });

      expect(order.type).toBe("STOP");
      expect(order.stopPrice).toBe(100);
      expect(order.price).toBeUndefined();
    });

    it("should use provided id and create date", () => {
      const date = new Date("2024-01-01");
      const order = buyOrder({
        symbol: "BTC",
        quant: 10,
        id: "order-1",
        created: date,
      });

      expect(order.id).toBe("order-1");
      expect(order.created).toBe(date);
    });
  });

  describe("sellOrder", () => {
    it("should create MARKET order with CLOSE_LONG effect", () => {
      const order = sellOrder({ symbol: "BTC", quant: 10 });

      expect(order.type).toBe("MARKET");
      expect(order.side).toBe("SELL");
      expect(order.effect).toBe("CLOSE_LONG");
      expect(order.quantity).toBe(10);
    });

    it("should create LIMIT order when price specified", () => {
      const order = sellOrder({ symbol: "BTC", quant: 10, price: 100 });

      expect(order.type).toBe("LIMIT");
      expect(order.price).toBe(100);
    });

    it("should create STOP order when stopPrice specified", () => {
      const order = sellOrder({ symbol: "BTC", quant: 10, stopPrice: 100 });

      expect(order.type).toBe("STOP");
      expect(order.stopPrice).toBe(100);
    });
  });

  describe("shortOrder", () => {
    it("should create MARKET order with OPEN_SHORT effect", () => {
      const order = shortOrder({ symbol: "BTC", quant: 10 });

      expect(order.type).toBe("MARKET");
      expect(order.side).toBe("SELL");
      expect(order.effect).toBe("OPEN_SHORT");
      expect(order.quantity).toBe(10);
    });

    it("should create LIMIT order when price specified", () => {
      const order = shortOrder({ symbol: "BTC", quant: 10, price: 100 });

      expect(order.type).toBe("LIMIT");
      expect(order.price).toBe(100);
    });

    it("should create STOP order when stopPrice specified", () => {
      const order = shortOrder({ symbol: "BTC", quant: 10, stopPrice: 100 });

      expect(order.type).toBe("STOP");
      expect(order.stopPrice).toBe(100);
    });
  });

  describe("coverOrder", () => {
    it("should create MARKET order with CLOSE_SHORT effect", () => {
      const order = coverOrder({ symbol: "BTC", quant: 10 });

      expect(order.type).toBe("MARKET");
      expect(order.side).toBe("BUY");
      expect(order.effect).toBe("CLOSE_SHORT");
      expect(order.quantity).toBe(10);
    });

    it("should create LIMIT order when price specified", () => {
      const order = coverOrder({ symbol: "BTC", quant: 10, price: 100 });

      expect(order.type).toBe("LIMIT");
      expect(order.price).toBe(100);
    });

    it("should create STOP order when stopPrice specified", () => {
      const order = coverOrder({ symbol: "BTC", quant: 10, stopPrice: 100 });

      expect(order.type).toBe("STOP");
      expect(order.stopPrice).toBe(100);
    });
  });
});

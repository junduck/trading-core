import { describe, it, expect, beforeEach } from "vitest";
import { applyFill, applyFills } from "../../src/utils/fill.utils.js";
import type { Position } from "../../src/types/position.js";
import type { Fill } from "../../src/types/order.js";

function createTestPosition(cash: number = 100_000): Position {
  const now = new Date();
  return {
    cash,
    long: new Map(),
    short: new Map(),
    totalCommission: 0,
    realisedPnL: 0,
    modified: now,
  };
}

function createFill(
  id: string,
  orderId: string,
  symbol: string,
  side: "BUY" | "SELL",
  effect: "OPEN_LONG" | "CLOSE_LONG" | "OPEN_SHORT" | "CLOSE_SHORT",
  price: number,
  quantity: number,
  commission: number,
  timestamp: Date = new Date()
): Fill {
  return {
    id,
    orderId,
    symbol,
    side,
    effect,
    price,
    quantity,
    commission,
    created: timestamp,
  } as Fill;
}

describe("Fill Utils - applyFill", () => {
  let position: Position;
  const testTime = new Date("2025-01-01T00:00:00Z");

  beforeEach(() => {
    position = createTestPosition(100_000);
  });

  describe("1. Single Fill - Open Long Position", () => {
    it("should open long position and return correct result", () => {
      const fill = createFill(
        "fill-1",
        "order-1",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        100,
        10,
        100,
        testTime
      );

      const result = applyFill(position, fill);

      // Verify result
      expect(result.fills).toEqual([fill]);
      expect(result.cashFlow).toBe(-1100); // -(100 * 10 + 100)
      expect(result.realisedPnL).toBe(0);

      // Verify position
      expect(position.cash).toBe(98_900);
      expect(position.totalCommission).toBe(100);

      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(10);
      expect(longPosition!.totalCost).toBe(1_100);
    });
  });

  describe("2. Multiple Fills - Open and Close Long", () => {
    it("should open and then close long position with correct PnL", () => {
      const fill1 = createFill(
        "fill-1",
        "order-1",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        100,
        10,
        100,
        testTime
      );
      const fill2 = createFill(
        "fill-2",
        "order-2",
        "AAPL",
        "SELL",
        "CLOSE_LONG",
        110,
        5,
        110,
        testTime
      );

      // Apply first fill
      const result1 = applyFill(position, fill1);
      expect(result1.cashFlow).toBe(-1100);
      expect(result1.realisedPnL).toBe(0);
      expect(position.cash).toBe(98_900);

      // Apply second fill
      const result2 = applyFill(position, fill2);
      expect(result2.cashFlow).toBe(440); // 110 * 5 - 110
      expect(result2.realisedPnL).toBe(-110); // 440 - 550 (cost of 5 shares)
      expect(position.cash).toBe(99_340); // 98,900 + 440

      // Verify final position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition!.quantity).toBe(5);
      expect(longPosition!.totalCost).toBe(550);
      expect(longPosition!.realisedPnL).toBe(-110);
      expect(position.totalCommission).toBe(210);
    });
  });

  describe("3. Single Fill - Open Short Position", () => {
    it("should open short position and return correct result", () => {
      const fill = createFill(
        "fill-1",
        "order-1",
        "TSLA",
        "SELL",
        "OPEN_SHORT",
        200,
        10,
        200,
        testTime
      );

      const result = applyFill(position, fill);

      // Verify result
      expect(result.fills).toEqual([fill]);
      expect(result.cashFlow).toBe(1800); // 200 * 10 - 200
      expect(result.realisedPnL).toBe(0);

      // Verify position
      expect(position.cash).toBe(101_800);
      expect(position.totalCommission).toBe(200);

      const shortPosition = position.short?.get("TSLA");
      expect(shortPosition).toBeDefined();
      expect(shortPosition!.quantity).toBe(10);
      expect(shortPosition!.totalProceeds).toBe(1_800);
    });
  });

  describe("4. Multiple Fills - Open and Close Short", () => {
    it("should open and then close short position with correct PnL", () => {
      const fill1 = createFill(
        "fill-1",
        "order-1",
        "TSLA",
        "SELL",
        "OPEN_SHORT",
        200,
        10,
        200,
        testTime
      );
      const fill2 = createFill(
        "fill-2",
        "order-2",
        "TSLA",
        "BUY",
        "CLOSE_SHORT",
        180,
        5,
        180,
        testTime
      );

      // Apply first fill
      const result1 = applyFill(position, fill1);
      expect(result1.cashFlow).toBe(1800);
      expect(result1.realisedPnL).toBe(0);
      expect(position.cash).toBe(101_800);

      // Apply second fill
      const result2 = applyFill(position, fill2);
      expect(result2.cashFlow).toBe(-1080); // -(180 * 5 + 180)
      // PnL calculation: proceeds for 5 shares = 1800/10*5 = 900, cost = 1080, PnL = 900 - 1080 = -180
      expect(result2.realisedPnL).toBe(-180);
      expect(position.cash).toBe(100_720); // 101,800 - 1,080

      // Verify final position
      const shortPosition = position.short?.get("TSLA");
      expect(shortPosition!.quantity).toBe(5);
      expect(shortPosition!.totalProceeds).toBe(900);
      expect(shortPosition!.realisedPnL).toBe(-180);
      expect(position.totalCommission).toBe(380);
    });
  });

  describe("5. FIFO vs LIFO Close Strategy", () => {
    it("should use FIFO by default and close oldest lot first", () => {
      const fill1 = createFill(
        "fill-1",
        "order-1",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        100,
        5,
        100,
        testTime
      );
      const fill2 = createFill(
        "fill-2",
        "order-2",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        120,
        5,
        120,
        testTime
      );
      const fill3 = createFill(
        "fill-3",
        "order-3",
        "AAPL",
        "SELL",
        "CLOSE_LONG",
        110,
        5,
        110,
        testTime
      );

      applyFill(position, fill1);
      applyFill(position, fill2);
      const result = applyFill(position, fill3, "FIFO");

      // FIFO closes first lot at 100 (cost=600)
      // PnL = (110*5 - 110) - 600 = 440 - 600 = -160
      expect(result.realisedPnL).toBe(-160);

      const longPosition = position.long?.get("AAPL");
      expect(longPosition!.quantity).toBe(5);
      expect(longPosition!.lots[0].price).toBe(120); // Second lot remains
    });

    it("should use LIFO and close newest lot first", () => {
      position = createTestPosition(100_000);

      const fill1 = createFill(
        "fill-1",
        "order-1",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        100,
        5,
        100,
        testTime
      );
      const fill2 = createFill(
        "fill-2",
        "order-2",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        120,
        5,
        120,
        testTime
      );
      const fill3 = createFill(
        "fill-3",
        "order-3",
        "AAPL",
        "SELL",
        "CLOSE_LONG",
        110,
        5,
        110,
        testTime
      );

      applyFill(position, fill1);
      applyFill(position, fill2);
      const result = applyFill(position, fill3, "LIFO");

      // LIFO closes second lot at 120 (cost=720)
      // PnL = (110*5 - 110) - 720 = 440 - 720 = -280
      expect(result.realisedPnL).toBe(-280);

      const longPosition = position.long?.get("AAPL");
      expect(longPosition!.quantity).toBe(5);
      expect(longPosition!.lots[0].price).toBe(100); // First lot remains
    });
  });

  describe("6. Error Handling - Close Non-Existent Position", () => {
    it("should throw error when closing non-existent long position", () => {
      const fill = createFill(
        "fill-1",
        "order-1",
        "AAPL",
        "SELL",
        "CLOSE_LONG",
        100,
        10,
        100,
        testTime
      );

      expect(() => applyFill(position, fill)).toThrow(
        "No long position found for AAPL"
      );
    });

    it("should throw error when closing non-existent short position", () => {
      const fill = createFill(
        "fill-1",
        "order-1",
        "TSLA",
        "BUY",
        "CLOSE_SHORT",
        200,
        10,
        200,
        testTime
      );

      expect(() => applyFill(position, fill)).toThrow(
        "No short position found for TSLA"
      );
    });
  });

  describe("7. Mixed Long and Short Positions", () => {
    it("should handle both long and short positions in same currency", () => {
      const fill1 = createFill(
        "fill-1",
        "order-1",
        "AAPL",
        "BUY",
        "OPEN_LONG",
        100,
        10,
        100,
        testTime
      );
      const fill2 = createFill(
        "fill-2",
        "order-2",
        "TSLA",
        "SELL",
        "OPEN_SHORT",
        200,
        5,
        200,
        testTime
      );

      const result1 = applyFill(position, fill1);
      const result2 = applyFill(position, fill2);

      expect(result1.cashFlow).toBe(-1100);
      expect(result2.cashFlow).toBe(800); // 200 * 5 - 200

      // Verify both positions exist
      expect(position.long?.get("AAPL")?.quantity).toBe(10);
      expect(position.short?.get("TSLA")?.quantity).toBe(5);
      expect(position.cash).toBe(99_700); // 100,000 - 1,100 + 800
    });
  });
});

describe("Fill Utils - applyFills", () => {
  let position: Position;
  const testTime = new Date("2025-01-01T00:00:00Z");

  beforeEach(() => {
    position = createTestPosition(100_000);
  });

  describe("8. Batch Processing - Multiple Fills", () => {
    it("should apply multiple fills and return cumulative result", () => {
      const fills = [
        createFill(
          "fill-1",
          "order-1",
          "AAPL",
          "BUY",
          "OPEN_LONG",
          100,
          10,
          100,
          testTime
        ),
        createFill(
          "fill-2",
          "order-2",
          "AAPL",
          "BUY",
          "OPEN_LONG",
          110,
          10,
          110,
          testTime
        ),
        createFill(
          "fill-3",
          "order-3",
          "AAPL",
          "SELL",
          "CLOSE_LONG",
          115,
          10,
          115,
          testTime
        ),
      ];

      const result = applyFills(position, fills);

      // Verify result contains all fills
      expect(result.fills).toHaveLength(3);
      expect(result.fills).toEqual(fills);

      // Verify cumulative cash flow
      // Fill 1: -1,100
      // Fill 2: -1,210
      // Fill 3: +1,035 (115 * 10 - 115)
      expect(result.cashFlow).toBe(-1275); // -1,100 - 1,210 + 1,035

      // Verify cumulative PnL
      // Fill 1: 0
      // Fill 2: 0
      // Fill 3: closes 10 shares with FIFO (closes entire first lot with totalCost=1,100)
      // PnL = 1,035 - 1,100 = -65
      expect(result.realisedPnL).toBe(-65);

      // Verify final position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition!.quantity).toBe(10);
      expect(longPosition!.totalCost).toBe(1_210);
      expect(position.cash).toBe(98_725); // 100,000 - 1,275
    });
  });

  describe("9. Partial Fills - Same Order ID", () => {
    it("should apply partial fills from same order independently", () => {
      const fills = [
        createFill(
          "fill-1",
          "order-1",
          "AAPL",
          "BUY",
          "OPEN_LONG",
          100,
          5,
          50,
          testTime
        ),
        createFill(
          "fill-2",
          "order-1",
          "AAPL",
          "BUY",
          "OPEN_LONG",
          100,
          5,
          50,
          testTime
        ),
      ];

      const result = applyFills(position, fills);

      expect(result.fills).toHaveLength(2);
      expect(result.cashFlow).toBe(-1100); // -(100*5+50) * 2

      const longPosition = position.long?.get("AAPL");
      expect(longPosition!.quantity).toBe(10);
      expect(longPosition!.totalCost).toBe(1_100);
      expect(longPosition!.lots).toHaveLength(2);
    });
  });

  describe("10. Commission Allocation", () => {
    it("should properly allocate commission across multiple fills", () => {
      const fills = [
        createFill(
          "fill-1",
          "order-1",
          "AAPL",
          "BUY",
          "OPEN_LONG",
          100,
          10,
          100,
          testTime
        ),
        createFill(
          "fill-2",
          "order-2",
          "AAPL",
          "SELL",
          "CLOSE_LONG",
          110,
          10,
          110,
          testTime
        ),
      ];

      const result = applyFills(position, fills);

      // Verify total commission tracked
      expect(position.totalCommission).toBe(210);

      // Verify commission included in PnL calculation
      // Proceeds: 110 * 10 - 110 = 990
      // Cost: 100 * 10 + 100 = 1,100
      // PnL: 990 - 1,100 = -110
      expect(result.realisedPnL).toBe(-110);
    });
  });

  describe("11. Empty Fills Array", () => {
    it("should handle empty fills array gracefully", () => {
      const result = applyFills(position, []);

      expect(result.fills).toHaveLength(0);
      expect(result.cashFlow).toBe(0);
      expect(result.realisedPnL).toBe(0);
      expect(position.cash).toBe(100_000);
    });
  });

  describe("12. Complex Scenario - Multiple Symbols and Directions", () => {
    it("should handle complex fill sequence correctly", () => {
      const fills = [
        createFill(
          "fill-1",
          "order-1",
          "AAPL",
          "BUY",
          "OPEN_LONG",
          100,
          10,
          100,
          testTime
        ),
        createFill(
          "fill-2",
          "order-2",
          "TSLA",
          "SELL",
          "OPEN_SHORT",
          200,
          5,
          200,
          testTime
        ),
        createFill(
          "fill-3",
          "order-3",
          "AAPL",
          "SELL",
          "CLOSE_LONG",
          110,
          5,
          110,
          testTime
        ),
        createFill(
          "fill-4",
          "order-4",
          "TSLA",
          "BUY",
          "CLOSE_SHORT",
          190,
          3,
          190,
          testTime
        ),
      ];

      const result = applyFills(position, fills);

      expect(result.fills).toHaveLength(4);

      // Verify final positions
      const applePos = position.long?.get("AAPL");
      expect(applePos?.quantity).toBe(5);

      const teslaPos = position.short?.get("TSLA");
      expect(teslaPos?.quantity).toBe(2);

      // Verify cumulative results
      expect(position.totalCommission).toBe(600);
      expect(position.realisedPnL).toBe(result.realisedPnL);
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { openLong, closeLong } from "../../src/utils/position.utils.js";
import type { Position } from "../../src/types/position.js";
import { round } from "./position-test-helper.js";

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

describe("Position Utils - Long Position Operations", () => {
  let position: Position;

  beforeEach(() => {
    position = createTestPosition(100_000);
  });

  describe("1. Open Long - Single Lot", () => {
    it("should open a long position with correct cash, quantity, cost", () => {
      // Step 1: Open Long - price=100, qty=10, commission=100
      openLong(position, "AAPL", 100, 10, 100);

      // Verify cash: 100,000 - (100 * 10 + 100) = 98,900
      expect(position.cash).toBe(98_900);

      // Verify position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(10);
      expect(longPosition!.totalCost).toBe(1_100);

      // Verify lots
      expect(longPosition!.lots).toHaveLength(1);
      expect(longPosition!.lots[0].quantity).toBe(10);
      expect(longPosition!.lots[0].price).toBe(100);
      expect(longPosition!.lots[0].totalCost).toBe(1_100);
    });
  });

  describe("2. Open Long - Multiple Lots", () => {
    it("should correctly accumulate multiple lots", () => {
      // Step 1: Open Long - price=100, qty=10, commission=100
      openLong(position, "AAPL", 100, 10, 100);
      expect(position.cash).toBe(98_900);

      // Step 2: Open Long - price=120, qty=5, commission=120
      openLong(position, "AAPL", 120, 5, 120);

      // Verify cash: 98,900 - (120 * 5 + 120) = 98,180
      expect(position.cash).toBe(98_180);

      // Verify position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(15);
      expect(longPosition!.totalCost).toBe(1_820); // 1,100 + 720

      // Verify lots
      expect(longPosition!.lots).toHaveLength(2);
      expect(longPosition!.lots[0].totalCost).toBe(1_100);
      expect(longPosition!.lots[1].totalCost).toBe(720);
    });
  });

  describe("3. Close Long - FIFO Strategy - Partial Close", () => {
    it("should close from the first lot using FIFO strategy", () => {
      // Setup: Open two lots
      openLong(position, "AAPL", 100, 10, 100); // Lot 1: price=100, totalCost=1,100
      openLong(position, "AAPL", 120, 10, 120); // Lot 2: price=120, totalCost=1,320
      expect(position.cash).toBe(97_580); // 100,000 - 1,100 - 1,320

      // Step 3: Close Long (FIFO) - price=150, qty=5, commission=150
      const pnl = closeLong(position, "AAPL", 150, 5, 150, "FIFO");

      // Verify PnL:
      // - Cost basis for 5 shares from first lot: 1,100 / 10 * 5 = 550
      // - Proceeds: 150 * 5 - 150 = 600
      // - Realized PnL: 600 - 550 = 50
      expect(round(pnl)).toBe(50);

      // Verify cash: 97,580 + 600 = 98,180
      expect(position.cash).toBe(98_180);

      // Verify position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(15);

      // Verify lots
      expect(longPosition!.lots).toHaveLength(2);
      expect(longPosition!.lots[0].quantity).toBe(5); // Remaining from first lot
      expect(longPosition!.lots[0].totalCost).toBe(550);
      expect(longPosition!.lots[1].quantity).toBe(10); // Second lot unchanged
      expect(longPosition!.lots[1].totalCost).toBe(1_320);
    });
  });

  describe("4. Close Long - LIFO Strategy - Partial Close", () => {
    it("should close from the last lot using LIFO strategy", () => {
      // Setup: Open two lots
      openLong(position, "AAPL", 100, 10, 100); // Lot 1: price=100, totalCost=1,100
      openLong(position, "AAPL", 120, 10, 120); // Lot 2: price=120, totalCost=1,320
      expect(position.cash).toBe(97_580); // 100,000 - 1,100 - 1,320

      // Step 3: Close Long (LIFO) - price=150, qty=5, commission=150
      const pnl = closeLong(position, "AAPL", 150, 5, 150, "LIFO");

      // Verify PnL:
      // - Cost basis for 5 shares from second lot: 1,320 / 10 * 5 = 660
      // - Proceeds: 150 * 5 - 150 = 600
      // - Realized PnL: 600 - 660 = -60
      expect(round(pnl)).toBe(-60);

      // Verify cash: 97,580 + 600 = 98,180
      expect(position.cash).toBe(98_180);

      // Verify position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(15);

      // Verify lots
      expect(longPosition!.lots).toHaveLength(2);
      expect(longPosition!.lots[0].quantity).toBe(10); // First lot unchanged
      expect(longPosition!.lots[0].totalCost).toBe(1_100);
      expect(longPosition!.lots[1].quantity).toBe(5); // Remaining from second lot
      expect(longPosition!.lots[1].totalCost).toBe(660);
    });
  });

  describe("5. Close Long - Complete Position Close", () => {
    it("should close entire position and remove it from position map", () => {
      // Step 1: Open Long - price=100, qty=10, commission=100
      openLong(position, "AAPL", 100, 10, 100);
      expect(position.cash).toBe(98_900);

      // Step 2: Close Long - price=150, qty=10, commission=150
      const pnl = closeLong(position, "AAPL", 150, 10, 150);

      // Verify PnL:
      // - Cost basis: 1,100 (entire lot)
      // - Proceeds: 150 * 10 - 150 = 1,350
      // - Realized PnL: 1,350 - 1,100 = 250
      expect(round(pnl)).toBe(250);

      // Verify cash: 98,900 + 1,350 = 100,250
      expect(position.cash).toBe(100_250);

      // Verify position is deleted (no lots remain)
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeUndefined();
    });
  });

  describe("6. Close Long - Multiple Lots FIFO", () => {
    it("should close across multiple lots using FIFO strategy", () => {
      // Setup: Open two lots
      openLong(position, "AAPL", 100, 10, 100); // Lot 1: price=100, totalCost=1,100
      openLong(position, "AAPL", 120, 10, 120); // Lot 2: price=120, totalCost=1,320
      expect(position.cash).toBe(97_580); // 100,000 - 1,100 - 1,320

      // Step 3: Close Long (FIFO) - price=150, qty=15, commission=150
      const pnl = closeLong(position, "AAPL", 150, 15, 150, "FIFO");

      // Verify PnL:
      // - Closes entire first lot (10 shares): cost basis = 1,100
      // - Closes 5 from second lot: cost basis = 1,320 / 10 * 5 = 660
      // - Total cost basis: 1,100 + 660 = 1,760
      // - Proceeds: 150 * 15 - 150 = 2,100
      // - Realized PnL: 2,100 - 1,760 = 340
      expect(round(pnl)).toBe(340);

      // Verify cash: 97,580 + 2,100 = 99,680
      expect(position.cash).toBe(99_680);

      // Verify position
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(5);

      // Verify lots - only second lot remains
      expect(longPosition!.lots).toHaveLength(1);
      expect(longPosition!.lots[0].quantity).toBe(5);
      expect(longPosition!.lots[0].totalCost).toBe(660);
    });
  });

  describe("7. Close Long - Loss Scenario", () => {
    it("should correctly calculate negative PnL when closing at a loss", () => {
      // Step 1: Open Long - price=100, qty=10, commission=100
      openLong(position, "AAPL", 100, 10, 100);
      expect(position.cash).toBe(98_900);

      // Step 2: Close Long at lower price - price=80, qty=10, commission=80
      const pnl = closeLong(position, "AAPL", 80, 10, 80);

      // Verify PnL:
      // - Cost basis: 1,100
      // - Proceeds: 80 * 10 - 80 = 720
      // - Realized PnL: 720 - 1,100 = -380
      expect(round(pnl)).toBe(-380);

      // Verify cash: 98,900 + 720 = 99,620
      expect(position.cash).toBe(99_620);

      // Verify position is deleted
      const longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should throw error when trying to close non-existent position", () => {
      expect(() => {
        closeLong(position, "AAPL", 100, 10, 100);
      }).toThrow();
    });

    it("should use FIFO as default close strategy", () => {
      openLong(position, "AAPL", 100, 10, 100);
      openLong(position, "AAPL", 120, 10, 120);

      // Close without specifying strategy (should default to FIFO)
      const pnl = closeLong(position, "AAPL", 150, 5, 150);

      // Should close from first lot (FIFO)
      expect(round(pnl)).toBe(50); // Same as FIFO test
    });
  });

  describe("8. Open Long - DisableLot Mode", () => {
    it("should maintain single merged lot when disableLot is true", () => {
      // Step 1: Open Long - price=100, qty=10, commission=100, disableLot=true
      openLong(position, "AAPL", 100, 10, 100, undefined, true);
      expect(position.cash).toBe(98_900);

      // Verify position
      let longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(10);
      expect(longPosition!.totalCost).toBe(1_100);

      // Verify only one lot exists
      expect(longPosition!.lots).toHaveLength(1);
      expect(longPosition!.lots[0].quantity).toBe(10);
      expect(longPosition!.lots[0].price).toBe(100);
      expect(longPosition!.lots[0].totalCost).toBe(1_100);

      // Step 2: Open Long again - price=120, qty=5, commission=120, disableLot=true
      openLong(position, "AAPL", 120, 5, 120, undefined, true);

      // Verify cash: 98,900 - (120 * 5 + 120) = 98,180
      expect(position.cash).toBe(98_180);

      // Verify position
      longPosition = position.long?.get("AAPL");
      expect(longPosition).toBeDefined();
      expect(longPosition!.quantity).toBe(15); // 10 + 5
      expect(longPosition!.totalCost).toBe(1_820); // 1,100 + 720

      // Verify still only one lot (merged)
      expect(longPosition!.lots).toHaveLength(1);
      expect(longPosition!.lots[0].quantity).toBe(15);
      expect(longPosition!.lots[0].price).toBe(120); // Updated to latest price
      expect(longPosition!.lots[0].totalCost).toBe(1_820);
    });
  });
});

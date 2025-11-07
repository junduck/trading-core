import { describe, it, expect, beforeEach } from "vitest";
import { openShort, closeShort } from "../../src/utils/position.utils.js";
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
    created: now,
    modified: now,
  };
}

describe("Position Utils - Short Position Operations", () => {
  let position: Position;

  beforeEach(() => {
    position = createTestPosition(100_000);
  });

  describe("1. Open Short - Single Lot", () => {
    it("should open a short position with correct cash, quantity, proceeds", () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(position, "AAPL", 100, 10, 100);

      // Verify cash: 100,000 + (100 * 10 - 100) = 100,900
      expect(position.cash).toBe(100_900);

      // Verify position
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeDefined();
      expect(shortPosition!.quantity).toBe(10);
      expect(shortPosition!.totalProceeds).toBe(900);

      // Verify lots
      expect(shortPosition!.lots).toHaveLength(1);
      expect(shortPosition!.lots[0].quantity).toBe(10);
      expect(shortPosition!.lots[0].price).toBe(100);
      expect(shortPosition!.lots[0].totalProceeds).toBe(900);
    });
  });

  describe("2. Open Short - Multiple Lots", () => {
    it("should correctly accumulate multiple lots", () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(position, "AAPL", 100, 10, 100);
      expect(position.cash).toBe(100_900);

      // Step 2: Open Short - price=120, qty=5, commission=120
      openShort(position, "AAPL", 120, 5, 120);

      // Verify cash: 100,900 + (120 * 5 - 120) = 101,380
      expect(position.cash).toBe(101_380);

      // Verify position
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeDefined();
      expect(shortPosition!.quantity).toBe(15);
      expect(shortPosition!.totalProceeds).toBe(1_380); // 900 + 480

      // Verify lots
      expect(shortPosition!.lots).toHaveLength(2);
      expect(shortPosition!.lots[0].totalProceeds).toBe(900);
      expect(shortPosition!.lots[1].totalProceeds).toBe(480);
    });
  });

  describe("3. Close Short - FIFO Strategy - Partial Close (Profit)", () => {
    it("should close from the first lot using FIFO strategy with profit", () => {
      // Setup: Open two lots
      openShort(position, "AAPL", 100, 10, 100); // Lot 1: price=100, totalProceeds=900
      openShort(position, "AAPL", 120, 10, 120); // Lot 2: price=120, totalProceeds=1,080
      expect(position.cash).toBe(101_980); // 100,000 + 900 + 1,080

      // Step 3: Close Short (FIFO) - price=80, qty=5, commission=80
      const pnl = closeShort(position, "AAPL", 80, 5, 80, "FIFO");

      // Verify PnL:
      // - Proceeds basis for 5 shares from first lot: 900 / 10 * 5 = 450
      // - Cost to buy back: 80 * 5 + 80 = 480
      // - Realized PnL: 450 - 480 = -30
      expect(round(pnl)).toBe(-30);

      // Verify cash: 101,980 - 480 = 101,500
      expect(position.cash).toBe(101_500);

      // Verify position
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeDefined();
      expect(shortPosition!.quantity).toBe(15);

      // Verify lots
      expect(shortPosition!.lots).toHaveLength(2);
      expect(shortPosition!.lots[0].quantity).toBe(5); // Remaining from first lot
      expect(shortPosition!.lots[0].totalProceeds).toBe(450);
      expect(shortPosition!.lots[1].quantity).toBe(10); // Second lot unchanged
      expect(shortPosition!.lots[1].totalProceeds).toBe(1_080);
    });
  });

  describe("4. Close Short - LIFO Strategy - Partial Close (Loss)", () => {
    it("should close from the last lot using LIFO strategy with profit", () => {
      // Setup: Open two lots
      openShort(position, "AAPL", 100, 10, 100); // Lot 1: price=100, totalProceeds=900
      openShort(position, "AAPL", 120, 10, 120); // Lot 2: price=120, totalProceeds=1,080
      expect(position.cash).toBe(101_980); // 100,000 + 900 + 1,080

      // Step 3: Close Short (LIFO) - price=80, qty=5, commission=80
      const pnl = closeShort(position, "AAPL", 80, 5, 80, "LIFO");

      // Verify PnL:
      // - Proceeds basis for 5 shares from second lot: 1,080 / 10 * 5 = 540
      // - Cost to buy back: 80 * 5 + 80 = 480
      // - Realized PnL: 540 - 480 = 60
      expect(round(pnl)).toBe(60);

      // Verify cash: 101,980 - 480 = 101,500
      expect(position.cash).toBe(101_500);

      // Verify position
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeDefined();
      expect(shortPosition!.quantity).toBe(15);

      // Verify lots
      expect(shortPosition!.lots).toHaveLength(2);
      expect(shortPosition!.lots[0].quantity).toBe(10); // First lot unchanged
      expect(shortPosition!.lots[0].totalProceeds).toBe(900);
      expect(shortPosition!.lots[1].quantity).toBe(5); // Remaining from second lot
      expect(shortPosition!.lots[1].totalProceeds).toBe(540);
    });
  });

  describe("5. Close Short - Complete Position Close (Profit)", () => {
    it("should close entire position and remove it from position map with profit", () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(position, "AAPL", 100, 10, 100);
      expect(position.cash).toBe(100_900);

      // Step 2: Close Short - price=80, qty=10, commission=80
      const pnl = closeShort(position, "AAPL", 80, 10, 80);

      // Verify PnL:
      // - Proceeds basis: 900 (entire lot)
      // - Cost to buy back: 80 * 10 + 80 = 880
      // - Realized PnL: 900 - 880 = 20
      expect(round(pnl)).toBe(20);

      // Verify cash: 100,900 - 880 = 100,020
      expect(position.cash).toBe(100_020);

      // Verify position is deleted (no lots remain)
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeUndefined();
    });
  });

  describe("6. Close Short - Multiple Lots FIFO", () => {
    it("should close across multiple lots using FIFO strategy", () => {
      // Setup: Open two lots
      openShort(position, "AAPL", 100, 10, 100); // Lot 1: price=100, totalProceeds=900
      openShort(position, "AAPL", 120, 10, 120); // Lot 2: price=120, totalProceeds=1,080
      expect(position.cash).toBe(101_980); // 100,000 + 900 + 1,080

      // Step 3: Close Short (FIFO) - price=80, qty=15, commission=80
      const pnl = closeShort(position, "AAPL", 80, 15, 80, "FIFO");

      // Verify PnL:
      // - Closes entire first lot (10 shares): proceeds basis = 900
      // - Closes 5 from second lot: proceeds basis = 1,080 / 10 * 5 = 540
      // - Total proceeds basis: 900 + 540 = 1,440
      // - Cost: 80 * 15 + 80 = 1,280
      // - Realized PnL: 1,440 - 1,280 = 160
      expect(round(pnl)).toBe(160);

      // Verify cash: 101,980 - 1,280 = 100,700
      expect(position.cash).toBe(100_700);

      // Verify position
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeDefined();
      expect(shortPosition!.quantity).toBe(5);

      // Verify lots - only second lot remains
      expect(shortPosition!.lots).toHaveLength(1);
      expect(shortPosition!.lots[0].quantity).toBe(5);
      expect(shortPosition!.lots[0].totalProceeds).toBe(540);
    });
  });

  describe("7. Close Short - Loss Scenario", () => {
    it("should correctly calculate negative PnL when closing at a loss", () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(position, "AAPL", 100, 10, 100);
      expect(position.cash).toBe(100_900);

      // Step 2: Close Short at higher price - price=130, qty=10, commission=130
      const pnl = closeShort(position, "AAPL", 130, 10, 130);

      // Verify PnL:
      // - Proceeds basis: 900
      // - Cost to buy back: 130 * 10 + 130 = 1,430
      // - Realized PnL: 900 - 1,430 = -530
      expect(round(pnl)).toBe(-530);

      // Verify cash: 100,900 - 1,430 = 99,470
      expect(position.cash).toBe(99_470);

      // Verify position is deleted
      const shortPosition = position.short?.get("AAPL");
      expect(shortPosition).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should throw error when trying to close non-existent position", () => {
      expect(() => {
        closeShort(position, "AAPL", 100, 10, 100);
      }).toThrow();
    });

    it("should use FIFO as default close strategy", () => {
      openShort(position, "AAPL", 100, 10, 100);
      openShort(position, "AAPL", 120, 10, 120);

      // Close without specifying strategy (should default to FIFO)
      const pnl = closeShort(position, "AAPL", 80, 5, 80);

      // Should close from first lot (FIFO)
      expect(round(pnl)).toBe(-30); // Same as FIFO test
    });
  });
});

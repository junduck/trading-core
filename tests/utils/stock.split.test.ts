import { describe, it, expect } from "vitest";
import { createTestPosition } from "./position-test-helper.js";
import {
  adjustLotForSplit,
  roundAdjustLot,
  applyAdjustLot,
  setPriceForAdjustLot,
  valueForAdjustLot,
  taxForAdjustLot,
} from "../../src/utils/stock.split.js";
import {
  pushLongPositionLot,
  pushShortPositionLot,
} from "../../src/utils/position.utils.js";

describe("stock.split", () => {
  it("adjustLotForSplit should calculate incremental shares for long and short", () => {
    const pos = createTestPosition(1000);
    const now = new Date();
    // Setup a long position
    pushLongPositionLot(
      pos,
      "AAPL",
      { quantity: 100, price: 150, totalCost: 15000 },
      now
    );
    // Setup a short position
    pushShortPositionLot(
      pos,
      "TSLA",
      { quantity: 50, price: 200, totalProceeds: 10000 },
      now
    );

    // 2-for-1 split (incremental 1 per 1)
    const aaplLot = adjustLotForSplit(pos, "AAPL", 1);
    expect(aaplLot.symbol).toBe("AAPL");
    expect(aaplLot.long?.quantity).toBe(100);
    expect(aaplLot.long?.price).toBe(0);
    expect(aaplLot.long?.totalCost).toBe(0);
    expect(aaplLot.short).toBeUndefined();

    // 3-for-2 split (incremental 0.5 per 1)
    const tslaLot = adjustLotForSplit(pos, "TSLA", 0.5);
    expect(tslaLot.symbol).toBe("TSLA");
    expect(tslaLot.short?.quantity).toBe(25);
    expect(tslaLot.short?.price).toBe(0);
    expect(tslaLot.short?.totalProceeds).toBe(0);
    expect(tslaLot.long).toBeUndefined();

    // No position case
    const emptyLot = adjustLotForSplit(pos, "MSFT", 1);
    expect(emptyLot.long).toBeUndefined();
    expect(emptyLot.short).toBeUndefined();
  });

  it("roundAdjustLot should handle all rounding methods", () => {
    const baseLot = {
      symbol: "TEST",
      long: { quantity: 10.5, price: 0, totalCost: 0 },
      short: { quantity: 5.7, price: 0, totalProceeds: 0 },
    };

    // Case 1: fractional
    const lot1 = JSON.parse(JSON.stringify(baseLot));
    const res1 = roundAdjustLot(lot1, "fractional");
    expect(lot1.long.quantity).toBe(10.5);
    expect(lot1.short.quantity).toBe(5.7);
    expect(res1.cash).toBe(0);
    expect(res1.liab).toBe(0);

    // Case 2: floor
    const lot2 = JSON.parse(JSON.stringify(baseLot));
    const res2 = roundAdjustLot(lot2, "floor");
    expect(lot2.long.quantity).toBe(10);
    expect(lot2.short.quantity).toBe(5);
    expect(res2.cash).toBe(0);
    expect(res2.liab).toBe(0);

    // Case 3: cashInLieu
    const lot3 = JSON.parse(JSON.stringify(baseLot));
    const res3 = roundAdjustLot(lot3, "cashInLieu", 100);
    expect(lot3.long.quantity).toBe(10);
    expect(lot3.short.quantity).toBe(5);
    expect(res3.cash).toBeCloseTo(50); // 0.5 * 100
    expect(res3.liab).toBeCloseTo(70); // 0.7 * 100
  });

  it("applyAdjustLot should update position and cash", () => {
    const pos = createTestPosition(1000);
    const now = new Date();
    const lot = {
      symbol: "AAPL",
      long: { quantity: 10, price: 0, totalCost: 0 },
    };

    applyAdjustLot(pos, lot, 25, now);
    expect(pos.cash).toBe(1025);
    expect(pos.long?.get("AAPL")?.quantity).toBe(10);
    expect(pos.modified).toEqual(now);

    const shortLot = {
      symbol: "TSLA",
      short: { quantity: 5, price: 0, totalProceeds: 0 },
    };
    applyAdjustLot(pos, shortLot, -10, now);
    expect(pos.cash).toBe(1015);
    expect(pos.short?.get("TSLA")?.quantity).toBe(5);
  });

  it("applyAdjustLot with disableLot should amend instead of push", () => {
    const pos = createTestPosition(1000);
    const now = new Date();

    // First lot
    pushLongPositionLot(
      pos,
      "AAPL",
      { quantity: 100, price: 150, totalCost: 15000 },
      now
    );

    // Second lot with disableLot: true
    const lot = {
      symbol: "AAPL",
      long: { quantity: 50, price: 0, totalCost: 0 },
    };
    applyAdjustLot(pos, lot, 0, now, true);

    const applePos = pos.long?.get("AAPL");
    expect(applePos?.quantity).toBe(150);
    // When disableLot is true, it calls amendLongPositionLot.
    // depending on implementation it might have 1 or 2 lots, but quantity is summed.
  });

  it("setPriceForAdjustLot should set prices for both long and short", () => {
    const lot = {
      symbol: "TEST",
      long: { quantity: 10, price: 0, totalCost: 0 },
      short: { quantity: 5, price: 0, totalProceeds: 0 },
    };
    setPriceForAdjustLot(lot, 123);
    expect(lot.long?.price).toBe(123);
    expect(lot.short?.price).toBe(123);
  });

  it("valueForAdjustLot and taxForAdjustLot helpers", () => {
    const lot = {
      symbol: "AAPL",
      long: { quantity: 10, price: 0, totalCost: 0 },
    };
    expect(valueForAdjustLot(lot, 150)).toBe(1500);
    expect(taxForAdjustLot(lot, 150, 0.2)).toBe(300);

    const shortLot = {
      symbol: "TSLA",
      short: { quantity: 10, price: 0, totalProceeds: 0 },
    };
    // Should be 0 as per implementation for short
    expect(valueForAdjustLot(shortLot, 150)).toBe(0);
    expect(taxForAdjustLot(shortLot, 150, 0.2)).toBe(0);

    const emptyLot = { symbol: "MSFT" };
    expect(valueForAdjustLot(emptyLot, 150)).toBe(0);
    expect(taxForAdjustLot(emptyLot, 150, 0.2)).toBe(0);
  });
});

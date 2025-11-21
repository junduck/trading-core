import { describe, it, expect } from "vitest";
import { q, createPosition, openLong, openShort } from "../../src/utils/position.utils.js";
import type { Position } from "../../src/types/position.js";

describe("Position Query Helpers", () => {
  it("should return 0 for non-existent long position", () => {
    const pos = createPosition(10_000);
    expect(q.longQty(pos, "AAPL")).toBe(0);
    expect(q.longCost(pos, "AAPL")).toBe(0);
    expect(q.longPnL(pos, "AAPL")).toBe(0);
    expect(q.hasLong(pos, "AAPL")).toBe(false);
  });

  it("should return 0 for non-existent short position", () => {
    const pos = createPosition(10_000);
    expect(q.shortQty(pos, "AAPL")).toBe(0);
    expect(q.shortProceeds(pos, "AAPL")).toBe(0);
    expect(q.shortPnL(pos, "AAPL")).toBe(0);
    expect(q.hasShort(pos, "AAPL")).toBe(false);
  });

  it("should query long position correctly", () => {
    const pos = createPosition(10_000);
    openLong(pos, "AAPL", 100, 10, 50);

    expect(q.longQty(pos, "AAPL")).toBe(10);
    expect(q.longCost(pos, "AAPL")).toBe(1_050); // 100 * 10 + 50
    expect(q.longPnL(pos, "AAPL")).toBe(0);
    expect(q.hasLong(pos, "AAPL")).toBe(true);
  });

  it("should query short position correctly", () => {
    const pos = createPosition(10_000);
    openShort(pos, "TSLA", 200, 10, 100);

    expect(q.shortQty(pos, "TSLA")).toBe(10);
    expect(q.shortProceeds(pos, "TSLA")).toBe(1_900); // 200 * 10 - 100
    expect(q.shortPnL(pos, "TSLA")).toBe(0);
    expect(q.hasShort(pos, "TSLA")).toBe(true);
  });

  it("should handle positions without long/short maps", () => {
    const pos: Position = {
      cash: 10_000,
      totalCommission: 0,
      realisedPnL: 0,
      modified: new Date(),
    };

    expect(q.longQty(pos, "AAPL")).toBe(0);
    expect(q.shortQty(pos, "AAPL")).toBe(0);
    expect(q.hasLong(pos, "AAPL")).toBe(false);
    expect(q.hasShort(pos, "AAPL")).toBe(false);
  });

  it("should use shorthand qty/cost for long positions", () => {
    const pos = createPosition(10_000);
    openLong(pos, "AAPL", 100, 10, 50);

    // Shorthand should default to long position
    expect(q.qty(pos, "AAPL")).toBe(10);
    expect(q.cost(pos, "AAPL")).toBe(1_050);

    // Should match explicit longQty/longCost
    expect(q.qty(pos, "AAPL")).toBe(q.longQty(pos, "AAPL"));
    expect(q.cost(pos, "AAPL")).toBe(q.longCost(pos, "AAPL"));
  });

  it("should return 0 for shorthand qty/cost when position doesn't exist", () => {
    const pos = createPosition(10_000);
    expect(q.qty(pos, "AAPL")).toBe(0);
    expect(q.cost(pos, "AAPL")).toBe(0);
  });
});

import { describe, it, expect } from "vitest";
import {
  cumsum,
  norm,
  winsorize,
} from "../../src/numeric/series.js";

describe("cumsum", () => {
  it("handles empty array", () => {
    expect(cumsum([])).toEqual([]);
  });

  it("computes cumulative sum", () => {
    expect(cumsum([1, 2, 3, 4])).toEqual([1, 3, 6, 10]);
    expect(cumsum([10])).toEqual([10]);
  });
});

describe("norm", () => {
  it("normalizes to z-scores", () => {
    const result = norm([1, 2, 3, 4, 5]);
    const mean = result.reduce((a, b) => a + b, 0) / result.length;
    expect(mean).toBeCloseTo(0, 10);
  });

  it("handles constant values", () => {
    expect(norm([5, 5, 5])).toEqual([0, 0, 0]);
  });
});

describe("winsorize", () => {
  it("handles empty array", () => {
    expect(winsorize([])).toEqual([]);
  });

  it("clamps extreme values", () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = winsorize(x, { lower: 0.1, upper: 0.9 });
    expect(result[0]).toBeGreaterThan(1); // first value clamped up
    expect(result[9]).toBeLessThan(10); // last value clamped down
  });
});

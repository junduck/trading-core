import { describe, it, expect } from "vitest";
import { median, quantile } from "../../src/numeric/stats.js";

describe("median", () => {
  it("returns NaN for empty array", () => {
    expect(median([])).toBeNaN();
  });

  it("handles single element", () => {
    expect(median([42])).toBe(42);
  });

  it("computes median for odd length", () => {
    expect(median([1, 2, 3])).toBe(2);
    expect(median([3, 1, 2])).toBe(2);
  });

  it("computes median for even length", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});

describe("quantile", () => {
  it("returns NaN for invalid inputs", () => {
    expect(quantile([], 0.5)).toBeNaN();
    expect(quantile([1, 2, 3], -0.1)).toBeNaN();
    expect(quantile([1, 2, 3], 1.1)).toBeNaN();
  });

  it("handles single element", () => {
    expect(quantile([42], 0.5)).toBe(42);
  });

  it("computes quantiles with linear interpolation", () => {
    const x = [1, 2, 3, 4];
    expect(quantile(x, 0)).toBe(1);
    expect(quantile(x, 1)).toBe(4);
    expect(quantile(x, 0.5)).toBe(2.5);
    expect(quantile(x, 0.25)).toBeCloseTo(1.75, 10);
    expect(quantile(x, 0.75)).toBeCloseTo(3.25, 10);
  });
});

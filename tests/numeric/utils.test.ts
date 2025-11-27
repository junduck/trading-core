import { describe, it, expect } from "vitest";
import { median, quantile } from "../../src/numeric/stats.js";
import { invNormalCDF } from "../../src/numeric/utils.js";

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

describe("invNormalCDF", () => {
  it("validates against AS241 reference values (Wichura's algorithm)", () => {
    // Reference test values from Applied Statistics Algorithm AS241
    // Wichura, M. J. (1988). Algorithm AS 241: The Percentage Points of the Normal Distribution.
    expect(invNormalCDF(0.25)).toBeCloseTo(-0.6744897501960817, 8);
    expect(invNormalCDF(0.001)).toBeCloseTo(-3.090232306167814, 8);
    expect(invNormalCDF(1e-20)).toBeCloseTo(-9.262340089798408, 8);
  });

  it("validates standard normal quantiles", () => {
    expect(invNormalCDF(0.5)).toBeCloseTo(0, 10);
    expect(invNormalCDF(0.8413447)).toBeCloseTo(1, 5);
    expect(invNormalCDF(0.9772499)).toBeCloseTo(2, 5);
    expect(invNormalCDF(0.1586553)).toBeCloseTo(-1, 5);
    expect(invNormalCDF(0.025)).toBeCloseTo(-1.959964, 6);
    expect(invNormalCDF(0.975)).toBeCloseTo(1.959964, 6);
  });

  it("validates common confidence levels", () => {
    expect(invNormalCDF(0.05)).toBeCloseTo(-1.6448536, 6);
    expect(invNormalCDF(0.95)).toBeCloseTo(1.6448536, 6);
    expect(invNormalCDF(0.01)).toBeCloseTo(-2.3263479, 6);
    expect(invNormalCDF(0.99)).toBeCloseTo(2.3263479, 6);
  });

  it("handles boundary conditions", () => {
    expect(invNormalCDF(0)).toBeNaN();
    expect(invNormalCDF(1)).toBeNaN();
    expect(invNormalCDF(-0.1)).toBeNaN();
    expect(invNormalCDF(1.1)).toBeNaN();
  });

  it("validates symmetry", () => {
    expect(invNormalCDF(0.1)).toBeCloseTo(-invNormalCDF(0.9), 10);
    expect(invNormalCDF(0.3)).toBeCloseTo(-invNormalCDF(0.7), 10);
    expect(invNormalCDF(0.4)).toBeCloseTo(-invNormalCDF(0.6), 10);
    expect(invNormalCDF(0.618)).toBeCloseTo(-invNormalCDF(0.382), 10);
  });
});

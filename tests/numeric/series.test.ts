import { describe, it, expect } from "vitest";
import {
  cumsum,
  norm,
  winsorize,
  sign,
  diff,
  pctChange,
  returns,
  logReturns,
  lag,
  lead,
  coalesce,
  locf,
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

  it("handles empty array", () => {
    expect(norm([])).toEqual([]);
  });

  it("handles small array with ddof", () => {
    expect(norm([1, 2], 2)).toEqual([NaN, NaN]);
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

describe("sign", () => {
  it("computes sign of elements", () => {
    expect(sign([1, -2, 0, 3])).toEqual([1, -1, 0, 1]);
  });

  it("handles empty array", () => {
    expect(sign([])).toEqual([]);
  });
});

describe("diff", () => {
  it("computes first differences", () => {
    expect(diff([1, 2, 3, 4])).toEqual([1, 1, 1]);
  });

  it("handles empty array", () => {
    expect(diff([])).toEqual([]);
  });

  it("handles single element", () => {
    expect(diff([5])).toEqual([]);
  });
});

describe("pctChange", () => {
  it("computes percentage changes", () => {
    expect(pctChange([1, 2, 4])).toEqual([1, 1]);
  });

  it("handles empty array", () => {
    expect(pctChange([])).toEqual([]);
  });

  it("handles single element", () => {
    expect(pctChange([5])).toEqual([]);
  });
});

describe("returns", () => {
  it("computes returns from prices", () => {
    expect(returns([1, 2, 4])).toEqual([1, 1]);
  });

  it("handles empty array", () => {
    expect(returns([])).toEqual([]);
  });
});

describe("logReturns", () => {
  it("computes log returns", () => {
    const result = logReturns([1, Math.E, Math.E ** 2]);
    expect(result[0]).toBeCloseTo(1);
    expect(result[1]).toBeCloseTo(1);
  });

  it("handles empty array", () => {
    expect(logReturns([])).toEqual([]);
  });
});

describe("lag", () => {
  it("shifts backward", () => {
    expect(lag([1, 2, 3, 4], 1)).toEqual([NaN, 1, 2, 3]);
  });

  it("handles empty array", () => {
    expect(lag([], 1)).toEqual([]);
  });

  it("handles n=0", () => {
    expect(lag([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
});

describe("lead", () => {
  it("shifts forward", () => {
    expect(lead([1, 2, 3, 4], 1)).toEqual([2, 3, 4, NaN]);
  });

  it("handles empty array", () => {
    expect(lead([], 1)).toEqual([]);
  });

  it("handles n=0", () => {
    expect(lead([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
});

describe("coalesce", () => {
  it("replaces NaN with fill", () => {
    expect(coalesce([1, NaN, 3], 0)).toEqual([1, 0, 3]);
  });

  it("handles empty array", () => {
    expect(coalesce([], 0)).toEqual([]);
  });
});

describe("locf", () => {
  it("carries last value forward", () => {
    expect(locf([1, NaN, 3, NaN])).toEqual([1, 1, 3, 3]);
  });

  it("handles empty array", () => {
    expect(locf([])).toEqual([]);
  });
});

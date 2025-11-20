import { describe, it, expect } from "vitest";
import { argsort, rank } from "../../src/numeric/rank.js";

describe("argsort", () => {
  it("returns empty for empty array", () => {
    expect(argsort([])).toEqual([]);
  });

  it("returns sorted indices", () => {
    expect(argsort([3, 1, 2])).toEqual([1, 2, 0]);
    expect(argsort([1, 2, 3])).toEqual([0, 1, 2]);
    expect(argsort([42])).toEqual([0]);
  });

  it("is stable for ties", () => {
    const result = argsort([2, 1, 2, 1]);
    expect(result[0]).toBeLessThan(result[1]); // first 1 before second 1
    expect(result[2]).toBeLessThan(result[3]); // first 2 before second 2
  });
});

describe("rank", () => {
  it("returns empty for empty array", () => {
    expect(rank([])).toEqual([]);
  });

  it("returns [1] for single element", () => {
    expect(rank([42])).toEqual([1]);
  });

  it("computes fractional ranks in [0, 1]", () => {
    expect(rank([1, 2, 3])).toEqual([0, 0.5, 1]);
    expect(rank([3, 1, 2])).toEqual([1, 0, 0.5]);
  });

  it("handles ties with average rank", () => {
    expect(rank([1, 2, 2, 3])).toEqual([0, 0.5, 0.5, 1]);
    expect(rank([1, 1, 1])).toEqual([0.5, 0.5, 0.5]);
  });
});

import { describe, it, expect } from "vitest";
import { argmin, argmax } from "../../src/numeric/array.js";

describe("argmin", () => {
  it("returns -1 for empty array", () => {
    expect(argmin([])).toBe(-1);
  });

  it("finds index of minimum value", () => {
    expect(argmin([3, 1, 2])).toBe(1);
    expect(argmin([42])).toBe(0);
    expect(argmin([5, 5, 5])).toBe(0); // first occurrence
  });
});

describe("argmax", () => {
  it("returns -1 for empty array", () => {
    expect(argmax([])).toBe(-1);
  });

  it("finds index of maximum value", () => {
    expect(argmax([1, 3, 2])).toBe(1);
    expect(argmax([42])).toBe(0);
    expect(argmax([5, 5, 5])).toBe(0); // first occurrence
  });
});

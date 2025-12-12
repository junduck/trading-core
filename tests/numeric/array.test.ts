import { describe, it, expect } from "vitest";
import { argmin, argmax, sum, min, max } from "../../src/numeric/array.js";

describe("sum", () => {
  it("computes sum of array", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(sum([10])).toBe(10);
    expect(sum([])).toBe(0);
  });
});

describe("min", () => {
  it("returns NaN for empty array", () => {
    expect(min([])).toBeNaN();
  });

  it("finds minimum value", () => {
    expect(min([3, 1, 2])).toBe(1);
    expect(min([42])).toBe(42);
    expect(min([5, 5, 5])).toBe(5);
  });
});

describe("max", () => {
  it("returns NaN for empty array", () => {
    expect(max([])).toBeNaN();
  });

  it("finds maximum value", () => {
    expect(max([1, 3, 2])).toBe(3);
    expect(max([42])).toBe(42);
    expect(max([5, 5, 5])).toBe(5);
  });
});

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

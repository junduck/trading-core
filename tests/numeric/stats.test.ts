import { describe, it, expect } from "vitest";
import {
  mean,
  variance,
  stddev,
  skew,
  kurt,
  cov,
  corr,
} from "../../src/numeric/stats.js";
import { spearman } from "../../src/numeric/rank.js";

// Test fixtures generated from R
// Generated with: Rscript tests/numeric/generate_fixtures.R

describe("mean", () => {
  it("validates against R reference", () => {
    expect(mean([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBeCloseTo(5.5, 12);
    expect(
      mean([100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5])
    ).toBeCloseTo(100.63, 12);
    expect(mean([1, 2, 3])).toBeCloseTo(2, 12);
  });
});

describe("variance", () => {
  it("validates against R reference (ddof=0)", () => {
    expect(variance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0)).toBeCloseTo(8.25, 12);
    expect(
      variance(
        [100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5],
        0
      )
    ).toBeCloseTo(2.950099999999995, 12);
    expect(variance([1, 2, 3], 0)).toBeCloseTo(0.6666666666666666, 12);
  });

  it("validates against R reference (ddof=1)", () => {
    expect(variance([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)).toBeCloseTo(
      9.166666666666666,
      12
    );
    expect(
      variance(
        [100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5],
        1
      )
    ).toBeCloseTo(3.277888888888883, 12);
    expect(variance([1, 2, 3], 1)).toBeCloseTo(1, 12);
  });
});

describe("stddev", () => {
  it("validates against R reference", () => {
    expect(stddev([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)).toBeCloseTo(
      3.027650354097492,
      12
    );
    expect(
      stddev(
        [100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5],
        1
      )
    ).toBeCloseTo(1.810494100760586, 12);
  });
});

describe("skew", () => {
  it("validates against R reference", () => {
    expect(skew([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBeCloseTo(0, 12);
    expect(
      skew([100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5])
    ).toBeCloseTo(0.1776110701250876, 12);
  });
});

describe("kurt", () => {
  it("validates against R reference", () => {
    expect(kurt([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBeCloseTo(
      -1.224242424242424,
      12
    );
    expect(
      kurt([100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5])
    ).toBeCloseTo(-1.052316711590577, 12);
  });
});

describe("cov", () => {
  it("validates against R reference", () => {
    const x1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y1 = [2, 4, 6, 4, 10, 8, 14, 8, 18, 10];
    expect(cov(x1, y1, 1)).toBeCloseTo(11.55555555555556, 12);

    const x2 = [
      100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5,
    ];
    const y2 = [50.2, 51.1, 49.8, 50.5, 49.9, 51.5, 49.5, 50.3, 51.2, 50];
    expect(cov(x2, y2, 1)).toBeCloseTo(1.186666666666668, 12);
  });
});

describe("corr", () => {
  it("validates against R reference", () => {
    const x1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y1 = [2, 4, 6, 4, 10, 8, 14, 8, 18, 10];
    expect(corr(x1, y1)).toBeCloseTo(0.7819769910125803, 12);

    const x2 = [
      100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5,
    ];
    const y2 = [50.2, 51.1, 49.8, 50.5, 49.9, 51.5, 49.5, 50.3, 51.2, 50];
    expect(corr(x2, y2)).toBeCloseTo(0.9856241766196152, 12);
  });
});

describe("spearman", () => {
  it("validates against R reference", () => {
    const x1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y1 = [2, 4, 6, 4, 10, 8, 14, 8, 18, 10];
    expect(spearman(x1, y1)).toBeCloseTo(0.8318392892065836, 12);

    const x2 = [
      100.5, 102.3, 98.7, 101.2, 99.8, 103.5, 97.9, 100.1, 102.8, 99.5,
    ];
    const y2 = [50.2, 51.1, 49.8, 50.5, 49.9, 51.5, 49.5, 50.3, 51.2, 50];
    expect(spearman(x2, y2)).toBeCloseTo(0.9757575757575756, 12);
  });
});

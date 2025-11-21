import { describe, it, expect } from "vitest";
import {
  CuVar,
  CuStddev,
  CuCov,
  CuCorr,
  CuBeta,
} from "../../src/online/stats.js";

describe("CuVar", () => {
  it("computes cumulative mean and variance", () => {
    const cv = new CuVar();

    // [1, 2, 3, 4, 5] -> mean=3, variance=2
    cv.update(1);
    cv.update(2);
    cv.update(3);
    cv.update(4);
    const result = cv.update(5);

    expect(result.mean).toBeCloseTo(3);
    expect(result.variance).toBeCloseTo(2);
  });

  it("supports ddof", () => {
    const cv = new CuVar({ ddof: 1 });

    cv.update(1);
    cv.update(2);
    cv.update(3);
    cv.update(4);
    const result = cv.update(5);

    expect(result.mean).toBeCloseTo(3);
    expect(result.variance).toBeCloseTo(2.5); // sample variance
  });

  it("returns zero variance when n <= ddof", () => {
    const cv = new CuVar({ ddof: 1 });
    const result = cv.update(10);

    expect(result.mean).toBe(10);
    expect(result.variance).toBe(0);
  });
});

describe("CuStddev", () => {
  it("computes cumulative mean and stddev", () => {
    const cs = new CuStddev();

    cs.update(1);
    cs.update(2);
    cs.update(3);
    cs.update(4);
    const result = cs.update(5);

    expect(result.mean).toBeCloseTo(3);
    expect(result.stddev).toBeCloseTo(Math.sqrt(2));
  });
});

describe("CuCov", () => {
  it("computes cumulative covariance", () => {
    const cc = new CuCov({ ddof: 1 });

    // x = [1, 2, 3], y = [2, 4, 6] -> perfect correlation, cov = 2
    cc.update(1, 2);
    cc.update(2, 4);
    const result = cc.update(3, 6);

    expect(result.meanX).toBeCloseTo(2);
    expect(result.meanY).toBeCloseTo(4);
    expect(result.cov).toBeCloseTo(2);
  });

  it("returns zero when n <= ddof", () => {
    const cc = new CuCov();
    const result = cc.update(1, 2);

    expect(result.cov).toBe(0);
  });
});

describe("CuCorr", () => {
  it("computes cumulative correlation", () => {
    const cc = new CuCorr();

    // x = [1, 2, 3], y = [2, 4, 6] -> perfect correlation
    cc.update(1, 2);
    cc.update(2, 4);
    const result = cc.update(3, 6);

    expect(result.corr).toBeCloseTo(1);
  });

  it("returns zero when n <= ddof", () => {
    const cc = new CuCorr();
    const result = cc.update(1, 2);

    expect(result.corr).toBe(0);
  });
});

describe("CuBeta", () => {
  it("computes cumulative beta", () => {
    const cb = new CuBeta();

    // x = [1, 2, 3], y = [2, 4, 6] -> beta = 2
    cb.update(1, 2);
    cb.update(2, 4);
    const result = cb.update(3, 6);

    expect(result.beta).toBeCloseTo(2);
  });

  it("returns zero when n <= ddof", () => {
    const cb = new CuBeta();
    const result = cb.update(1, 2);

    expect(result.beta).toBe(0);
  });
});

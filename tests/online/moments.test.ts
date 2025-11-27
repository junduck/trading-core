import { describe, it, expect } from "vitest";
import { CuSkew, CuKurt } from "../../src/online/moments.js";

/**
 * Naive cumulative skewness calculation
 */
function naiveCuSkewness(
  data: number[]
): Array<{ mean: number; variance: number; skew: number }> {
  const result: Array<{ mean: number; variance: number; skew: number }> = [];
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j <= i; j++) {
      sum += data[j];
    }
    const mean = sum / (i + 1);

    let m2 = 0;
    let m3 = 0;
    for (let j = 0; j <= i; j++) {
      const diff = data[j] - mean;
      m2 += diff * diff;
      m3 += diff * diff * diff;
    }
    m2 /= i + 1;
    m3 /= i + 1;

    const variance = m2;
    const skew = variance === 0 ? 0 : m3 / Math.pow(variance, 1.5);

    result.push({ mean, variance, skew });
  }
  return result;
}

/**
 * Naive cumulative kurtosis calculation
 */
function naiveCuKurtosis(
  data: number[]
): Array<{ mean: number; variance: number; kurt: number }> {
  const result: Array<{ mean: number; variance: number; kurt: number }> = [];
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j <= i; j++) {
      sum += data[j];
    }
    const mean = sum / (i + 1);

    let m2 = 0;
    let m4 = 0;
    for (let j = 0; j <= i; j++) {
      const diff = data[j] - mean;
      const diff2 = diff * diff;
      m2 += diff2;
      m4 += diff2 * diff2;
    }
    m2 /= i + 1;
    m4 /= i + 1;

    const variance = m2;
    const kurt = variance === 0 ? 0 : m4 / (variance * variance) - 3;

    result.push({ mean, variance, kurt });
  }
  return result;
}

describe("CuSkew", () => {
  it("should compute cumulative skewness", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const expected = naiveCuSkewness(data);

    const cs = new CuSkew();
    const result = data.map((x) => cs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should compute with skewed data", () => {
    const data = [10, 10, 10, 100, 10, 10, 10, 100];
    const expected = naiveCuSkewness(data);

    const cs = new CuSkew();
    const result = data.map((x) => cs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should handle zero variance", () => {
    const data = [10, 10, 10, 10];

    const cs = new CuSkew();
    const result = data.map((x) => cs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].skew).toBe(0);
    }
  });

  it("should compute with negative skew", () => {
    const data = [100, 10, 10, 10, 100, 10, 10, 10];
    const expected = naiveCuSkewness(data);

    const cs = new CuSkew();
    const result = data.map((x) => cs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should compute with single value", () => {
    const cs = new CuSkew();
    const result = cs.update(10);

    expect(result.mean).toBe(10);
    expect(result.variance).toBe(0);
    expect(result.skew).toBe(0);
  });

  it("should compute with simple sequence", () => {
    const data = [100, 200, 300, 400];
    const expected = naiveCuSkewness(data);

    const cs = new CuSkew();
    const result = data.map((x) => cs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const cs = new CuSkew();
    const lastValue = cs.update(50);
    expect(cs.value).toEqual(lastValue);
  });
});

describe("CuKurt", () => {
  it("should compute cumulative kurtosis", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const expected = naiveCuKurtosis(data);

    const ck = new CuKurt();
    const result = data.map((x) => ck.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 8);
    }
  });

  it("should compute with heavy tails", () => {
    const data = [10, 10, 100, 10, 10, 10, 100, 10];
    const expected = naiveCuKurtosis(data);

    const ck = new CuKurt();
    const result = data.map((x) => ck.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 8);
    }
  });

  it("should handle zero variance", () => {
    const data = [10, 10, 10, 10];

    const ck = new CuKurt();
    const result = data.map((x) => ck.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].kurt).toBe(0);
    }
  });

  it("should compute with single value", () => {
    const ck = new CuKurt();
    const result = ck.update(10);

    expect(result.mean).toBe(10);
    expect(result.variance).toBe(0);
    expect(result.kurt).toBe(0);
  });

  it("should compute with simple sequence", () => {
    const data = [100, 200, 300, 400];
    const expected = naiveCuKurtosis(data);

    const ck = new CuKurt();
    const result = data.map((x) => ck.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 8);
    }
  });

  it("should compute with normal-like data", () => {
    const data = [10, 15, 20, 25, 30, 35, 40];
    const expected = naiveCuKurtosis(data);

    const ck = new CuKurt();
    const result = data.map((x) => ck.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 7);
    }
  });

  it("should return same value from value property as last update", () => {
    const ck = new CuKurt();
    const lastValue = ck.update(50);
    expect(ck.value).toEqual(lastValue);
  });
});

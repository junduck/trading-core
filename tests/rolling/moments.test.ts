import { describe, it, expect } from "vitest";
import { RollingSkew, RollingKurt } from "../../src/rolling/moments.js";

/**
 * Naive O(n) skewness calculation
 */
function naiveSkewness(
  data: number[],
  period: number
): Array<{ mean: number; variance: number; skew: number }> {
  const result: Array<{ mean: number; variance: number; skew: number }> = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sum = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sum += data[j];
      count++;
    }
    const mean = sum / count;

    let m2 = 0;
    let m3 = 0;
    for (let j = start; j <= i; j++) {
      const diff = data[j] - mean;
      m2 += diff * diff;
      m3 += diff * diff * diff;
    }
    m2 /= count;
    m3 /= count;

    const variance = m2;
    const skew = variance === 0 ? 0 : m3 / Math.pow(variance, 1.5);

    result.push({ mean, variance, skew });
  }
  return result;
}

/**
 * Naive O(n) kurtosis calculation
 */
function naiveKurtosis(
  data: number[],
  period: number
): Array<{ mean: number; variance: number; kurt: number }> {
  const result: Array<{ mean: number; variance: number; kurt: number }> = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sum = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sum += data[j];
      count++;
    }
    const mean = sum / count;

    let m2 = 0;
    let m4 = 0;
    for (let j = start; j <= i; j++) {
      const diff = data[j] - mean;
      const diff2 = diff * diff;
      m2 += diff2;
      m4 += diff2 * diff2;
    }
    m2 /= count;
    m4 /= count;

    const variance = m2;
    const kurt = variance === 0 ? 0 : m4 / (variance * variance) - 3;

    result.push({ mean, variance, kurt });
  }
  return result;
}

describe("RollingSkew", () => {
  it("should compute rolling skewness with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const period = 4;
    const expected = naiveSkewness(data, period);

    const rs = new RollingSkew({ period });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should compute with skewed data", () => {
    const data = [10, 10, 10, 100, 10, 10, 10, 100];
    const period = 4;
    const expected = naiveSkewness(data, period);

    const rs = new RollingSkew({ period });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should handle zero variance", () => {
    const data = [10, 10, 10, 10];
    const period = 4;

    const rs = new RollingSkew({ period });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].skew).toBe(0);
    }
  });

  it("should compute with period 2", () => {
    const data = [100, 200, 300, 400];
    const period = 2;
    const expected = naiveSkewness(data, period);

    const rs = new RollingSkew({ period });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });

  it("should compute with negative skew", () => {
    const data = [100, 10, 10, 10, 100, 10, 10, 10];
    const period = 4;
    const expected = naiveSkewness(data, period);

    const rs = new RollingSkew({ period });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].skew).toBeCloseTo(expected[i].skew, 8);
    }
  });
});

describe("RollingKurt", () => {
  it("should compute rolling kurtosis with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const period = 4;
    const expected = naiveKurtosis(data, period);

    const rk = new RollingKurt({ period });
    const result = data.map((x) => rk.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 8);
    }
  });

  it("should compute with heavy tails", () => {
    const data = [10, 10, 100, 10, 10, 10, 100, 10];
    const period = 4;
    const expected = naiveKurtosis(data, period);

    const rk = new RollingKurt({ period });
    const result = data.map((x) => rk.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 8);
    }
  });

  it("should handle zero variance", () => {
    const data = [10, 10, 10, 10];
    const period = 4;

    const rk = new RollingKurt({ period });
    const result = data.map((x) => rk.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].kurt).toBe(0);
    }
  });

  it("should compute with period 2", () => {
    const data = [100, 200, 300, 400];
    const period = 2;
    const expected = naiveKurtosis(data, period);

    const rk = new RollingKurt({ period });
    const result = data.map((x) => rk.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 8);
    }
  });

  it("should compute with normal-like data", () => {
    const data = [10, 15, 20, 25, 30, 35, 40];
    const period = 4;
    const expected = naiveKurtosis(data, period);

    const rk = new RollingKurt({ period });
    const result = data.map((x) => rk.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
      expect(result[i].kurt).toBeCloseTo(expected[i].kurt, 7);
    }
  });
});

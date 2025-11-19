import { describe, it, expect } from "vitest";
import { MeanAbsDeviation, MedianAbsDeviation, IQR } from "../../src/rolling/deviation";

/**
 * Naive mean absolute deviation calculation
 */
function naiveMeanAbsDeviation(
  data: number[],
  period: number
): Array<{ mean: number; mad: number }> {
  const result: Array<{ mean: number; mad: number }> = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    const window: number[] = [];
    for (let j = start; j <= i; j++) {
      window.push(data[j]);
    }

    const n = window.length;
    const mean = window.reduce((a, b) => a + b, 0) / n;
    let sum = 0;
    for (const val of window) {
      sum += Math.abs(val - mean);
    }
    const mad = sum / n;

    result.push({ mean, mad });
  }
  return result;
}

/**
 * Naive median absolute deviation calculation - returns undefined until buffer is full
 */
function naiveMedianAbsDeviation(
  data: number[],
  period: number
): Array<{ median: number; mad: number } | undefined> {
  const result: Array<{ median: number; mad: number } | undefined> = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(undefined);
      continue;
    }

    const start = i - period + 1;
    const window: number[] = [];
    for (let j = start; j <= i; j++) {
      window.push(data[j]);
    }

    const sorted = [...window].sort((a, b) => a - b);
    const n = sorted.length;
    let median: number;
    if (n % 2 === 1) {
      median = sorted[Math.floor(n / 2)];
    } else {
      const mid = n / 2;
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    }

    const deviations = window.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
    let mad: number;
    if (n % 2 === 1) {
      mad = deviations[Math.floor(n / 2)];
    } else {
      const mid = n / 2;
      mad = (deviations[mid - 1] + deviations[mid]) / 2;
    }

    result.push({ median, mad });
  }
  return result;
}

/**
 * Naive IQR calculation - returns undefined until buffer is full
 */
function naiveIQR(
  data: number[],
  period: number
): Array<{ q1: number; q3: number; iqr: number } | undefined> {
  const result: Array<{ q1: number; q3: number; iqr: number } | undefined> = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(undefined);
      continue;
    }

    const start = i - period + 1;
    const window: number[] = [];
    for (let j = start; j <= i; j++) {
      window.push(data[j]);
    }

    const sorted = [...window].sort((a, b) => a - b);
    const n = sorted.length;
    const q1Idx = Math.floor((n - 1) * 0.25);
    const q3Idx = Math.floor((n - 1) * 0.75);
    const q1 = sorted[q1Idx];
    const q3 = sorted[q3Idx];

    result.push({ q1, q3, iqr: q3 - q1 });
  }
  return result;
}

describe("MeanAbsDeviation", () => {
  it("should compute mean absolute deviation with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveMeanAbsDeviation(data, period);

    const mad = new MeanAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].mad).toBeCloseTo(expected[i].mad, 8);
    }
  });

  it("should handle period 2", () => {
    const data = [10, 20, 30, 40];
    const period = 2;
    const expected = naiveMeanAbsDeviation(data, period);

    const mad = new MeanAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].mad).toBeCloseTo(expected[i].mad, 8);
    }
  });

  it("should handle unsorted data", () => {
    const data = [50, 10, 30, 70, 20, 60];
    const period = 4;
    const expected = naiveMeanAbsDeviation(data, period);

    const mad = new MeanAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].mad).toBeCloseTo(expected[i].mad, 8);
    }
  });
});

describe("MedianAbsDeviation", () => {
  it("should compute median absolute deviation with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveMedianAbsDeviation(data, period);

    const mad = new MedianAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]!.median).toBeCloseTo(exp.median, 8);
        expect(result[i]!.mad).toBeCloseTo(exp.mad, 8);
      }
    }
  });

  it("should compute with odd period", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 5;
    const expected = naiveMedianAbsDeviation(data, period);

    const mad = new MedianAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]!.median).toBeCloseTo(exp.median, 8);
        expect(result[i]!.mad).toBeCloseTo(exp.mad, 8);
      }
    }
  });

  it("should handle period 2", () => {
    const data = [10, 20, 30, 40];
    const period = 2;
    const expected = naiveMedianAbsDeviation(data, period);

    const mad = new MedianAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]!.median).toBeCloseTo(exp.median, 8);
        expect(result[i]!.mad).toBeCloseTo(exp.mad, 8);
      }
    }
  });

  it("should handle unsorted data", () => {
    const data = [50, 10, 30, 70, 20, 60];
    const period = 4;
    const expected = naiveMedianAbsDeviation(data, period);

    const mad = new MedianAbsDeviation({ period });
    const result = data.map((x) => mad.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]!.median).toBeCloseTo(exp.median, 8);
        expect(result[i]!.mad).toBeCloseTo(exp.mad, 8);
      }
    }
  });
});

describe("IQR", () => {
  it("should compute IQR with period 20", () => {
    const data = Array.from({ length: 30 }, (_, i) => (i + 1) * 10);
    const period = 20;
    const expected = naiveIQR(data, period);

    const iqr = new IQR({ period });
    const result = data.map((x) => iqr.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeNull();
      } else {
        expect(result[i]!.q1).toBeCloseTo(exp.q1, 8);
        expect(result[i]!.q3).toBeCloseTo(exp.q3, 8);
        expect(result[i]!.iqr).toBeCloseTo(exp.iqr, 8);
      }
    }
  });

  it("should compute IQR with period 10", () => {
    const data = Array.from({ length: 20 }, (_, i) => (i + 1) * 100);
    const period = 10;
    const expected = naiveIQR(data, period);

    const iqr = new IQR({ period });
    const result = data.map((x) => iqr.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeNull();
      } else {
        expect(result[i]!.q1).toBeCloseTo(exp.q1, 8);
        expect(result[i]!.q3).toBeCloseTo(exp.q3, 8);
        expect(result[i]!.iqr).toBeCloseTo(exp.iqr, 8);
      }
    }
  });

  it("should handle unsorted data", () => {
    const data = [50, 10, 80, 30, 70, 20, 90, 40, 60, 100, 5, 95, 15, 85, 25];
    const period = 10;
    const expected = naiveIQR(data, period);

    const iqr = new IQR({ period });
    const result = data.map((x) => iqr.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeNull();
      } else {
        expect(result[i]!.q1).toBeCloseTo(exp.q1, 8);
        expect(result[i]!.q3).toBeCloseTo(exp.q3, 8);
        expect(result[i]!.iqr).toBeCloseTo(exp.iqr, 8);
      }
    }
  });
});

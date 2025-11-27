import { describe, it, expect } from "vitest";
import { RollingMedian, RollingQuantile } from "../../src/rolling/rank";

/**
 * Naive median calculation - returns undefined until buffer is full
 */
function naiveMedian(data: number[], period: number): Array<number | undefined> {
  const result: Array<number | undefined> = [];
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
    window.sort((a, b) => a - b);
    const n = window.length;
    if (n % 2 === 1) {
      result.push(window[Math.floor(n / 2)]);
    } else {
      const mid = n / 2;
      result.push((window[mid - 1] + window[mid]) / 2);
    }
  }
  return result;
}

describe("RollingMedian", () => {
  it("should compute rolling median with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveMedian(data, period);

    const rm = new RollingMedian({ period });
    const result = data.map((x) => rm.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeCloseTo(exp, 8);
      }
    }
  });

  it("should compute median with odd window size", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 5;
    const expected = naiveMedian(data, period);

    const rm = new RollingMedian({ period });
    const result = data.map((x) => rm.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeCloseTo(exp, 8);
      }
    }
  });

  it("should compute median with even window size", () => {
    const data = [100, 200, 300, 400, 500, 600];
    const period = 4;
    const expected = naiveMedian(data, period);

    const rm = new RollingMedian({ period });
    const result = data.map((x) => rm.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeCloseTo(exp, 8);
      }
    }
  });

  it("should handle period 2", () => {
    const data = [10, 20, 30, 40];
    const period = 2;
    const expected = naiveMedian(data, period);

    const rm = new RollingMedian({ period });
    const result = data.map((x) => rm.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeCloseTo(exp, 8);
      }
    }
  });

  it("should handle unsorted data", () => {
    const data = [50, 10, 30, 70, 20, 60];
    const period = 4;
    const expected = naiveMedian(data, period);

    const rm = new RollingMedian({ period });
    const result = data.map((x) => rm.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeCloseTo(exp, 8);
      }
    }
  });

  it("should return same value from value property as last update", () => {
    const rm = new RollingMedian({ period: 4 });
    rm.update(10);
    rm.update(20);
    rm.update(30);
    rm.update(40);
    const lastValue = rm.update(50);
    expect(rm.value).toEqual(lastValue);
  });
});

/**
 * Naive quantile calculation using sort
 */
function naiveQuantile(data: number[], period: number, quantiles: number[]): Array<number[] | undefined> {
  const result: Array<number[] | undefined> = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    const window: number[] = [];
    for (let j = start; j <= i; j++) {
      window.push(data[j]);
    }

    if (window.length < period) {
      result.push(undefined);
      continue;
    }

    window.sort((a, b) => a - b);
    const n = window.length;
    const qvals: number[] = [];

    for (const q of quantiles) {
      const idx = Math.min(Math.round(n * q), n - 1);
      qvals.push(window[idx]);
    }

    result.push(qvals);
  }
  return result;
}

describe("RollingQuantile", () => {
  it("should compute rolling quantiles [0.25, 0.5, 0.75] with period 20", () => {
    const data = Array.from({ length: 30 }, (_, i) => (i + 1) * 10);
    const period = 20;
    const quantiles = [0.25, 0.5, 0.75];
    const expected = naiveQuantile(data, period, quantiles);

    const rq = new RollingQuantile({ period, quantiles });
    const result = data.map((x) => rq.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeDefined();
        for (let j = 0; j < quantiles.length; j++) {
          expect(result[i]![j]).toBeCloseTo(exp[j], 8);
        }
      }
    }
  });

  it("should return undefined until buffer is full", () => {
    const data = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
    const period = 20;
    const quantiles = [0.5];

    const rq = new RollingQuantile({ period, quantiles });

    for (let i = 0; i < 10; i++) {
      expect(rq.update(data[i])).toBeUndefined();
    }
  });

  it("should compute single quantile (median)", () => {
    const data = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
    const period = 10;
    const quantiles = [0.5];
    const expected = naiveQuantile(data, period, quantiles);

    const rq = new RollingQuantile({ period, quantiles });
    const result = data.map((x) => rq.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeDefined();
        expect(result[i]![0]).toBeCloseTo(exp[0], 8);
      }
    }
  });

  it("should handle multiple quantiles", () => {
    const data = Array.from({ length: 30 }, (_, i) => (i + 1) * 100);
    const period = 20;
    const quantiles = [0.0, 0.25, 0.5, 0.75, 1.0];
    const expected = naiveQuantile(data, period, quantiles);

    const rq = new RollingQuantile({ period, quantiles });
    const result = data.map((x) => rq.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeDefined();
        for (let j = 0; j < quantiles.length; j++) {
          expect(result[i]![j]).toBeCloseTo(exp[j], 8);
        }
      }
    }
  });

  it("should handle unsorted data", () => {
    const data = [50, 10, 80, 30, 70, 20, 90, 40, 60, 100, 5, 95, 15, 85, 25];
    const period = 10;
    const quantiles = [0.25, 0.75];
    const expected = naiveQuantile(data, period, quantiles);

    const rq = new RollingQuantile({ period, quantiles });
    const result = data.map((x) => rq.update(x));

    for (let i = 0; i < result.length; i++) {
      const exp = expected[i];
      if (exp === undefined) {
        expect(result[i]).toBeUndefined();
      } else {
        expect(result[i]).toBeDefined();
        for (let j = 0; j < quantiles.length; j++) {
          expect(result[i]![j]).toBeCloseTo(exp[j], 8);
        }
      }
    }
  });

  it("should return same value from value property as last update", () => {
    const rq = new RollingQuantile({ period: 10, quantiles: [0.25, 0.75] });
    for (let i = 1; i <= 10; i++) {
      rq.update(i * 10);
    }
    const lastValue = rq.update(110);
    expect(rq.value).toEqual(lastValue);
  });
});

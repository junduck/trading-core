import { describe, it, expect } from "vitest";
import { RollingSum, SMA, EMA, EWMA } from "../../src/rolling/average.js";
import { exp_factor } from "../../src/numeric/accum.js";

/**
 * Naive O(n) implementation for generating test data
 */
function naiveRollingSum(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sum = 0;
    for (let j = start; j <= i; j++) {
      sum += data[j];
    }
    result.push(sum);
  }
  return result;
}

/**
 * Naive O(n) implementation for generating test data
 */
function naiveSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sum = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sum += data[j];
      count++;
    }
    result.push(sum / count);
  }
  return result;
}

/**
 * Naive implementation for EMA test data
 */
function naiveEMA(data: number[], alpha: number): number[] {
  const result: number[] = [];
  let ema = data[0];
  result.push(ema);
  for (let i = 1; i < data.length; i++) {
    ema = alpha * data[i] + (1 - alpha) * ema;
    result.push(ema);
  }
  return result;
}

/**
 * Naive implementation for generating test data
 */
function naiveEWMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const alpha = exp_factor(period);
  const a1 = 1 - alpha;

  for (let i = 0; i < data.length; i++) {
    const windowStart = Math.max(0, i - period + 1);
    let s = 0;
    let totalWeight = 0;

    for (let j = windowStart; j <= i; j++) {
      const age = i - j;
      const weight = Math.pow(a1, age);
      s += data[j] * weight;
      totalWeight += weight;
    }

    result.push(s / totalWeight);
  }
  return result;
}

describe("RollingSum", () => {
  it("should compute moving sum with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveRollingSum(data, period);

    const ms = new RollingSum({ period });
    const result = data.map((x) => ms.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle period larger than data", () => {
    const data = [100, 200];
    const period = 10;
    const expected = naiveRollingSum(data, period);

    const ms = new RollingSum({ period });
    const result = data.map((x) => ms.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle single element period", () => {
    const data = [10, 20, 30, 40];
    const period = 1;
    const expected = naiveRollingSum(data, period);

    const ms = new RollingSum({ period });
    const result = data.map((x) => ms.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle fractional values", () => {
    const data = [1.5, 2.5, 3.5, 4.5, 5.5];
    const period = 2;
    const expected = naiveRollingSum(data, period);

    const ms = new RollingSum({ period });
    const result = data.map((x) => ms.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });
});

describe("SMA", () => {
  it("should compute SMA with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveSMA(data, period);

    const sma = new SMA({ period });
    const result = data.map((x) => sma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle period 10", () => {
    const data = [100, 200, 300, 400, 500];
    const period = 10;
    const expected = naiveSMA(data, period);

    const sma = new SMA({ period });
    const result = data.map((x) => sma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should compute correct average for period 2", () => {
    const data = [10, 20, 30, 40];
    const period = 2;
    const expected = naiveSMA(data, period);

    const sma = new SMA({ period });
    const result = data.map((x) => sma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle varying values", () => {
    const data = [5.5, 10.5, 15.5, 20.5, 25.5, 30.5];
    const period = 4;
    const expected = naiveSMA(data, period);

    const sma = new SMA({ period });
    const result = data.map((x) => sma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });
});

describe("EMA", () => {
  it("should compute EMA with period 10", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 10;
    const alpha = exp_factor(period);
    const expected = naiveEMA(data, alpha);

    const ema = new EMA({ period });
    const result = data.map((x) => ema.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should compute EMA with direct alpha value", () => {
    const data = [100, 200, 300, 400];
    const alpha = 0.5;
    const expected = naiveEMA(data, alpha);

    const ema = new EMA({ alpha });
    const result = data.map((x) => ema.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should compute EMA with period 4", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 4;
    const alpha = exp_factor(period);
    const expected = naiveEMA(data, alpha);

    const ema = new EMA({ period });
    const result = data.map((x) => ema.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle small alpha values", () => {
    const data = [50, 100, 150, 200];
    const alpha = 0.1;
    const expected = naiveEMA(data, alpha);

    const ema = new EMA({ alpha });
    const result = data.map((x) => ema.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });
});

describe("EWMA", () => {
  it("should compute exp window MA with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveEWMA(data, period);

    const ewma = new EWMA({ period });
    const result = data.map((x) => ewma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 8);
    }
  });

  it("should handle period 10", () => {
    const data = [100, 200, 300, 400, 500];
    const period = 10;
    const expected = naiveEWMA(data, period);

    const ewma = new EWMA({ period });
    const result = data.map((x) => ewma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 8);
    }
  });

  it("should handle period 2", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 2;
    const expected = naiveEWMA(data, period);

    const ewma = new EWMA({ period });
    const result = data.map((x) => ewma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 8);
    }
  });

  it("should compute weighted average correctly", () => {
    const data = [5, 10, 15, 20, 25, 30];
    const period = 4;
    const expected = naiveEWMA(data, period);

    const ewma = new EWMA({ period });
    const result = data.map((x) => ewma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 8);
    }
  });
});

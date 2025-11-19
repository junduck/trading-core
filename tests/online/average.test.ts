import { describe, it, expect } from "vitest";
import { CMA, EMA } from "../../src/online/average";
import { exp_factor } from "../../src/rolling/accum";

/**
 * Naive implementation for CMA test data
 */
function naiveCMA(data: number[]): number[] {
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    result.push(sum / (i + 1));
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

describe("CMA", () => {
  it("should compute CMA for simple sequence", () => {
    const data = [10, 20, 30, 40, 50];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should compute CMA for constant values", () => {
    const data = [100, 100, 100, 100, 100];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
      expect(result[i]).toBeCloseTo(100, 10);
    }
  });

  it("should compute CMA with increasing values", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should compute CMA with decreasing values", () => {
    const data = [100, 80, 60, 40, 20];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle alternating values", () => {
    const data = [10, 100, 10, 100, 10, 100];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle single value", () => {
    const cma = new CMA();
    const result = cma.update(50);
    expect(result).toBeCloseTo(50, 10);
  });

  it("should handle negative values", () => {
    const data = [-10, -20, -30, -40];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i], 10);
    }
  });

  it("should handle mixed positive and negative values", () => {
    const data = [100, -50, 200, -100, 50];
    const expected = naiveCMA(data);

    const cma = new CMA();
    const result = data.map((x) => cma.update(x));

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

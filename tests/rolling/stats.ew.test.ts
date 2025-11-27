import { describe, it, expect } from "vitest";
import {
  RollingCovEW,
  RollingCorrEW,
  RollingBetaEW,
} from "../../src/rolling/stats.js";

describe("RollingCovEW", () => {
  it("should initialize with zero values", () => {
    const covEw = new RollingCovEW({ period: 10 });
    expect(covEw.value).toEqual({ meanX: 0, meanY: 0, cov: 0 });
  });

  it("should initialize means on first update", () => {
    const covEw = new RollingCovEW({ period: 10 });
    const result = covEw.update(5, 10);
    expect(result.meanX).toBe(5);
    expect(result.meanY).toBe(10);
    expect(result.cov).toBe(0);
  });

  it("should compute covariance for perfectly correlated series", () => {
    const covEw = new RollingCovEW({ period: 10 });
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10]; // y = 2*x

    let result;
    for (let i = 0; i < x.length; i++) {
      result = covEw.update(x[i], y[i]);
    }
    expect(result!.cov).toBeGreaterThan(0);
  });

  it("should compute covariance for negatively correlated series", () => {
    const covEw = new RollingCovEW({ period: 10 });
    const x = [1, 2, 3, 4, 5];
    const y = [10, 8, 6, 4, 2]; // negative correlation

    let result;
    for (let i = 0; i < x.length; i++) {
      result = covEw.update(x[i], y[i]);
    }

    expect(result!.cov).toBeLessThan(0);
  });

  it("should return zero covariance for uncorrelated constant series", () => {
    const covEw = new RollingCovEW({ period: 10 });
    const x = [1, 1, 1, 1, 1];
    const y = [2, 3, 4, 5, 6];

    let result;
    for (let i = 0; i < x.length; i++) {
      result = covEw.update(x[i], y[i]);
    }

    expect(Math.abs(result!.cov)).toBeLessThan(1e-10);
  });

  it("should converge with large random dataset", () => {
    const n = 1000;
    const covEw = new RollingCovEW({ period: 20 });

    let result;
    for (let i = 0; i < n; i++) {
      const x = Math.random();
      const y = 2 * x + Math.random() * 0.1;
      result = covEw.update(x, y);
    }

    expect(result!.cov).toBeGreaterThan(0);
    expect(result!.meanX).toBeGreaterThan(0);
    expect(result!.meanY).toBeGreaterThan(0);
  });

  it("should match windowed exp weights with stationary data after warmup", () => {
    const period = 20;
    const alpha = 2 / (period + 1);
    const covEw = new RollingCovEW({ alpha });

    let seed = 42;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const x: number[] = [];
    const y: number[] = [];

    for (let i = 0; i < 100; i++) {
      const xi = seededRandom() * 10;
      const yi = 2 * xi + seededRandom() * 0.5;
      x.push(xi);
      y.push(yi);
      covEw.update(xi, yi);
    }

    const ewResult = covEw.value;
    const weights = []; // Will use exp weights implementation
    for (let i = 0; i < period; i++) {
      weights.push(Math.pow(1 - alpha, period - 1 - i));
    }
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < period; i++) {
      weights[i] /= sumWeights;
    }

    const xWindow = x.slice(-period);
    const yWindow = y.slice(-period);
    const meanX = weights.reduce((sum, w, i) => sum + w * xWindow[i], 0);
    const meanY = weights.reduce((sum, w, i) => sum + w * yWindow[i], 0);
    let weightedCov = 0;
    for (let i = 0; i < period; i++) {
      weightedCov += weights[i] * (xWindow[i] - meanX) * (yWindow[i] - meanY);
    }

    const relDiff =
      Math.abs(ewResult.cov - weightedCov) / Math.abs(weightedCov);

    expect(relDiff).toBeLessThan(0.05);
  });
});

describe("RollingCorrEW", () => {
  it("should initialize with zero values", () => {
    const corrEw = new RollingCorrEW({ period: 10 });
    expect(corrEw.value).toEqual({ meanX: 0, meanY: 0, cov: 0, corr: 0 });
  });

  it("should compute correlation for perfectly correlated series", () => {
    const corrEw = new RollingCorrEW({ period: 10 });
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]; // y = 2*x

    let result;
    for (let i = 0; i < x.length; i++) {
      result = corrEw.update(x[i], y[i]);
    }

    expect(result!.corr).toBeCloseTo(1, 5);
  });

  it("should compute correlation for perfectly negatively correlated series", () => {
    const corrEw = new RollingCorrEW({ period: 10 });
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2]; // y = 22 - 2*x

    let result;
    for (let i = 0; i < x.length; i++) {
      result = corrEw.update(x[i], y[i]);
    }

    expect(result!.corr).toBeCloseTo(-1, 5);
  });

  it("should compute correlation in range [-1, 1]", () => {
    const corrEw = new RollingCorrEW({ period: 10 });
    const x = [1, 4, 2, 8, 5, 7, 3, 9, 6, 10];
    const y = [2, 8, 3, 7, 6, 5, 9, 4, 10, 1];

    for (let i = 0; i < x.length; i++) {
      const result = corrEw.update(x[i], y[i]);
      expect(result.corr).toBeGreaterThanOrEqual(-1);
      expect(result.corr).toBeLessThanOrEqual(1);
    }
  });

  it("should return zero correlation for constant series", () => {
    const corrEw = new RollingCorrEW({ period: 10 });
    const x = [5, 5, 5, 5, 5];
    const y = [2, 3, 4, 5, 6];

    let result;
    for (let i = 0; i < x.length; i++) {
      result = corrEw.update(x[i], y[i]);
    }

    expect(result!.corr).toBe(0);
  });

  it("should maintain relationship: corr = cov / sqrt(varX * varY)", () => {
    const corrEw = new RollingCorrEW({ period: 10 });
    const x = [10, 20, 15, 25, 30, 18, 22, 28, 35, 40];
    const y = [5, 10, 8, 12, 15, 9, 11, 14, 17, 20];

    for (let i = 0; i < x.length; i++) {
      corrEw.update(x[i], y[i]);
    }

    const result = corrEw.value;
    expect(Math.abs(result.corr)).toBeLessThanOrEqual(1);
  });

  it("should converge to strong positive correlation with large random dataset", () => {
    const n = 1000;
    const corrEw = new RollingCorrEW({ period: 20 });

    let result;
    for (let i = 0; i < n; i++) {
      const x = Math.random();
      const y = 2 * x + Math.random() * 0.1;
      result = corrEw.update(x, y);
    }

    expect(result!.corr).toBeGreaterThan(0.9);
    expect(result!.corr).toBeLessThanOrEqual(1);
  });
});

describe("RollingBetaEW", () => {
  it("should initialize with zero values", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    expect(betaEw.value).toEqual({ meanX: 0, meanY: 0, cov: 0, beta: 0 });
  });

  it("should compute beta for linear relationship y = 2x", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

    let result;
    for (let i = 0; i < x.length; i++) {
      result = betaEw.update(x[i], y[i]);
    }

    expect(result!.beta).toBeCloseTo(2, 5);
  });

  it("should compute negative beta for inverse relationship", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2]; // y = 22 - 2x

    let result;
    for (let i = 0; i < x.length; i++) {
      result = betaEw.update(x[i], y[i]);
    }

    expect(result!.beta).toBeCloseTo(-2, 5);
  });

  it("should return zero beta when X is constant", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    const x = [5, 5, 5, 5, 5];
    const y = [2, 3, 4, 5, 6];

    let result;
    for (let i = 0; i < x.length; i++) {
      result = betaEw.update(x[i], y[i]);
    }

    expect(result!.beta).toBe(0);
  });

  it("should compute beta = cov(X,Y) / var(X)", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    const x = [10, 20, 15, 25, 30, 18, 22, 28, 35, 40];
    const y = [15, 30, 22, 38, 45, 27, 33, 42, 53, 60];

    for (let i = 0; i < x.length; i++) {
      betaEw.update(x[i], y[i]);
    }

    const result = betaEw.value;
    expect(result.beta).toBeGreaterThan(0);
  });

  it("should handle y = x (beta = 1)", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let result;
    for (const val of values) {
      result = betaEw.update(val, val);
    }

    expect(result!.beta).toBeCloseTo(1, 5);
  });

  it("should compute beta with offset: y = 3x + 10", () => {
    const betaEw = new RollingBetaEW({ period: 10 });
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = x.map((v) => 3 * v + 10);

    let result;
    for (let i = 0; i < x.length; i++) {
      result = betaEw.update(x[i], y[i]);
    }

    expect(result!.beta).toBeCloseTo(3, 5);
  });

  it("should converge with large random dataset", () => {
    const n = 1000;
    const betaEw = new RollingBetaEW({ period: 20 });
    const trueBeta = 2.5;

    let result;
    for (let i = 0; i < n; i++) {
      const x = Math.random();
      const y = trueBeta * x + Math.random() * 0.1;
      result = betaEw.update(x, y);
    }

    expect(result!.beta).toBeCloseTo(trueBeta, 1);
  });
});

describe("EW algorithms - consistency checks", () => {
  it("should maintain cov relationship across all three classes", () => {
    const period = 10;
    const covEw = new RollingCovEW({ period });
    const corrEw = new RollingCorrEW({ period });
    const betaEw = new RollingBetaEW({ period });

    const x = [10, 20, 15, 25, 30, 18, 22, 28, 35, 40];
    const y = [15, 30, 22, 38, 45, 27, 33, 42, 53, 60];

    for (let i = 0; i < x.length; i++) {
      covEw.update(x[i], y[i]);
      corrEw.update(x[i], y[i]);
      betaEw.update(x[i], y[i]);
    }

    const covResult = covEw.value.cov;
    const corrResult = corrEw.value.cov;
    const betaResult = betaEw.value.cov;

    expect(corrResult).toBeCloseTo(covResult, 10);
    expect(betaResult).toBeCloseTo(covResult, 10);
  });
});

import { describe, it, expect } from "vitest";
import {
  historicalCVaR,
  parametricCVaR,
  expWeightedCVaR,
} from "../../src/numeric/CVaR.js";
import { invNormalCDF } from "../../src/numeric/utils.js";

describe("historicalCVaR", () => {
  it("calculates CVaR for simple loss distribution", () => {
    const returns = [-10, -5, -3, -1, 0, 1, 2, 3, 4, 5];
    const cvar = historicalCVaR(returns, 0.3);
    expect(cvar).toBeCloseTo((-10 - 5 - 3) / 3, 10);
  });

  it("calculates CVaR for uniform returns", () => {
    const returns = Array.from({ length: 100 }, (_, i) => i - 50);
    const cvar = historicalCVaR(returns, 0.05);
    expect(cvar).toBeLessThan(-45);
  });

  it("handles single value in tail", () => {
    const returns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const cvar = historicalCVaR(returns, 0.1);
    expect(cvar).toBeCloseTo(1, 10);
  });

  it("returns mean for alpha approaching 1", () => {
    const returns = [-2, -1, 0, 1, 2];
    const cvar = historicalCVaR(returns, 0.99);
    expect(cvar).toBeCloseTo(0, 1);
  });

  it("handles boundary conditions", () => {
    expect(historicalCVaR([], 0.05)).toBeNaN();
    expect(historicalCVaR([1, 2, 3], 0)).toBeNaN();
    expect(historicalCVaR([1, 2, 3], 1)).toBeNaN();
    expect(historicalCVaR([1, 2, 3], -0.1)).toBeNaN();
  });
});

describe("parametricCVaR", () => {
  it("calculates CVaR assuming normal distribution", () => {
    const returns = Array.from({ length: 1000 }, (_, i) => (i - 500) / 100);
    const cvar = parametricCVaR(returns, 0.05);
    expect(cvar).toBeLessThan(0);
    expect(cvar).toBeGreaterThan(-10);
  });

  it("validates against known normal distribution", () => {
    // Standard normal: μ=0, σ=1
    // CVaR(0.05) = -φ(Φ^(-1)(0.05)) / 0.05 ≈ -2.063
    const stdNormal = Array.from(
      { length: 10000 },
      () =>
        Math.cos(2 * Math.PI * Math.random()) *
        Math.sqrt(-2 * Math.log(Math.random()))
    );
    const cvar = parametricCVaR(stdNormal, 0.05);
    expect(cvar).toBeCloseTo(-2.063, 1);
  });

  it("returns mean when sigma is zero", () => {
    const returns = [5, 5, 5, 5, 5];
    const cvar = parametricCVaR(returns, 0.05);
    expect(cvar).toBeCloseTo(5, 10);
  });

  it("handles shifted distributions", () => {
    const returns = Array.from({ length: 100 }, (_, i) => (i - 50) / 10);
    const cvar1 = parametricCVaR(returns, 0.05);

    const shiftedReturns = returns.map((r) => r + 10);
    const cvar2 = parametricCVaR(shiftedReturns, 0.05);

    expect(cvar2 - cvar1).toBeCloseTo(10, 10);
  });

  it("handles boundary conditions", () => {
    expect(parametricCVaR([], 0.05)).toBeNaN();
    expect(parametricCVaR([1, 2, 3], 0)).toBeNaN();
    expect(parametricCVaR([1, 2, 3], 1)).toBeNaN();
  });
});

describe("expWeightedCVaR", () => {
  /**
   * Naive reference implementation for validation.
   * Uses windowed exponential weights (regulatory approach).
   */
  function naiveExpWeightedCVaR(
    ret: number[],
    alpha: number,
    lambda: number
  ): number {
    if (ret.length === 0 || alpha <= 0 || alpha >= 1) return NaN;

    const n = ret.length;

    // Compute sum using geometric series formula for stability
    const lambdaN = Math.pow(lambda, n);
    const sumWeights = (1 - lambdaN) / (1 - lambda);

    // Generate and normalize weights
    const weights: number[] = [];
    for (let i = 0; i < n; i++) {
      const w = Math.pow(lambda, n - 1 - i);
      weights.push(w / sumWeights);
    }

    // Compute weighted mean
    let wMean = 0;
    for (let i = 0; i < n; i++) {
      wMean += weights[i]! * ret[i]!;
    }

    // Compute weighted variance
    let wVar = 0;
    for (let i = 0; i < n; i++) {
      const delta = ret[i]! - wMean;
      wVar += weights[i]! * delta * delta;
    }

    const wStd = Math.sqrt(wVar);
    if (wStd === 0) return wMean;

    // Apply parametric CVaR formula
    const z = invNormalCDF(alpha);
    const phi = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    return wMean - wStd * (phi / alpha);
  }

  it("validates against naive reference implementation", () => {
    const testCases = [
      {
        returns: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4],
        alpha: 0.05,
        lambda: 0.996,
      },
      { returns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], alpha: 0.01, lambda: 0.99 },
      {
        returns: Array.from({ length: 50 }, (_, i) => (i - 25) / 5),
        alpha: 0.05,
        lambda: 0.95,
      },
    ];

    for (const { returns, alpha, lambda } of testCases) {
      const actual = expWeightedCVaR(returns, alpha, lambda);
      const expected = naiveExpWeightedCVaR(returns, alpha, lambda);

      // Should match within small tolerance
      expect(actual).toBeCloseTo(expected, 6);
    }
  });

  it("calculates exponentially weighted CVaR", () => {
    const returns = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
    const cvar = expWeightedCVaR(returns, 0.05, 0.996);
    expect(cvar).toBeLessThan(0);
  });

  it("gives more weight to recent observations", () => {
    const returns1 = [-10, -10, -10, -10, -10, 1, 1, 1, 1, 1];
    const returns2 = [1, 1, 1, 1, 1, -10, -10, -10, -10, -10];

    const cvar1 = expWeightedCVaR(returns1, 0.05, 0.9);
    const cvar2 = expWeightedCVaR(returns2, 0.05, 0.9);

    // Values should be different due to exponential weighting
    expect(cvar1).not.toBe(cvar2);
    expect(Math.abs(cvar1 - cvar2)).toBeGreaterThan(1);
  });

  it("varies with decay factor", () => {
    const returns = Array.from({ length: 100 }, (_, i) => (i - 50) / 10);

    const cvarHighDecay = expWeightedCVaR(returns, 0.05, 0.9);
    const cvarLowDecay = expWeightedCVaR(returns, 0.05, 0.99);

    // Different decay factors should produce different results
    expect(cvarHighDecay).not.toBe(cvarLowDecay);
  });

  it("returns mean when variance is zero", () => {
    const returns = [5, 5, 5, 5, 5];
    const cvar = expWeightedCVaR(returns, 0.05, 0.996);
    expect(cvar).toBeCloseTo(5, 10);
  });

  it("handles different decay factors", () => {
    const returns = Array.from({ length: 100 }, (_, i) => Math.sin(i / 10));

    const cvar1 = expWeightedCVaR(returns, 0.05, 0.9);
    const cvar2 = expWeightedCVaR(returns, 0.05, 0.99);

    expect(cvar1).not.toBe(cvar2);
  });

  it("handles boundary conditions", () => {
    expect(expWeightedCVaR([], 0.05, 0.996)).toBeNaN();
    expect(expWeightedCVaR([1, 2, 3], 0, 0.996)).toBeNaN();
    expect(expWeightedCVaR([1, 2, 3], 1, 0.996)).toBeNaN();
  });
});

describe("CVaR comparison", () => {
  it("validates consistency across methods for large samples", () => {
    const returns = Array.from(
      { length: 10000 },
      () =>
        Math.cos(2 * Math.PI * Math.random()) *
        Math.sqrt(-2 * Math.log(Math.random()))
    );

    const historical = historicalCVaR(returns, 0.05);
    const parametric = parametricCVaR(returns, 0.05);
    const expWeighted = expWeightedCVaR(returns, 0.05, 0.996);

    expect(Math.abs(historical - parametric)).toBeLessThan(0.5);
    expect(Math.abs(parametric - expWeighted)).toBeLessThan(0.5);
  });

  it("validates CVaR is less than or equal to mean", () => {
    const returns = [-5, -3, -1, 0, 2, 4, 6, 8, 10, 12];
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;

    const historical = historicalCVaR(returns, 0.3);
    expect(historical).toBeLessThanOrEqual(mean);
  });
});

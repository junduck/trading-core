import { describe, it, expect } from "vitest";
import {
  RollingVar,
  RollingVarEW,
  RollingStddev,
  RollingStddevEW,
  RollingZScore,
  RollingZScoreEW,
  RollingCov,
  RollingCorr,
  RollingBeta,
} from "../../src/rolling/stats.js";
import { exp_factor } from "../../src/numeric/accum.js";

/**
 * Naive O(n) variance calculation for generating test data
 */
function naiveVariance(
  data: number[],
  period: number,
  ddof: number
): Array<{ mean: number; variance: number }> {
  const result: Array<{ mean: number; variance: number }> = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sum = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sum += data[j];
      count++;
    }
    const mean = sum / count;
    let variance = 0;
    if (count > ddof) {
      for (let j = start; j <= i; j++) {
        variance += (data[j] - mean) ** 2;
      }
      variance /= count - ddof;
    }
    result.push({ mean, variance });
  }
  return result;
}

/**
 * Naive exponentially weighted variance
 */
function naiveVarianceEW(
  data: number[],
  alpha: number
): Array<{ mean: number; variance: number }> {
  const result: Array<{ mean: number; variance: number }> = [];
  let mean = data[0];
  let variance = 0;
  result.push({ mean, variance });

  for (let i = 1; i < data.length; i++) {
    const delta = data[i] - mean;
    mean += delta * alpha;
    const delta2 = data[i] - mean;
    variance = (1 - alpha) * variance + alpha * delta * delta2;
    result.push({ mean, variance });
  }
  return result;
}

/**
 * Naive O(n) covariance calculation
 */
function naiveCovariance(
  dataX: number[],
  dataY: number[],
  period: number,
  ddof: number
): Array<{ meanX: number; meanY: number; cov: number }> {
  const result: Array<{ meanX: number; meanY: number; cov: number }> = [];
  for (let i = 0; i < dataX.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sumX += dataX[j];
      sumY += dataY[j];
      count++;
    }
    const meanX = sumX / count;
    const meanY = sumY / count;
    let cov = 0;
    if (count > ddof) {
      for (let j = start; j <= i; j++) {
        cov += (dataX[j] - meanX) * (dataY[j] - meanY);
      }
      cov /= count - ddof;
    }
    result.push({ meanX, meanY, cov });
  }
  return result;
}

/**
 * Naive O(n) correlation calculation
 */
function naiveCorrelation(
  dataX: number[],
  dataY: number[],
  period: number,
  ddof: number
): Array<{ meanX: number; meanY: number; cov: number; corr: number }> {
  const result: Array<{
    meanX: number;
    meanY: number;
    cov: number;
    corr: number;
  }> = [];
  for (let i = 0; i < dataX.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sumX += dataX[j];
      sumY += dataY[j];
      count++;
    }
    const meanX = sumX / count;
    const meanY = sumY / count;
    let cov = 0;
    let varX = 0;
    let varY = 0;
    if (count > ddof) {
      for (let j = start; j <= i; j++) {
        const dx = dataX[j] - meanX;
        const dy = dataY[j] - meanY;
        cov += dx * dy;
        varX += dx * dx;
        varY += dy * dy;
      }
      cov /= count - ddof;
      const denom = Math.sqrt(varX * varY);
      const corr = denom === 0 ? 0 : (cov * (count - ddof)) / denom;
      result.push({ meanX, meanY, cov, corr });
    } else {
      result.push({ meanX, meanY, cov: 0, corr: 0 });
    }
  }
  return result;
}

/**
 * Naive O(n) beta calculation
 */
function naiveBeta(
  dataX: number[],
  dataY: number[],
  period: number,
  ddof: number
): Array<{ meanX: number; meanY: number; cov: number; beta: number }> {
  const result: Array<{
    meanX: number;
    meanY: number;
    cov: number;
    beta: number;
  }> = [];
  for (let i = 0; i < dataX.length; i++) {
    const start = Math.max(0, i - period + 1);
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = start; j <= i; j++) {
      sumX += dataX[j];
      sumY += dataY[j];
      count++;
    }
    const meanX = sumX / count;
    const meanY = sumY / count;
    let cov = 0;
    let varX = 0;
    if (count > ddof) {
      for (let j = start; j <= i; j++) {
        const dx = dataX[j] - meanX;
        const dy = dataY[j] - meanY;
        cov += dx * dy;
        varX += dx * dx;
      }
      cov /= count - ddof;
      const beta = varX > 0 ? (cov * (count - ddof)) / varX : 0;
      result.push({ meanX, meanY, cov, beta });
    } else {
      result.push({ meanX, meanY, cov: 0, beta: 0 });
    }
  }
  return result;
}

describe("RollingVar", () => {
  it("should compute rolling variance with period 4 and ddof 0", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const period = 4;
    const ddof = 0;
    const expected = naiveVariance(data, period, ddof);

    const rv = new RollingVar({ period, ddof });
    const result = data.map((x) => rv.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
    }
  });

  it("should compute rolling variance with period 4 and ddof 1", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const period = 4;
    const ddof = 1;
    const expected = naiveVariance(data, period, ddof);

    const rv = new RollingVar({ period, ddof });
    const result = data.map((x) => rv.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
    }
  });

  it("should handle period 2", () => {
    const data = [100, 200, 300, 400];
    const period = 2;
    const ddof = 0;
    const expected = naiveVariance(data, period, ddof);

    const rv = new RollingVar({ period, ddof });
    const result = data.map((x) => rv.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const rv = new RollingVar({ period: 4 });
    let lastValue = rv.update(10);
    expect(rv.value).toEqual(lastValue);
    rv.update(20);
    rv.update(30);
    rv.update(40);
    lastValue = rv.update(50);
    expect(rv.value).toEqual(lastValue);
  });
});

describe("RollingVarEW", () => {
  it("should compute exponentially weighted variance with period 10", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const period = 10;
    const alpha = exp_factor(period);
    const expected = naiveVarianceEW(data, alpha);

    const rvew = new RollingVarEW({ period });
    const result = data.map((x) => rvew.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
    }
  });

  it("should compute with direct alpha value", () => {
    const data = [100, 200, 300, 400];
    const alpha = 0.5;
    const expected = naiveVarianceEW(data, alpha);

    const rvew = new RollingVarEW({ alpha });
    const result = data.map((x) => rvew.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].variance).toBeCloseTo(expected[i].variance, 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const rvew = new RollingVarEW({ period: 10 });
    let lastValue = rvew.update(10);
    expect(rvew.value).toEqual(lastValue);
    rvew.update(20);
    rvew.update(30);
    lastValue = rvew.update(40);
    expect(rvew.value).toEqual(lastValue);
  });
});

describe("RollingStddev", () => {
  it("should compute rolling stddev with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60];
    const period = 4;
    const ddof = 0;
    const expected = naiveVariance(data, period, ddof);

    const rs = new RollingStddev({ period, ddof });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].stddev).toBeCloseTo(Math.sqrt(expected[i].variance), 8);
    }
  });

  it("should compute rolling stddev with ddof 1", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 4;
    const ddof = 1;
    const expected = naiveVariance(data, period, ddof);

    const rs = new RollingStddev({ period, ddof });
    const result = data.map((x) => rs.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].stddev).toBeCloseTo(Math.sqrt(expected[i].variance), 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const rs = new RollingStddev({ period: 4 });
    let lastValue = rs.update(10);
    expect(rs.value).toEqual(lastValue);
    rs.update(20);
    rs.update(30);
    rs.update(40);
    lastValue = rs.update(50);
    expect(rs.value).toEqual(lastValue);
  });
});

describe("RollingStddevEW", () => {
  it("should compute exponentially weighted stddev", () => {
    const data = [10, 20, 30, 40, 50];
    const alpha = 0.5;
    const expected = naiveVarianceEW(data, alpha);

    const rsew = new RollingStddevEW({ alpha });
    const result = data.map((x) => rsew.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].stddev).toBeCloseTo(Math.sqrt(expected[i].variance), 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const rsew = new RollingStddevEW({ period: 10 });
    rsew.update(10);
    rsew.update(20);
    rsew.update(30);
    const lastValue = rsew.update(40);
    expect(rsew.value).toEqual(lastValue);
  });
});

describe("RollingZScore", () => {
  it("should compute rolling z-score with period 4", () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80];
    const period = 4;
    const expected = naiveVariance(data, period, 0);

    const rz = new RollingZScore({ period });
    const result = data.map((x) => rz.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      expect(result[i].stddev).toBeCloseTo(Math.sqrt(expected[i].variance), 8);
      const expectedZ =
        expected[i].variance > 0
          ? (data[i] - expected[i].mean) / Math.sqrt(expected[i].variance)
          : 0;
      expect(result[i].zscore).toBeCloseTo(expectedZ, 8);
    }
  });

  it("should handle zero stddev", () => {
    const data = [10, 10, 10, 10];
    const period = 4;

    const rz = new RollingZScore({ period });
    const result = data.map((x) => rz.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].zscore).toBe(0);
    }
  });

  it("should return same value from value property as last update", () => {
    const rz = new RollingZScore({ period: 4 });
    let lastValue = rz.update(10);
    expect(rz.value).toEqual(lastValue);
    rz.update(20);
    rz.update(30);
    rz.update(40);
    lastValue = rz.update(50);
    expect(rz.value).toEqual(lastValue);
  });
});

describe("RollingZScoreEW", () => {
  it("should compute exponentially weighted z-score", () => {
    const data = [10, 20, 30, 40, 50];
    const alpha = 0.5;
    const expected = naiveVarianceEW(data, alpha);

    const rzew = new RollingZScoreEW({ alpha });
    const result = data.map((x) => rzew.update(x));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].mean).toBeCloseTo(expected[i].mean, 8);
      const expectedZ =
        expected[i].variance > 0
          ? (data[i] - expected[i].mean) / Math.sqrt(expected[i].variance)
          : 0;
      expect(result[i].zscore).toBeCloseTo(expectedZ, 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const rzew = new RollingZScoreEW({ period: 10 });
    rzew.update(10);
    rzew.update(20);
    rzew.update(30);
    const lastValue = rzew.update(40);
    expect(rzew.value).toEqual(lastValue);
  });
});

describe("RollingCov", () => {
  it("should compute rolling covariance with period 4 and ddof 1", () => {
    const dataX = [10, 20, 30, 40, 50, 60];
    const dataY = [15, 25, 35, 45, 55, 65];
    const period = 4;
    const ddof = 1;
    const expected = naiveCovariance(dataX, dataY, period, ddof);

    const rc = new RollingCov({ period, ddof });
    const result = dataX.map((x, i) => rc.update(x, dataY[i]));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].meanX).toBeCloseTo(expected[i].meanX, 8);
      expect(result[i].meanY).toBeCloseTo(expected[i].meanY, 8);
      expect(result[i].cov).toBeCloseTo(expected[i].cov, 8);
    }
  });

  it("should compute with period 2", () => {
    const dataX = [100, 200, 300, 400];
    const dataY = [50, 100, 150, 200];
    const period = 2;
    const ddof = 1;
    const expected = naiveCovariance(dataX, dataY, period, ddof);

    const rc = new RollingCov({ period, ddof });
    const result = dataX.map((x, i) => rc.update(x, dataY[i]));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].meanX).toBeCloseTo(expected[i].meanX, 8);
      expect(result[i].meanY).toBeCloseTo(expected[i].meanY, 8);
      expect(result[i].cov).toBeCloseTo(expected[i].cov, 8);
    }
  });

  it("should return same value from value property as last update", () => {
    const rc = new RollingCov({ period: 4 });
    let lastValue = rc.update(10, 15);
    expect(rc.value).toEqual(lastValue);
    rc.update(20, 25);
    rc.update(30, 35);
    rc.update(40, 45);
    lastValue = rc.update(50, 55);
    expect(rc.value).toEqual(lastValue);
  });
});

describe("RollingCorr", () => {
  it("should compute rolling correlation with period 4", () => {
    const dataX = [10, 20, 30, 40, 50, 60];
    const dataY = [15, 25, 35, 45, 55, 65];
    const period = 4;
    const ddof = 1;
    const expected = naiveCorrelation(dataX, dataY, period, ddof);

    const rc = new RollingCorr({ period, ddof });
    const result = dataX.map((x, i) => rc.update(x, dataY[i]));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].meanX).toBeCloseTo(expected[i].meanX, 7);
      expect(result[i].meanY).toBeCloseTo(expected[i].meanY, 7);
      expect(result[i].cov).toBeCloseTo(expected[i].cov, 7);
      expect(result[i].corr).toBeCloseTo(expected[i].corr, 7);
    }
  });

  it("should compute with negatively correlated data", () => {
    const dataX = [10, 20, 30, 40, 50];
    const dataY = [50, 40, 30, 20, 10];
    const period = 4;
    const ddof = 1;
    const expected = naiveCorrelation(dataX, dataY, period, ddof);

    const rc = new RollingCorr({ period, ddof });
    const result = dataX.map((x, i) => rc.update(x, dataY[i]));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].meanX).toBeCloseTo(expected[i].meanX, 7);
      expect(result[i].meanY).toBeCloseTo(expected[i].meanY, 7);
      expect(result[i].corr).toBeCloseTo(expected[i].corr, 7);
    }
  });

  it("should return same value from value property as last update", () => {
    const rc = new RollingCorr({ period: 4 });
    let lastValue = rc.update(10, 15);
    expect(rc.value).toEqual(lastValue);
    rc.update(20, 25);
    rc.update(30, 35);
    rc.update(40, 45);
    lastValue = rc.update(50, 55);
    expect(rc.value).toEqual(lastValue);
  });
});

describe("RollingBeta", () => {
  it("should compute rolling beta with period 4", () => {
    const dataX = [10, 20, 30, 40, 50, 60];
    const dataY = [15, 25, 35, 45, 55, 65];
    const period = 4;
    const ddof = 1;
    const expected = naiveBeta(dataX, dataY, period, ddof);

    const rb = new RollingBeta({ period, ddof });
    const result = dataX.map((x, i) => rb.update(x, dataY[i]));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].meanX).toBeCloseTo(expected[i].meanX, 7);
      expect(result[i].meanY).toBeCloseTo(expected[i].meanY, 7);
      expect(result[i].cov).toBeCloseTo(expected[i].cov, 7);
      expect(result[i].beta).toBeCloseTo(expected[i].beta, 7);
    }
  });

  it("should compute with period 2", () => {
    const dataX = [100, 200, 300, 400];
    const dataY = [50, 100, 150, 200];
    const period = 2;
    const ddof = 1;
    const expected = naiveBeta(dataX, dataY, period, ddof);

    const rb = new RollingBeta({ period, ddof });
    const result = dataX.map((x, i) => rb.update(x, dataY[i]));

    for (let i = 0; i < result.length; i++) {
      expect(result[i].meanX).toBeCloseTo(expected[i].meanX, 7);
      expect(result[i].meanY).toBeCloseTo(expected[i].meanY, 7);
      expect(result[i].beta).toBeCloseTo(expected[i].beta, 7);
    }
  });

  it("should return same value from value property as last update", () => {
    const rb = new RollingBeta({ period: 4 });
    let lastValue = rb.update(10, 15);
    expect(rb.value).toEqual(lastValue);
    rb.update(20, 25);
    rb.update(30, 35);
    rb.update(40, 45);
    lastValue = rb.update(50, 55);
    expect(rb.value).toEqual(lastValue);
  });
});

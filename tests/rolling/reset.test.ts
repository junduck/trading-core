import { describe, it, expect } from "vitest";

// Import all rolling operators
import { RollingSum, SMA, EMA, EWMA } from "../../src/rolling/average.js";

import {
  MeanAbsDeviation,
  MedianAbsDeviation,
  IQR,
} from "../../src/rolling/deviation.js";

import { RollingHistogram } from "../../src/rolling/histogram.js";

import {
  RollingMin,
  RollingMax,
  RollingMinMax,
  RollingArgMin,
  RollingArgMax,
  RollingArgMinMax,
} from "../../src/rolling/minmax.js";

import { RollingSkew, RollingKurt } from "../../src/rolling/moments.js";

import { RollingMedian, RollingQuantile } from "../../src/rolling/rank.js";

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
  RollingCovEW,
  RollingCorrEW,
  RollingBetaEW,
} from "../../src/rolling/stats.js";

describe("Rolling Operators Reset Functionality", () => {
  // Helper function to check if a value is "empty" or in initial state
  function isEmptyValue(value: any): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value === "number") return value === 0 || !isFinite(value);
    if (typeof value === "object") {
      for (const key in value) {
        if (!isEmptyValue(value[key])) return false;
      }
      return true;
    }
    return false;
  }

  // Test data
  const testData = [10, 20, 30, 40, 50, 60, 70, 80];
  const testData2 = [15, 25, 35, 45, 55, 65, 75, 85];

  describe("Simple Operators with Basic State", () => {
    it("should reset RollingSum correctly", () => {
      const period = 4;
      const rs = new RollingSum({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rs.update(x));
      expect(rs.value).toBeGreaterThan(0);

      // Reset and verify initial state
      rs.reset();
      expect(rs.value).toBe(0);
      expect(rs.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rs.update(100);
      expect(result1).toBe(100);
      expect(rs.value).toBe(100);
    });

    it("should reset SMA correctly", () => {
      const period = 4;
      const sma = new SMA({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => sma.update(x));
      expect(sma.value).toBeGreaterThan(0);

      // Reset and verify initial state
      sma.reset();
      expect(sma.value).toBe(0);
      expect(sma.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = sma.update(100);
      expect(result1).toBe(100);
      expect(sma.value).toBe(100);
    });

    it("should reset EMA correctly", () => {
      const period = 10;
      const ema = new EMA({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => ema.update(x));
      expect(ema.value).toBeGreaterThan(0);

      // Reset and verify initial state
      ema.reset();
      expect(ema.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = ema.update(100);
      expect(result1).toBe(100);
      expect(ema.value).toBe(100);
    });

    it("should reset EWMA correctly", () => {
      const period = 4;
      const ewma = new EWMA({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => ewma.update(x));
      expect(ewma.value).toBeGreaterThan(0);

      // Reset and verify initial state
      ewma.reset();
      expect(isNaN(ewma.value)).toBe(true); // EWMA returns 0/0 = NaN when empty
      expect(ewma.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = ewma.update(100);
      expect(result1).toBe(100);
      expect(ewma.value).toBe(100);
    });

    it("should reset RollingMin correctly", () => {
      const period = 4;
      const rmin = new RollingMin({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rmin.update(x));
      expect(rmin.value).toBeLessThan(Infinity);

      // Reset and verify initial state
      rmin.reset();
      expect(rmin.value).toBe(Infinity);
      expect(rmin.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rmin.update(100);
      expect(result1).toBe(100);
      expect(rmin.value).toBe(100);
    });

    it("should reset RollingMax correctly", () => {
      const period = 4;
      const rmax = new RollingMax({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rmax.update(x));
      expect(rmax.value).toBeGreaterThan(-Infinity);

      // Reset and verify initial state
      rmax.reset();
      expect(rmax.value).toBe(-Infinity);
      expect(rmax.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rmax.update(100);
      expect(result1).toBe(100);
      expect(rmax.value).toBe(100);
    });

    it("should reset RollingMedian correctly", () => {
      const period = 4;
      const rmedian = new RollingMedian({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rmedian.update(x));
      expect(rmedian.value).toBeDefined();

      // Reset and verify initial state
      rmedian.reset();
      expect(rmedian.value).toBeUndefined();
      expect(rmedian.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      // Need to fill the buffer before getting a value
      for (let i = 0; i < period - 1; i++) {
        rmedian.update(i * 10);
      }
      const result1 = rmedian.update(100);
      expect(result1).toBeDefined();
      expect(rmedian.value).toBeDefined();
    });

    it("should reset RollingHistogram correctly", () => {
      const period = 4;
      const edges = [0, 25, 50, 75];
      const hist = new RollingHistogram({ period, edges });

      // Feed data to get into non-initial state
      testData.forEach((x) => hist.update(x));
      const countsBefore = hist.getCounts();
      expect(countsBefore.some((c) => c > 0)).toBe(true);

      // Reset and verify initial state
      hist.reset();
      const countsAfter = hist.getCounts();
      expect(countsAfter.every((c) => c === 0)).toBe(true);
      expect(hist.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = hist.update(30);
      const newCounts = hist.getCounts();
      expect(newCounts.some((c) => c > 0)).toBe(true);
    });
  });

  describe("Composed Operators that Use Other Rolling Operators", () => {
    it("should reset MeanAbsDeviation correctly", () => {
      const period = 4;
      const mad = new MeanAbsDeviation({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => mad.update(x));
      expect(mad.value.mean).toBeGreaterThan(0);
      expect(mad.value.mad).toBeGreaterThan(0);

      // Reset and verify initial state
      mad.reset();
      expect(mad.value.mean).toBe(0);
      expect(mad.value.mad).toBe(0);
      expect(mad.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = mad.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.mad).toBe(0); // Single value has no deviation
    });

    it("should reset RollingStddev correctly", () => {
      const period = 4;
      const rstddev = new RollingStddev({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rstddev.update(x));
      expect(rstddev.value.mean).toBeGreaterThan(0);
      expect(rstddev.value.stddev).toBeGreaterThan(0);

      // Reset and verify initial state
      rstddev.reset();
      expect(rstddev.value.mean).toBe(0);
      expect(rstddev.value.stddev).toBe(0);
      expect(rstddev.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rstddev.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.stddev).toBe(0); // Single value has no deviation
    });

    it("should reset RollingZScore correctly", () => {
      const period = 4;
      const rzscore = new RollingZScore({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rzscore.update(x));
      expect(rzscore.value.mean).toBeGreaterThan(0);
      expect(rzscore.value.zscore).toBeDefined();

      // Reset and verify initial state
      rzscore.reset();
      expect(rzscore.value.mean).toBe(0);
      expect(rzscore.value.stddev).toBe(0);
      expect(rzscore.value.zscore).toBe(0);
      expect(rzscore.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rzscore.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.zscore).toBe(0); // Single value has z-score of 0
    });
  });

  describe("Operators with Different Types of Internal State", () => {
    it("should reset RollingVar correctly", () => {
      const period = 4;
      const rvar = new RollingVar({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rvar.update(x));
      expect(rvar.value.mean).toBeGreaterThan(0);
      expect(rvar.value.variance).toBeGreaterThan(0);

      // Reset and verify initial state
      rvar.reset();
      expect(rvar.value.mean).toBe(0);
      expect(rvar.value.variance).toBe(0);
      expect(rvar.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rvar.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.variance).toBe(0); // Single value has no variance
    });

    it("should reset RollingVarEW correctly", () => {
      const period = 10;
      const rvarew = new RollingVarEW({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rvarew.update(x));
      expect(rvarew.value.mean).toBeGreaterThan(0);

      // Reset and verify initial state
      rvarew.reset();
      expect(rvarew.value.mean).toBe(0);
      expect(rvarew.value.variance).toBe(0);

      // Verify it works correctly after reset
      const result1 = rvarew.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.variance).toBe(0); // Single value has no variance
    });

    it("should reset RollingSkew correctly", () => {
      const period = 4;
      const rskew = new RollingSkew({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rskew.update(x));
      expect(rskew.value.mean).toBeGreaterThan(0);
      expect(rskew.value.skew).toBeDefined();

      // Reset and verify initial state
      rskew.reset();
      expect(rskew.value.mean).toBe(0);
      expect(rskew.value.variance).toBe(0);
      expect(rskew.value.skew).toBe(0);

      // Verify it works correctly after reset
      const result1 = rskew.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.skew).toBe(0); // Single value has no skew
    });

    it("should reset RollingKurt correctly", () => {
      const period = 4;
      const rkurt = new RollingKurt({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rkurt.update(x));
      expect(rkurt.value.mean).toBeGreaterThan(0);
      expect(rkurt.value.kurt).toBeDefined();

      // Reset and verify initial state
      rkurt.reset();
      expect(rkurt.value.mean).toBe(0);
      expect(rkurt.value.variance).toBe(0);
      expect(rkurt.value.skew).toBe(0);
      expect(rkurt.value.kurt).toBe(0);

      // Verify it works correctly after reset
      const result1 = rkurt.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.kurt).toBe(0); // Single value has no kurtosis
    });

    it("should reset RollingQuantile correctly", () => {
      const period = 4;
      const quantiles = [0.25, 0.5, 0.75];
      const rquantile = new RollingQuantile({ period, quantiles });

      // Feed data to get into non-initial state
      testData.forEach((x) => rquantile.update(x));
      expect(rquantile.value).toBeDefined();

      // Reset and verify initial state
      rquantile.reset();
      expect(rquantile.value).toBeUndefined();
      expect(rquantile.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      // Need to fill the buffer before getting a value
      for (let i = 0; i < period - 1; i++) {
        rquantile.update(i * 10);
      }
      const result1 = rquantile.update(100);
      expect(result1).toBeDefined();
      expect(result1).toHaveLength(quantiles.length);
    });
  });

  describe("Operators with Position Tracking", () => {
    it("should reset RollingArgMin correctly", () => {
      const period = 4;
      const rargmin = new RollingArgMin({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rargmin.update(x));
      expect(rargmin.value.val).toBeLessThan(Infinity);
      expect(rargmin.value.pos).toBeGreaterThanOrEqual(0);

      // Reset and verify initial state
      rargmin.reset();
      expect(rargmin.value.val).toBe(Infinity);
      expect(rargmin.value.pos).toBe(0);
      expect(rargmin.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rargmin.update(100);
      expect(result1.val).toBe(100);
      expect(result1.pos).toBe(0); // First element is at position 0
    });

    it("should reset RollingArgMax correctly", () => {
      const period = 4;
      const rargmax = new RollingArgMax({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rargmax.update(x));
      expect(rargmax.value.val).toBeGreaterThan(-Infinity);
      expect(rargmax.value.pos).toBeGreaterThanOrEqual(0);

      // Reset and verify initial state
      rargmax.reset();
      expect(rargmax.value.val).toBe(-Infinity);
      expect(rargmax.value.pos).toBe(0);
      expect(rargmax.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rargmax.update(100);
      expect(result1.val).toBe(100);
      expect(result1.pos).toBe(0); // First element is at position 0
    });

    it("should reset RollingArgMinMax correctly", () => {
      const period = 4;
      const rargminmax = new RollingArgMinMax({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rargminmax.update(x));
      expect(rargminmax.value.min.val).toBeLessThan(Infinity);
      expect(rargminmax.value.max.val).toBeGreaterThan(-Infinity);

      // Reset and verify initial state
      rargminmax.reset();
      expect(rargminmax.value.min.val).toBe(Infinity);
      expect(rargminmax.value.max.val).toBe(-Infinity);
      expect(rargminmax.value.min.pos).toBe(0);
      expect(rargminmax.value.max.pos).toBe(0);
      expect(rargminmax.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rargminmax.update(100);
      expect(result1.min.val).toBe(100);
      expect(result1.max.val).toBe(100);
      expect(result1.min.pos).toBe(0);
      expect(result1.max.pos).toBe(0);
    });
  });

  describe("Operators with Multiple Series", () => {
    it("should reset RollingCov correctly", () => {
      const period = 4;
      const rcov = new RollingCov({ period });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => rcov.update(x, testData2[i]));
      expect(rcov.value.meanX).toBeGreaterThan(0);
      expect(rcov.value.meanY).toBeGreaterThan(0);
      expect(rcov.value.cov).toBeDefined();

      // Reset and verify initial state
      rcov.reset();
      expect(rcov.value.meanX).toBe(0);
      expect(rcov.value.meanY).toBe(0);
      expect(rcov.value.cov).toBe(0);
      expect(rcov.bufferX.size()).toBe(0);
      expect(rcov.bufferY.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rcov.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.cov).toBe(0); // Single value has no covariance
    });

    it("should reset RollingCorr correctly", () => {
      const period = 4;
      const rcorr = new RollingCorr({ period });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => rcorr.update(x, testData2[i]));
      expect(rcorr.value.meanX).toBeGreaterThan(0);
      expect(rcorr.value.meanY).toBeGreaterThan(0);
      expect(rcorr.value.corr).toBeDefined();

      // Reset and verify initial state
      rcorr.reset();
      expect(rcorr.value.meanX).toBe(0);
      expect(rcorr.value.meanY).toBe(0);
      expect(rcorr.value.cov).toBe(0);
      expect(rcorr.value.corr).toBe(0);
      expect(rcorr.bufferX.size()).toBe(0);
      expect(rcorr.bufferY.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rcorr.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.corr).toBe(0); // Single value has no correlation
    });

    it("should reset RollingBeta correctly", () => {
      const period = 4;
      const rbeta = new RollingBeta({ period });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => rbeta.update(x, testData2[i]));
      expect(rbeta.value.meanX).toBeGreaterThan(0);
      expect(rbeta.value.meanY).toBeGreaterThan(0);
      expect(rbeta.value.beta).toBeDefined();

      // Reset and verify initial state
      rbeta.reset();
      expect(rbeta.value.meanX).toBe(0);
      expect(rbeta.value.meanY).toBe(0);
      expect(rbeta.value.cov).toBe(0);
      expect(rbeta.value.beta).toBe(0);
      expect(rbeta.bufferX.size()).toBe(0);
      expect(rbeta.bufferY.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rbeta.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.beta).toBe(0); // Single value has no beta
    });
  });

  describe("Exponentially Weighted Operators with Multiple Series", () => {
    it("should reset RollingCovEW correctly", () => {
      const period = 10;
      const rcovew = new RollingCovEW({ period });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => rcovew.update(x, testData2[i]));
      expect(rcovew.value.meanX).toBeGreaterThan(0);
      expect(rcovew.value.meanY).toBeGreaterThan(0);

      // Reset and verify initial state
      rcovew.reset();
      expect(rcovew.value.meanX).toBe(0);
      expect(rcovew.value.meanY).toBe(0);
      expect(rcovew.value.cov).toBe(0);

      // Verify it works correctly after reset
      const result1 = rcovew.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.cov).toBe(0); // Single value has no covariance
    });

    it("should reset RollingCorrEW correctly", () => {
      const period = 10;
      const rcorrew = new RollingCorrEW({ period });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => rcorrew.update(x, testData2[i]));
      expect(rcorrew.value.meanX).toBeGreaterThan(0);
      expect(rcorrew.value.meanY).toBeGreaterThan(0);

      // Reset and verify initial state
      rcorrew.reset();
      expect(rcorrew.value.meanX).toBe(0);
      expect(rcorrew.value.meanY).toBe(0);
      expect(rcorrew.value.cov).toBe(0);
      expect(rcorrew.value.corr).toBe(0);

      // Verify it works correctly after reset
      const result1 = rcorrew.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.corr).toBe(0); // Single value has no correlation
    });

    it("should reset RollingBetaEW correctly", () => {
      const period = 10;
      const rbetaew = new RollingBetaEW({ period });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => rbetaew.update(x, testData2[i]));
      expect(rbetaew.value.meanX).toBeGreaterThan(0);
      expect(rbetaew.value.meanY).toBeGreaterThan(0);

      // Reset and verify initial state
      rbetaew.reset();
      expect(rbetaew.value.meanX).toBe(0);
      expect(rbetaew.value.meanY).toBe(0);
      expect(rbetaew.value.cov).toBe(0);
      expect(rbetaew.value.beta).toBe(0);

      // Verify it works correctly after reset
      const result1 = rbetaew.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.beta).toBe(0); // Single value has no beta
    });
  });

  describe("Complex Operators with Special Internal State", () => {
    it("should reset MedianAbsDeviation correctly", () => {
      const period = 4;
      const mad = new MedianAbsDeviation({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => mad.update(x));
      expect(mad.value).toBeDefined();
      expect(mad.value!.median).toBeGreaterThan(0);
      expect(mad.value!.mad).toBeGreaterThanOrEqual(0);

      // Reset and verify initial state
      mad.reset();
      expect(mad.value).toBeUndefined();
      expect(mad.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      // Need to fill the buffer before getting a value
      for (let i = 0; i < period - 1; i++) {
        mad.update(i * 10);
      }
      const result1 = mad.update(100);
      expect(result1).toBeDefined();
      expect(result1!.median).toBeDefined();
      expect(result1!.mad).toBeDefined();
    });

    it("should reset IQR correctly", () => {
      const period = 4;
      const iqr = new IQR({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => iqr.update(x));
      expect(iqr.value).toBeDefined();
      expect(iqr.value!.q1).toBeGreaterThanOrEqual(0);
      expect(iqr.value!.q3).toBeGreaterThanOrEqual(0);
      expect(iqr.value!.iqr).toBeGreaterThanOrEqual(0);

      // Reset and verify initial state
      iqr.reset();
      expect(iqr.value).toBeUndefined();
      expect(iqr.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      // Need to fill the buffer before getting a value
      for (let i = 0; i < period - 1; i++) {
        iqr.update(i * 10);
      }
      const result1 = iqr.update(100);
      expect(result1).toBeDefined();
      expect(result1!.q1).toBeDefined();
      expect(result1!.q3).toBeDefined();
      expect(result1!.iqr).toBeDefined();
    });

    it("should reset RollingMinMax correctly", () => {
      const period = 4;
      const rminmax = new RollingMinMax({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rminmax.update(x));
      expect(rminmax.value.min).toBeLessThan(Infinity);
      expect(rminmax.value.max).toBeGreaterThan(-Infinity);

      // Reset and verify initial state
      rminmax.reset();
      expect(rminmax.value.min).toBe(Infinity);
      expect(rminmax.value.max).toBe(-Infinity);
      expect(rminmax.buffer.size()).toBe(0);

      // Verify it works correctly after reset
      const result1 = rminmax.update(100);
      expect(result1.min).toBe(100);
      expect(result1.max).toBe(100);
    });

    it("should reset RollingStddevEW correctly", () => {
      const period = 10;
      const rstddevew = new RollingStddevEW({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rstddevew.update(x));
      expect(rstddevew.value.mean).toBeGreaterThan(0);

      // Reset and verify initial state
      rstddevew.reset();
      expect(rstddevew.value.mean).toBe(0);
      expect(rstddevew.value.stddev).toBe(0);

      // Verify it works correctly after reset
      const result1 = rstddevew.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.stddev).toBe(0); // Single value has no deviation
    });

    it("should reset RollingZScoreEW correctly", () => {
      const period = 10;
      const rzscoreew = new RollingZScoreEW({ period });

      // Feed data to get into non-initial state
      testData.forEach((x) => rzscoreew.update(x));
      expect(rzscoreew.value.mean).toBeGreaterThan(0);

      // Reset and verify initial state
      rzscoreew.reset();
      expect(rzscoreew.value.mean).toBe(0);
      expect(rzscoreew.value.stddev).toBe(0);
      expect(rzscoreew.value.zscore).toBe(0);

      // Verify it works correctly after reset
      const result1 = rzscoreew.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.zscore).toBe(0); // Single value has z-score of 0
    });
  });

  describe("Edge Cases and Special Scenarios", () => {
    it("should handle multiple reset calls correctly", () => {
      const period = 4;
      const sma = new SMA({ period });

      // Feed data
      testData.forEach((x) => sma.update(x));
      expect(sma.value).toBeGreaterThan(0);

      // Reset multiple times
      sma.reset();
      sma.reset();
      sma.reset();

      // Should still be in initial state
      expect(sma.value).toBe(0);
      expect(sma.buffer.size()).toBe(0);

      // Should work correctly after multiple resets
      const result1 = sma.update(100);
      expect(result1).toBe(100);
    });

    it("should handle reset when buffer is not full", () => {
      const period = 10;
      const sma = new SMA({ period });

      // Feed some data but not enough to fill buffer
      for (let i = 0; i < 5; i++) {
        sma.update(i * 10);
      }
      expect(sma.value).toBeGreaterThan(0);
      expect(sma.buffer.size()).toBe(5);

      // Reset and verify initial state
      sma.reset();
      expect(sma.value).toBe(0);
      expect(sma.buffer.size()).toBe(0);

      // Should work correctly after reset
      const result1 = sma.update(100);
      expect(result1).toBe(100);
    });

    it("should handle reset with different constructor parameter types", () => {
      // Test with period parameter
      const ema1 = new EMA({ period: 10 });
      ema1.update(10);
      ema1.update(20);
      expect(ema1.value).toBeGreaterThan(0);
      ema1.reset();
      expect(ema1.value).toBe(0);

      // Test with alpha parameter
      const ema2 = new EMA({ alpha: 0.5 });
      ema2.update(10);
      ema2.update(20);
      expect(ema2.value).toBeGreaterThan(0);
      ema2.reset();
      expect(ema2.value).toBe(0);
    });

    it("should handle reset with ddof parameter", () => {
      const period = 4;
      const rvar1 = new RollingVar({ period, ddof: 0 });
      const rvar2 = new RollingVar({ period, ddof: 1 });

      // Feed data
      testData.forEach((x) => {
        rvar1.update(x);
        rvar2.update(x);
      });

      expect(rvar1.value.variance).toBeGreaterThan(0);
      expect(rvar2.value.variance).toBeGreaterThan(0);

      // Reset and verify initial state
      rvar1.reset();
      rvar2.reset();

      expect(rvar1.value.mean).toBe(0);
      expect(rvar1.value.variance).toBe(0);
      expect(rvar2.value.mean).toBe(0);
      expect(rvar2.value.variance).toBe(0);
    });
  });
});

import { describe, it, expect } from "vitest";

// Import all online operators
import { CMA } from "../../src/online/average.js";
import { CuHistogram } from "../../src/online/histogram.js";
import { CuSkew, CuKurt } from "../../src/online/moments.js";
import {
  RunningDrawdown,
  RunningDrawup,
  RunningRelDrawdown,
  RunningRelDrawup,
  RunningLongestDrawdown,
  RunningLongestDrawup,
} from "../../src/online/perf-drawdown.js";
import {
  RunningDownStats,
  RunningSharpe,
  RunningSortino,
  RunningWinRate,
  RunningGainLoss,
  RunningExpectancy,
  RunningProfitFactor,
} from "../../src/online/perf-metrics.js";
import { CountMinSketch, BloomFilter } from "../../src/online/probs.js";
import {
  CuVar,
  CuStddev,
  CuCov,
  CuCorr,
  CuBeta,
} from "../../src/online/stats.js";

describe("Online Operators Reset Functionality", () => {
  // Test data
  const testData = [10, 20, 30, 40, 50, 60, 70, 80];
  const testData2 = [15, 25, 35, 45, 55, 65, 75, 85];
  const testDates = testData.map((_, i) => new Date(2023, 0, i + 1));

  describe("Simple Accumulator-based Operators", () => {
    it("should reset CMA correctly", () => {
      const cma = new CMA();

      // Feed data to get into non-initial state
      testData.forEach((x) => cma.update(x));
      expect(cma.value).toBeGreaterThan(0);

      // Reset and verify initial state
      cma.reset();
      expect(cma.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = cma.update(100);
      expect(result1).toBe(100);
      expect(cma.value).toBe(100);
    });
  });

  describe("Array-based Operators with Internal Arrays", () => {
    it("should reset CuHistogram correctly", () => {
      const edges = [0, 25, 50, 75];
      const hist = new CuHistogram({ edges });

      // Feed data to get into non-initial state
      testData.forEach((x) => hist.update(x));
      const countsBefore = hist.getCounts();
      expect(countsBefore.some((c) => c > 0)).toBe(true);
      expect(hist.getTotal()).toBe(testData.length);

      // Reset and verify initial state
      hist.reset();
      const countsAfter = hist.getCounts();
      expect(countsAfter.every((c) => c === 0)).toBe(true);
      expect(hist.getTotal()).toBe(0);

      // Verify configuration is preserved
      expect(hist.getEdges()).toEqual(edges);

      // Verify it works correctly after reset
      const result1 = hist.update(30);
      const newCounts = hist.getCounts();
      expect(newCounts.some((c) => c > 0)).toBe(true);
      expect(hist.getTotal()).toBe(1);
    });
  });

  describe("Composite Operators that Use Other Online Operators", () => {
    it("should reset CuSkew correctly", () => {
      const cskew = new CuSkew();

      // Feed data to get into non-initial state
      testData.forEach((x) => cskew.update(x));
      expect(cskew.value.mean).toBeGreaterThan(0);
      expect(cskew.value.variance).toBeGreaterThan(0);
      expect(cskew.value.skew).toBeDefined();

      // Reset and verify initial state
      cskew.reset();
      expect(cskew.value.mean).toBe(0);
      expect(cskew.value.variance).toBe(0);
      expect(cskew.value.skew).toBe(0);

      // Verify it works correctly after reset
      const result1 = cskew.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.variance).toBe(0); // Single value has no variance
      expect(result1.skew).toBe(0); // Single value has no skew
    });

    it("should reset CuKurt correctly", () => {
      const ckurt = new CuKurt();

      // Feed data to get into non-initial state
      testData.forEach((x) => ckurt.update(x));
      expect(ckurt.value.mean).toBeGreaterThan(0);
      expect(ckurt.value.variance).toBeGreaterThan(0);
      expect(ckurt.value.skew).toBeDefined();
      expect(ckurt.value.kurt).toBeDefined();

      // Reset and verify initial state
      ckurt.reset();
      expect(ckurt.value.mean).toBe(0);
      expect(ckurt.value.variance).toBe(0);
      expect(ckurt.value.skew).toBe(0);
      expect(ckurt.value.kurt).toBe(0);

      // Verify it works correctly after reset
      const result1 = ckurt.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.variance).toBe(0); // Single value has no variance
      expect(result1.skew).toBe(0); // Single value has no skew
      expect(result1.kurt).toBe(0); // Single value has no kurtosis
    });
  });

  describe("Performance Metrics Operators", () => {
    it("should reset RunningDownStats correctly", () => {
      const threshold = 0.05;
      const rds = new RunningDownStats({ threshold });

      // Feed data to get into non-initial state
      const returns = [-0.1, 0.05, -0.05, 0.1, -0.02];
      returns.forEach((ret) => rds.update(ret));
      expect(rds.value.mean).toBeLessThan(0);

      // Reset and verify initial state
      rds.reset();
      expect(rds.value.mean).toBe(0);
      expect(rds.value.stddev).toBe(0);

      // Verify configuration is preserved
      rds.setThreshold(0.1);
      rds.update(-0.05);
      expect(rds.value.mean).toBeLessThan(0);

      // Verify it works correctly after reset
      rds.reset();
      const result1 = rds.update(-0.1);
      expect(result1.mean).toBe(-0.2); // -0.1 - 0.1 (threshold)
      expect(result1.stddev).toBe(0); // Single value has no stddev
    });

    it("should reset RunningSharpe correctly", () => {
      const riskfree = 0.02;
      const rs = new RunningSharpe({ riskfree });

      // Feed data to get into non-initial state
      const returns = [0.1, 0.05, -0.05, 0.1, 0.02];
      returns.forEach((ret) => rs.update(ret));
      expect(rs.value).toBeDefined();

      // Reset and verify initial state
      rs.reset();
      expect(rs.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = rs.update(0.1);
      expect(result1).toBe(0); // Single value has no stddev, so Sharpe is 0
    });

    it("should reset RunningSortino correctly", () => {
      const riskfree = 0.02;
      const rsort = new RunningSortino({ riskfree });

      // Feed data to get into non-initial state
      const returns = [0.1, 0.05, -0.05, 0.1, 0.02];
      returns.forEach((ret) => rsort.update(ret));
      expect(rsort.value).toBeDefined();

      // Reset and verify initial state
      rsort.reset();
      expect(rsort.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = rsort.update(0.1);
      expect(result1).toBe(0); // Single value has no downside stddev, so Sortino is 0
    });

    it("should reset RunningWinRate correctly", () => {
      const threshold = 0;
      const rwr = new RunningWinRate({ threshold });

      // Feed data to get into non-initial state
      const returns = [0.1, 0.05, -0.05, 0.1, -0.02];
      returns.forEach((ret) => rwr.update(ret));
      expect(rwr.value).toBeGreaterThan(0);
      expect(rwr.value).toBeLessThan(1);

      // Reset and verify initial state
      rwr.reset();
      expect(rwr.value).toBe(0);

      // Verify configuration is preserved
      rwr.update(0.1);
      expect(rwr.value).toBe(1);

      // Verify it works correctly after reset
      rwr.reset();
      const result1 = rwr.update(-0.1);
      expect(result1).toBe(0); // Loss with threshold 0
    });

    it("should reset RunningGainLoss correctly", () => {
      const threshold = 0;
      const rgl = new RunningGainLoss({ threshold });

      // Feed data to get into non-initial state
      const returns = [0.1, 0.05, -0.05, 0.1, -0.02];
      returns.forEach((ret) => rgl.update(ret));
      expect(rgl.value).toBeGreaterThan(0);

      // Reset and verify initial state
      rgl.reset();
      expect(rgl.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = rgl.update(0.1);
      expect(result1).toBe(0); // No losses yet, so ratio is 0
    });

    it("should reset RunningExpectancy correctly", () => {
      const threshold = 0;
      const rexp = new RunningExpectancy({ threshold });

      // Feed data to get into non-initial state
      const returns = [0.1, 0.05, -0.05, 0.1, -0.02];
      returns.forEach((ret) => rexp.update(ret));
      expect(rexp.value).toBeDefined();

      // Reset and verify initial state
      rexp.reset();
      expect(rexp.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = rexp.update(0.1);
      expect(result1).toBe(0.1); // Single gain
    });

    it("should reset RunningProfitFactor correctly", () => {
      const threshold = 0;
      const rpf = new RunningProfitFactor({ threshold });

      // Feed data to get into non-initial state
      const returns = [0.1, 0.05, -0.05, 0.1, -0.02];
      returns.forEach((ret) => rpf.update(ret));
      expect(rpf.value).toBeGreaterThan(0);

      // Reset and verify initial state
      rpf.reset();
      expect(rpf.value).toBe(0);

      // Verify it works correctly after reset
      const result1 = rpf.update(0.1);
      expect(result1).toBe(0); // No losses yet, so factor is 0
    });
  });

  describe("Probability-based Operators", () => {
    it("should reset CountMinSketch correctly", () => {
      const cms = new CountMinSketch({ width: 100, depth: 5 });

      // Feed data to get into non-initial state
      const keys = ["a", "b", "c", "a", "b"];
      keys.forEach((key) => cms.update(key));
      expect(cms.query("a")).toBeGreaterThan(0);
      expect(cms.query("b")).toBeGreaterThan(0);
      expect(cms.query("c")).toBe(1);

      // Reset and verify initial state
      cms.reset();
      expect(cms.query("a")).toBe(0);
      expect(cms.query("b")).toBe(0);
      expect(cms.query("c")).toBe(0);

      // Verify configuration is preserved
      cms.update("test");
      expect(cms.query("test")).toBe(1);
    });

    it("should reset BloomFilter correctly", () => {
      const bf = new BloomFilter({ size: 1000, numHashes: 3 });

      // Feed data to get into non-initial state
      const keys = ["a", "b", "c"];
      keys.forEach((key) => bf.add(key));
      expect(bf.has("a")).toBe(true);
      expect(bf.has("b")).toBe(true);
      expect(bf.has("c")).toBe(true);
      expect(bf.has("d")).toBe(false);

      // Reset and verify initial state
      bf.reset();
      expect(bf.has("a")).toBe(false);
      expect(bf.has("b")).toBe(false);
      expect(bf.has("c")).toBe(false);
      expect(bf.has("d")).toBe(false);

      // Verify configuration is preserved
      bf.add("test");
      expect(bf.has("test")).toBe(true);
    });
  });

  describe("Statistical Operators", () => {
    it("should reset CuVar correctly", () => {
      const ddof = 1;
      const cvar = new CuVar({ ddof });

      // Feed data to get into non-initial state
      testData.forEach((x) => cvar.update(x));
      expect(cvar.value.mean).toBeGreaterThan(0);
      expect(cvar.value.variance).toBeGreaterThan(0);

      // Reset and verify initial state
      cvar.reset();
      expect(cvar.value.mean).toBe(0);
      expect(cvar.value.variance).toBe(0);

      // Verify configuration is preserved
      expect(cvar.value.variance).toBe(0); // ddof is preserved but not directly accessible

      // Verify it works correctly after reset
      const result1 = cvar.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.variance).toBe(0); // Single value has no variance
    });

    it("should reset CuStddev correctly", () => {
      const ddof = 1;
      const cstddev = new CuStddev({ ddof });

      // Feed data to get into non-initial state
      testData.forEach((x) => cstddev.update(x));
      expect(cstddev.value.mean).toBeGreaterThan(0);
      expect(cstddev.value.stddev).toBeGreaterThan(0);

      // Reset and verify initial state
      cstddev.reset();
      expect(cstddev.value.mean).toBe(0);
      expect(cstddev.value.stddev).toBe(0);

      // Verify it works correctly after reset
      const result1 = cstddev.update(100);
      expect(result1.mean).toBe(100);
      expect(result1.stddev).toBe(0); // Single value has no stddev
    });

    it("should reset CuCov correctly", () => {
      const ddof = 1;
      const ccov = new CuCov({ ddof });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => ccov.update(x, testData2[i]));
      expect(ccov.value.meanX).toBeGreaterThan(0);
      expect(ccov.value.meanY).toBeGreaterThan(0);
      expect(ccov.value.cov).toBeDefined();

      // Reset and verify initial state
      ccov.reset();
      expect(ccov.value.meanX).toBe(0);
      expect(ccov.value.meanY).toBe(0);
      expect(ccov.value.cov).toBe(0);

      // Verify it works correctly after reset
      const result1 = ccov.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.cov).toBe(0); // Single value has no covariance
    });

    it("should reset CuCorr correctly", () => {
      const ddof = 1;
      const ccorr = new CuCorr({ ddof });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => ccorr.update(x, testData2[i]));
      expect(ccorr.value.meanX).toBeGreaterThan(0);
      expect(ccorr.value.meanY).toBeGreaterThan(0);
      expect(ccorr.value.cov).toBeDefined();
      expect(ccorr.value.corr).toBeDefined();

      // Reset and verify initial state
      ccorr.reset();
      expect(ccorr.value.meanX).toBe(0);
      expect(ccorr.value.meanY).toBe(0);
      expect(ccorr.value.cov).toBe(0);
      expect(ccorr.value.corr).toBe(0);

      // Verify it works correctly after reset
      const result1 = ccorr.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.cov).toBe(0); // Single value has no covariance
      expect(result1.corr).toBe(0); // Single value has no correlation
    });

    it("should reset CuBeta correctly", () => {
      const ddof = 1;
      const cbeta = new CuBeta({ ddof });

      // Feed data to get into non-initial state
      testData.forEach((x, i) => cbeta.update(x, testData2[i]));
      expect(cbeta.value.meanX).toBeGreaterThan(0);
      expect(cbeta.value.meanY).toBeGreaterThan(0);
      expect(cbeta.value.cov).toBeDefined();
      expect(cbeta.value.beta).toBeDefined();

      // Reset and verify initial state
      cbeta.reset();
      expect(cbeta.value.meanX).toBe(0);
      expect(cbeta.value.meanY).toBe(0);
      expect(cbeta.value.cov).toBe(0);
      expect(cbeta.value.beta).toBe(0);

      // Verify it works correctly after reset
      const result1 = cbeta.update(100, 110);
      expect(result1.meanX).toBe(100);
      expect(result1.meanY).toBe(110);
      expect(result1.cov).toBe(0); // Single value has no covariance
      expect(result1.beta).toBe(0); // Single value has no beta
    });
  });

  describe("Edge Cases and Special Scenarios", () => {
    it("should handle multiple reset calls correctly", () => {
      const cma = new CMA();

      // Feed data
      testData.forEach((x) => cma.update(x));
      expect(cma.value).toBeGreaterThan(0);

      // Reset multiple times
      cma.reset();
      cma.reset();
      cma.reset();

      // Should still be in initial state
      expect(cma.value).toBe(0);

      // Should work correctly after multiple resets
      const result1 = cma.update(100);
      expect(result1).toBe(100);
    });

    it("should handle reset with different constructor parameter types", () => {
      // Test with ddof parameter
      const cvar1 = new CuVar({ ddof: 0 });
      const cvar2 = new CuVar({ ddof: 1 });

      // Feed data
      testData.forEach((x) => {
        cvar1.update(x);
        cvar2.update(x);
      });

      expect(cvar1.value.variance).toBeGreaterThan(0);
      expect(cvar2.value.variance).toBeGreaterThan(0);

      // Reset and verify initial state
      cvar1.reset();
      cvar2.reset();

      expect(cvar1.value.mean).toBe(0);
      expect(cvar1.value.variance).toBe(0);
      expect(cvar2.value.mean).toBe(0);
      expect(cvar2.value.variance).toBe(0);
    });

    it("should handle reset with epsilon/delta parameters", () => {
      // Test with epsilon/delta parameters
      const cms = new CountMinSketch({ epsilon: 0.1, delta: 0.01 });

      // Feed data
      for (let i = 0; i < 100; i++) {
        cms.update(`key${i}`);
      }

      expect(cms.query("key0")).toBeGreaterThan(0);

      // Reset and verify initial state
      cms.reset();
      expect(cms.query("key0")).toBe(0);

      // Should work correctly after reset
      cms.update("newkey");
      expect(cms.query("newkey")).toBe(1);
    });

    it("should handle reset with expectedItems/falsePositiveRate parameters", () => {
      // Test with expectedItems/falsePositiveRate parameters
      const bf = new BloomFilter({
        expectedItems: 1000,
        falsePositiveRate: 0.01,
      });

      // Feed data
      for (let i = 0; i < 100; i++) {
        bf.add(`key${i}`);
      }

      expect(bf.has("key0")).toBe(true);

      // Reset and verify initial state
      bf.reset();
      expect(bf.has("key0")).toBe(false);

      // Should work correctly after reset
      bf.add("newkey");
      expect(bf.has("newkey")).toBe(true);
    });
  });
});

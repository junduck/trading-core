import { describe, it, expect } from "vitest";
import {
  sharpe,
  sortino,
  calmar,
  winRate,
  gainLoss,
  expectancy,
  profitFactor,
} from "../../src/numeric/metrics.js";
import {
  RunningSharpe,
  RunningSortino,
  RunningWinRate,
  RunningGainLoss,
  RunningExpectancy,
  RunningProfitFactor,
} from "../../src/online/perf-metrics.js";

describe("metrics match online", () => {
  const testReturns = [0.01, -0.02, 0.03, 0.005, -0.015];
  const periodsPerYear = 252;

  it("sharpe matches RunningSharpe", () => {
    const batch = sharpe(testReturns);
    const online = new RunningSharpe();
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("sharpe matches RunningSharpe with riskfree", () => {
    const riskfree = 0.001;
    const batch = sharpe(testReturns, riskfree);
    const online = new RunningSharpe({ riskfree });
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("sharpe handles empty array", () => {
    const batch = sharpe([]);
    const online = new RunningSharpe();
    expect(online.value).toBe(batch);
  });

  it("sharpe handles constant returns", () => {
    const constantReturns = [0.01, 0.01, 0.01];
    const batch = sharpe(constantReturns);
    const online = new RunningSharpe();
    for (const r of constantReturns) online.update(r);
    expect(online.value).toBe(batch);
  });

  it("sortino matches RunningSortino", () => {
    const batch = sortino(testReturns);
    const online = new RunningSortino();
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("sortino matches RunningSortino with riskfree", () => {
    const riskfree = 0.001;
    const batch = sortino(testReturns, riskfree);
    const online = new RunningSortino({ riskfree });
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("sortino handles empty array", () => {
    const batch = sortino([]);
    const online = new RunningSortino();
    expect(online.value).toBe(batch);
  });

  it("sortino handles no downside", () => {
    const positiveReturns = [0.01, 0.02, 0.03];
    const batch = sortino(positiveReturns);
    const online = new RunningSortino();
    for (const r of positiveReturns) online.update(r);
    expect(online.value).toBe(batch);
  });

  it("calmar matches (no direct online equivalent, but test batch)", () => {
    const batch = calmar(testReturns, periodsPerYear);
    // No online calmar, just test batch computes
    expect(typeof batch).toBe("number");
  });

  it("winRate matches RunningWinRate", () => {
    const batch = winRate(testReturns);
    const online = new RunningWinRate();
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("winRate matches RunningWinRate with threshold", () => {
    const threshold = 0.005;
    const batch = winRate(testReturns, threshold);
    const online = new RunningWinRate({ threshold });
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("winRate handles empty array", () => {
    const batch = winRate([]);
    const online = new RunningWinRate();
    expect(online.value).toBe(batch);
  });

  it("gainLoss matches RunningGainLoss", () => {
    const batch = gainLoss(testReturns);
    const online = new RunningGainLoss();
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("gainLoss matches RunningGainLoss with threshold", () => {
    const threshold = 0.005;
    const batch = gainLoss(testReturns, threshold);
    const online = new RunningGainLoss({ threshold });
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("gainLoss handles no losses", () => {
    const positiveReturns = [0.01, 0.02, 0.03];
    const batch = gainLoss(positiveReturns);
    const online = new RunningGainLoss();
    for (const r of positiveReturns) online.update(r);
    expect(online.value).toBe(batch);
  });

  it("expectancy matches RunningExpectancy", () => {
    const batch = expectancy(testReturns);
    const online = new RunningExpectancy();
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("expectancy matches RunningExpectancy with threshold", () => {
    const threshold = 0.005;
    const batch = expectancy(testReturns, threshold);
    const online = new RunningExpectancy({ threshold });
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("expectancy handles empty array", () => {
    const batch = expectancy([]);
    const online = new RunningExpectancy();
    expect(online.value).toBe(batch);
  });

  it("profitFactor matches RunningProfitFactor", () => {
    const batch = profitFactor(testReturns);
    const online = new RunningProfitFactor();
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("profitFactor matches RunningProfitFactor with threshold", () => {
    const threshold = 0.005;
    const batch = profitFactor(testReturns, threshold);
    const online = new RunningProfitFactor({ threshold });
    for (const r of testReturns) online.update(r);
    expect(online.value).toBeCloseTo(batch);
  });

  it("profitFactor handles no losses", () => {
    const positiveReturns = [0.01, 0.02, 0.03];
    const batch = profitFactor(positiveReturns);
    const online = new RunningProfitFactor();
    for (const r of positiveReturns) online.update(r);
    expect(online.value).toBe(batch);
  });
});

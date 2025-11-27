import { describe, it, expect } from "vitest";
import {
  RunningDrawdown,
  RunningDrawup,
  RunningRelDrawdown,
  RunningRelDrawup,
  RunningLongestDrawdown,
  RunningLongestDrawup,
  RunningDrawResult,
  RunningDrawDurationResult,
} from "../../src/online/perf-drawdown";

// Helper type for test data points
interface DataPoint<T = Date> {
  value: number;
  time: T;
}

/**
 * Naive implementation for absolute drawdown calculation
 */
function naiveDrawdown<T = Date>(data: DataPoint<T>[]): RunningDrawResult<T>[] {
  if (data.length === 0) return [];

  const results: RunningDrawResult<T>[] = [];
  let peak = data[0].value;
  let peakTime = data[0].time;
  let maxDrawdown = 0;
  let maxFrom = data[0].time;
  let maxTo = data[0].time;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];

    // Update peak if necessary
    if (point.value > peak) {
      peak = point.value;
      peakTime = point.time;
    }

    // Calculate current drawdown
    const currentDrawdown = peak - point.value;

    // Update max drawdown if necessary
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
      maxFrom = peakTime;
      maxTo = point.time;
    }

    results.push({
      value: currentDrawdown,
      max: maxDrawdown,
      maxFrom,
      maxTo,
    });
  }

  return results;
}

/**
 * Naive implementation for absolute drawup calculation
 */
function naiveDrawup<T = Date>(data: DataPoint<T>[]): RunningDrawResult<T>[] {
  if (data.length === 0) return [];

  const results: RunningDrawResult<T>[] = [];
  let trough = data[0].value;
  let troughTime = data[0].time;
  let maxDrawup = 0;
  let maxFrom = data[0].time;
  let maxTo = data[0].time;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];

    // Update trough if necessary
    if (point.value < trough) {
      trough = point.value;
      troughTime = point.time;
    }

    // Calculate current drawup
    const currentDrawup = point.value - trough;

    // Update max drawup if necessary
    if (currentDrawup > maxDrawup) {
      maxDrawup = currentDrawup;
      maxFrom = troughTime;
      maxTo = point.time;
    }

    results.push({
      value: currentDrawup,
      max: maxDrawup,
      maxFrom,
      maxTo,
    });
  }

  return results;
}

/**
 * Naive implementation for relative drawdown calculation
 */
function naiveRelDrawdown<T = Date>(
  data: DataPoint<T>[]
): RunningDrawResult<T>[] {
  if (data.length === 0) return [];

  const results: RunningDrawResult<T>[] = [];
  let peak = data[0].value;
  let peakTime = data[0].time;
  let maxDrawdown = 0;
  let maxFrom = data[0].time;
  let maxTo = data[0].time;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];

    // Update peak if necessary
    if (point.value > peak) {
      peak = point.value;
      peakTime = point.time;
    }

    // Calculate current relative drawdown
    const currentDrawdown = (peak - point.value) / peak;

    // Update max drawdown if necessary
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
      maxFrom = peakTime;
      maxTo = point.time;
    }

    results.push({
      value: currentDrawdown,
      max: maxDrawdown,
      maxFrom,
      maxTo,
    });
  }

  return results;
}

/**
 * Naive implementation for relative drawup calculation
 */
function naiveRelDrawup<T = Date>(
  data: DataPoint<T>[]
): RunningDrawResult<T>[] {
  if (data.length === 0) return [];

  const results: RunningDrawResult<T>[] = [];
  let trough = data[0].value;
  let troughTime = data[0].time;
  let maxDrawup = 0;
  let maxFrom = data[0].time;
  let maxTo = data[0].time;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];

    // Update trough if necessary
    if (point.value < trough) {
      trough = point.value;
      troughTime = point.time;
    }

    // Calculate current relative drawup
    const currentDrawup = (point.value - trough) / trough;

    // Update max drawup if necessary
    if (currentDrawup > maxDrawup) {
      maxDrawup = currentDrawup;
      maxFrom = troughTime;
      maxTo = point.time;
    }

    results.push({
      value: currentDrawup,
      max: maxDrawup,
      maxFrom,
      maxTo,
    });
  }

  return results;
}

/**
 * Naive implementation for longest drawdown duration calculation
 */
function naiveLongestDrawdown<T = Date>(
  data: DataPoint<T>[],
  computeDuration: (from: T, to: T) => number = (from, to) =>
    (to as any).getTime() - (from as any).getTime()
): RunningDrawDurationResult<T>[] {
  if (data.length === 0) return [];

  const results: RunningDrawDurationResult<T>[] = [];
  let peak = data[0].value;
  let peakTime = data[0].time;
  let longestDuration = 0;
  let longestFrom = data[0].time;
  let longestTo = data[0].time;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];

    // Calculate current duration
    const currentDuration = computeDuration(peakTime, point.time);

    // Check if we have a new peak
    if (point.value > peak) {
      // Finalize the previous drawdown period
      if (currentDuration > longestDuration) {
        longestDuration = currentDuration;
        longestFrom = peakTime;
        longestTo = point.time;
      }

      // Update peak
      peak = point.value;
      peakTime = point.time;

      results.push({
        duration: 0,
        longest: longestDuration,
        longestFrom,
        longestTo,
      });
    } else {
      // Still in drawdown
      if (currentDuration > longestDuration) {
        results.push({
          duration: currentDuration,
          longest: currentDuration,
          longestFrom: peakTime,
          longestTo: point.time,
        });
      } else {
        results.push({
          duration: currentDuration,
          longest: longestDuration,
          longestFrom,
          longestTo,
        });
      }
    }
  }

  return results;
}

/**
 * Naive implementation for longest drawup duration calculation
 */
function naiveLongestDrawup<T = Date>(
  data: DataPoint<T>[],
  computeDuration: (from: T, to: T) => number = (from, to) =>
    (to as any).getTime() - (from as any).getTime()
): RunningDrawDurationResult<T>[] {
  if (data.length === 0) return [];

  const results: RunningDrawDurationResult<T>[] = [];
  let trough = data[0].value;
  let troughTime = data[0].time;
  let longestDuration = 0;
  let longestFrom = data[0].time;
  let longestTo = data[0].time;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];

    // Calculate current duration
    const currentDuration = computeDuration(troughTime, point.time);

    // Check if we have a new trough
    if (point.value < trough) {
      // Finalize the previous drawup period
      if (currentDuration > longestDuration) {
        longestDuration = currentDuration;
        longestFrom = troughTime;
        longestTo = point.time;
      }

      // Update trough
      trough = point.value;
      troughTime = point.time;

      results.push({
        duration: 0,
        longest: longestDuration,
        longestFrom,
        longestTo,
      });
    } else {
      // Still in drawup
      if (currentDuration > longestDuration) {
        results.push({
          duration: currentDuration,
          longest: currentDuration,
          longestFrom: troughTime,
          longestTo: point.time,
        });
      } else {
        results.push({
          duration: currentDuration,
          longest: longestDuration,
          longestFrom,
          longestTo,
        });
      }
    }
  }

  return results;
}

describe("RunningDrawdown", () => {
  it("should compute drawdown for simple sequence", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 90, time: new Date("2023-01-02") },
      { value: 95, time: new Date("2023-01-03") },
      { value: 85, time: new Date("2023-01-04") },
      { value: 110, time: new Date("2023-01-05") },
      { value: 105, time: new Date("2023-01-06") },
    ];

    const expected = naiveDrawdown(data);

    const drawdown = new RunningDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result (should be zero drawdown)
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
      expect(result[i].maxFrom).toEqual(expected[i].maxFrom);
      expect(result[i].maxTo).toEqual(expected[i].maxTo);
    }
  });

  it("should handle constant values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 100, time: new Date("2023-01-02") },
      { value: 100, time: new Date("2023-01-03") },
    ];

    const expected = naiveDrawdown(data);

    const drawdown = new RunningDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });

  it("should handle increasing values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 110, time: new Date("2023-01-02") },
      { value: 120, time: new Date("2023-01-03") },
      { value: 130, time: new Date("2023-01-04") },
    ];

    const expected = naiveDrawdown(data);

    const drawdown = new RunningDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });

  it("should handle decreasing values", () => {
    const data = [
      { value: 130, time: new Date("2023-01-01") },
      { value: 120, time: new Date("2023-01-02") },
      { value: 110, time: new Date("2023-01-03") },
      { value: 100, time: new Date("2023-01-04") },
    ];

    const expected = naiveDrawdown(data);

    const drawdown = new RunningDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });

  it("should work with numeric time values", () => {
    const data = [
      { value: 100, time: 1 },
      { value: 90, time: 2 },
      { value: 95, time: 3 },
      { value: 85, time: 4 },
    ];

    const expected = naiveDrawdown(data);

    const drawdown = new RunningDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
      expect(result[i].maxFrom).toEqual(expected[i].maxFrom);
      expect(result[i].maxTo).toEqual(expected[i].maxTo);
    }
  });
});

describe("RunningDrawup", () => {
  it("should compute drawup for simple sequence", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 110, time: new Date("2023-01-02") },
      { value: 105, time: new Date("2023-01-03") },
      { value: 115, time: new Date("2023-01-04") },
      { value: 90, time: new Date("2023-01-05") },
      { value: 95, time: new Date("2023-01-06") },
    ];

    const expected = naiveDrawup(data);

    const drawup = new RunningDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
      expect(result[i].maxFrom).toEqual(expected[i].maxFrom);
      expect(result[i].maxTo).toEqual(expected[i].maxTo);
    }
  });

  it("should handle constant values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 100, time: new Date("2023-01-02") },
      { value: 100, time: new Date("2023-01-03") },
    ];

    const expected = naiveDrawup(data);

    const drawup = new RunningDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });

  it("should handle decreasing values", () => {
    const data = [
      { value: 130, time: new Date("2023-01-01") },
      { value: 120, time: new Date("2023-01-02") },
      { value: 110, time: new Date("2023-01-03") },
      { value: 100, time: new Date("2023-01-04") },
    ];

    const expected = naiveDrawup(data);

    const drawup = new RunningDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });

  it("should handle increasing values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 110, time: new Date("2023-01-02") },
      { value: 120, time: new Date("2023-01-03") },
      { value: 130, time: new Date("2023-01-04") },
    ];

    const expected = naiveDrawup(data);

    const drawup = new RunningDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });
});

describe("RunningRelDrawdown", () => {
  it("should compute relative drawdown for simple sequence", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 90, time: new Date("2023-01-02") },
      { value: 95, time: new Date("2023-01-03") },
      { value: 85, time: new Date("2023-01-04") },
      { value: 110, time: new Date("2023-01-05") },
      { value: 105, time: new Date("2023-01-06") },
    ];

    const expected = naiveRelDrawdown(data);

    const drawdown = new RunningRelDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
      expect(result[i].maxFrom).toEqual(expected[i].maxFrom);
      expect(result[i].maxTo).toEqual(expected[i].maxTo);
    }
  });

  it("should handle constant values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 100, time: new Date("2023-01-02") },
      { value: 100, time: new Date("2023-01-03") },
    ];

    const expected = naiveRelDrawdown(data);

    const drawdown = new RunningRelDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });
});

describe("RunningRelDrawup", () => {
  it("should compute relative drawup for simple sequence", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 110, time: new Date("2023-01-02") },
      { value: 105, time: new Date("2023-01-03") },
      { value: 115, time: new Date("2023-01-04") },
      { value: 90, time: new Date("2023-01-05") },
      { value: 95, time: new Date("2023-01-06") },
    ];

    const expected = naiveRelDrawup(data);

    const drawup = new RunningRelDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
      expect(result[i].maxFrom).toEqual(expected[i].maxFrom);
      expect(result[i].maxTo).toEqual(expected[i].maxTo);
    }
  });

  it("should handle constant values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 100, time: new Date("2023-01-02") },
      { value: 100, time: new Date("2023-01-03") },
    ];

    const expected = naiveRelDrawup(data);

    const drawup = new RunningRelDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      value: 0,
      max: 0,
      maxFrom: data[0].time,
      maxTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].value).toBeCloseTo(expected[i].value, 10);
      expect(result[i].max).toBeCloseTo(expected[i].max, 10);
    }
  });
});

describe("RunningLongestDrawdown", () => {
  it("should compute longest drawdown duration for simple sequence", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 90, time: new Date("2023-01-02") },
      { value: 95, time: new Date("2023-01-03") },
      { value: 85, time: new Date("2023-01-04") },
      { value: 110, time: new Date("2023-01-05") }, // New peak, ends drawdown
      { value: 105, time: new Date("2023-01-06") },
    ];

    const expected = naiveLongestDrawdown(data);

    const drawdown = new RunningLongestDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      duration: 0,
      longest: 0,
      longestFrom: data[0].time,
      longestTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].duration).toBeCloseTo(expected[i].duration, 10);
      expect(result[i].longest).toBeCloseTo(expected[i].longest, 10);
      expect(result[i].longestFrom).toEqual(expected[i].longestFrom);
      expect(result[i].longestTo).toEqual(expected[i].longestTo);
    }
  });

  it("should handle custom duration function", () => {
    const data = [
      { value: 100, time: 1 },
      { value: 90, time: 2 },
      { value: 95, time: 3 },
      { value: 85, time: 4 },
      { value: 110, time: 5 }, // New peak, ends drawdown
      { value: 105, time: 6 },
    ];

    const customDuration = (from: number, to: number) => to - from;
    const expected = naiveLongestDrawdown(data, customDuration);

    const drawdown = new RunningLongestDrawdown(
      data[0].value,
      data[0].time,
      customDuration
    );
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      duration: 0,
      longest: 0,
      longestFrom: data[0].time,
      longestTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].duration).toBeCloseTo(expected[i].duration, 10);
      expect(result[i].longest).toBeCloseTo(expected[i].longest, 10);
      expect(result[i].longestFrom).toEqual(expected[i].longestFrom);
      expect(result[i].longestTo).toEqual(expected[i].longestTo);
    }
  });

  it("should handle increasing values", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 110, time: new Date("2023-01-02") },
      { value: 120, time: new Date("2023-01-03") },
      { value: 130, time: new Date("2023-01-04") },
    ];

    const expected = naiveLongestDrawdown(data);

    const drawdown = new RunningLongestDrawdown(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawdown.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      duration: 0,
      longest: 0,
      longestFrom: data[0].time,
      longestTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].duration).toBeCloseTo(expected[i].duration, 10);
      expect(result[i].longest).toBeCloseTo(expected[i].longest, 10);
    }
  });
});

describe("RunningLongestDrawup", () => {
  it("should compute longest drawup duration for simple sequence", () => {
    const data = [
      { value: 100, time: new Date("2023-01-01") },
      { value: 110, time: new Date("2023-01-02") },
      { value: 105, time: new Date("2023-01-03") },
      { value: 115, time: new Date("2023-01-04") },
      { value: 90, time: new Date("2023-01-05") }, // New trough, ends drawup
      { value: 95, time: new Date("2023-01-06") },
    ];

    const expected = naiveLongestDrawup(data);

    const drawup = new RunningLongestDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      duration: 0,
      longest: 0,
      longestFrom: data[0].time,
      longestTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].duration).toBeCloseTo(expected[i].duration, 10);
      expect(result[i].longest).toBeCloseTo(expected[i].longest, 10);
      expect(result[i].longestFrom).toEqual(expected[i].longestFrom);
      expect(result[i].longestTo).toEqual(expected[i].longestTo);
    }
  });

  it("should handle custom duration function", () => {
    const data = [
      { value: 100, time: 1 },
      { value: 110, time: 2 },
      { value: 105, time: 3 },
      { value: 115, time: 4 },
      { value: 90, time: 5 }, // New trough, ends drawup
      { value: 95, time: 6 },
    ];

    const customDuration = (from: number, to: number) => to - from;
    const expected = naiveLongestDrawup(data, customDuration);

    const drawup = new RunningLongestDrawup(
      data[0].value,
      data[0].time,
      customDuration
    );
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      duration: 0,
      longest: 0,
      longestFrom: data[0].time,
      longestTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].duration).toBeCloseTo(expected[i].duration, 10);
      expect(result[i].longest).toBeCloseTo(expected[i].longest, 10);
      expect(result[i].longestFrom).toEqual(expected[i].longestFrom);
      expect(result[i].longestTo).toEqual(expected[i].longestTo);
    }
  });

  it("should handle decreasing values", () => {
    const data = [
      { value: 130, time: new Date("2023-01-01") },
      { value: 120, time: new Date("2023-01-02") },
      { value: 110, time: new Date("2023-01-03") },
      { value: 100, time: new Date("2023-01-04") },
    ];

    const expected = naiveLongestDrawup(data);

    const drawup = new RunningLongestDrawup(data[0].value, data[0].time);
    const result = data
      .slice(1)
      .map((point) => drawup.update(point.value, point.time));

    // Insert the first point result
    result.unshift({
      duration: 0,
      longest: 0,
      longestFrom: data[0].time,
      longestTo: data[0].time,
    });

    for (let i = 0; i < result.length; i++) {
      expect(result[i].duration).toBeCloseTo(expected[i].duration, 10);
      expect(result[i].longest).toBeCloseTo(expected[i].longest, 10);
    }
  });
});

import { describe, it, expect } from "vitest";
import {
  maxDrawDown,
  maxRelDrawDown,
  maxDrawUp,
  maxRelDrawUp,
  DrawdownResult,
} from "../../src/utils/drawdown";

function createBuffer(data: number[]) {
  return {
    at: (i: number) => data[i],
    size: () => data.length,
  };
}

function naiveMaxDrawDown(data: number[]): DrawdownResult {
  if (data.length === 0) return { value: 0, from: 0, to: 0 };

  let result = 0;
  let resultFrom = 0;
  let resultTo = 0;
  let peak = data[0];
  let peakIndex = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i] > peak) {
      peak = data[i];
      peakIndex = i;
    } else {
      const dd = data[i] - peak;
      if (dd < result) {
        result = dd;
        resultFrom = peakIndex;
        resultTo = i;
      }
    }
  }

  return { value: result, from: resultFrom, to: resultTo };
}

function naiveMaxRelDrawDown(data: number[]): DrawdownResult {
  if (data.length === 0) return { value: 0, from: 0, to: 0 };

  let startIndex = 0;
  while (data[startIndex] === 0 && startIndex < data.length - 1) {
    startIndex++;
  }
  if (data[startIndex] === 0) return { value: 0, from: 0, to: 0 };

  let result = 0;
  let resultFrom = startIndex;
  let resultTo = startIndex;
  let peak = data[startIndex];
  let peakIndex = startIndex;

  for (let i = startIndex + 1; i < data.length; i++) {
    if (data[i] > peak) {
      peak = data[i];
      peakIndex = i;
    } else if (peak !== 0) {
      const dd = (data[i] - peak) / peak;
      if (dd < result) {
        result = dd;
        resultFrom = peakIndex;
        resultTo = i;
      }
    }
  }

  return { value: result, from: resultFrom, to: resultTo };
}

function naiveMaxDrawUp(data: number[]): DrawdownResult {
  if (data.length === 0) return { value: 0, from: 0, to: 0 };

  let result = 0;
  let resultFrom = 0;
  let resultTo = 0;
  let trough = data[0];
  let troughIndex = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i] < trough) {
      trough = data[i];
      troughIndex = i;
    } else {
      const du = data[i] - trough;
      if (du > result) {
        result = du;
        resultFrom = troughIndex;
        resultTo = i;
      }
    }
  }

  return { value: result, from: resultFrom, to: resultTo };
}

function naiveMaxRelDrawUp(data: number[]): DrawdownResult {
  if (data.length === 0) return { value: 0, from: 0, to: 0 };

  let startIndex = 0;
  while (data[startIndex] === 0 && startIndex < data.length - 1) {
    startIndex++;
  }
  if (data[startIndex] === 0) return { value: 0, from: 0, to: 0 };

  let result = 0;
  let resultFrom = startIndex;
  let resultTo = startIndex;
  let trough = data[startIndex];
  let troughIndex = startIndex;

  for (let i = startIndex + 1; i < data.length; i++) {
    if (data[i] < trough) {
      trough = data[i];
      troughIndex = i;
    } else if (trough !== 0) {
      const du = (data[i] - trough) / trough;
      if (du > result) {
        result = du;
        resultFrom = troughIndex;
        resultTo = i;
      }
    }
  }

  return { value: result, from: resultFrom, to: resultTo };
}

describe("maxDrawDown", () => {
  it("should return zero for empty buffer", () => {
    const result = maxDrawDown(createBuffer([]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should return zero for single element", () => {
    const result = maxDrawDown(createBuffer([100]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should return zero for monotonic increasing", () => {
    const data = [10, 20, 30, 40, 50];
    const result = maxDrawDown(createBuffer(data));
    expect(result.value).toBe(0);
  });

  it("should calculate drawdown for monotonic decreasing", () => {
    const data = [100, 80, 60, 40, 20];
    const result = maxDrawDown(createBuffer(data));
    const expected = naiveMaxDrawDown(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(-80);
    expect(result.from).toBe(0);
    expect(result.to).toBe(4);
  });

  it("should find max drawdown in typical sequence", () => {
    const data = [100, 120, 80, 90, 60, 100];
    const result = maxDrawDown(createBuffer(data));
    const expected = naiveMaxDrawDown(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(-60);
    expect(result.from).toBe(1);
    expect(result.to).toBe(4);
  });

  it("should handle multiple peaks and troughs", () => {
    const data = [50, 100, 60, 80, 40, 90, 30];
    const result = maxDrawDown(createBuffer(data));
    const expected = naiveMaxDrawDown(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(-70);
    expect(result.from).toBe(1);
    expect(result.to).toBe(6);
  });

  it("should handle constant values", () => {
    const data = [50, 50, 50, 50];
    const result = maxDrawDown(createBuffer(data));
    expect(result.value).toBe(0);
  });
});

describe("maxRelDrawDown", () => {
  it("should return zero for empty buffer", () => {
    const result = maxRelDrawDown(createBuffer([]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should return zero for all zeros", () => {
    const result = maxRelDrawDown(createBuffer([0, 0, 0]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should skip leading zeros", () => {
    const data = [0, 0, 100, 50];
    const result = maxRelDrawDown(createBuffer(data));
    expect(result.value).toBe(-0.5);
    expect(result.from).toBe(2);
    expect(result.to).toBe(3);
  });

  it("should calculate relative drawdown", () => {
    const data = [100, 200, 100];
    const result = maxRelDrawDown(createBuffer(data));
    const expected = naiveMaxRelDrawDown(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(-0.5);
    expect(result.from).toBe(1);
    expect(result.to).toBe(2);
  });

  it("should handle 50% drawdown", () => {
    const data = [100, 50];
    const result = maxRelDrawDown(createBuffer(data));
    expect(result.value).toBe(-0.5);
    expect(result.from).toBe(0);
    expect(result.to).toBe(1);
  });

  it("should find max relative drawdown in sequence", () => {
    const data = [100, 200, 150, 300, 100];
    const result = maxRelDrawDown(createBuffer(data));
    const expected = naiveMaxRelDrawDown(data);
    expect(result).toEqual(expected);
    expect(result.value).toBeCloseTo(-200 / 300);
    expect(result.from).toBe(3);
    expect(result.to).toBe(4);
  });
});

describe("maxDrawUp", () => {
  it("should return zero for empty buffer", () => {
    const result = maxDrawUp(createBuffer([]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should return zero for monotonic decreasing", () => {
    const data = [50, 40, 30, 20, 10];
    const result = maxDrawUp(createBuffer(data));
    expect(result.value).toBe(0);
  });

  it("should calculate drawup for monotonic increasing", () => {
    const data = [10, 20, 30, 40, 50];
    const result = maxDrawUp(createBuffer(data));
    const expected = naiveMaxDrawUp(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(40);
    expect(result.from).toBe(0);
    expect(result.to).toBe(4);
  });

  it("should find max drawup in typical sequence", () => {
    const data = [100, 60, 120, 80, 150];
    const result = maxDrawUp(createBuffer(data));
    const expected = naiveMaxDrawUp(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(90);
    expect(result.from).toBe(1);
    expect(result.to).toBe(4);
  });

  it("should handle multiple peaks and troughs", () => {
    const data = [50, 20, 80, 30, 100, 40];
    const result = maxDrawUp(createBuffer(data));
    const expected = naiveMaxDrawUp(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(80);
    expect(result.from).toBe(1);
    expect(result.to).toBe(4);
  });
});

describe("maxRelDrawUp", () => {
  it("should return zero for empty buffer", () => {
    const result = maxRelDrawUp(createBuffer([]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should return zero for all zeros", () => {
    const result = maxRelDrawUp(createBuffer([0, 0, 0]));
    expect(result).toEqual({ value: 0, from: 0, to: 0 });
  });

  it("should skip leading zeros", () => {
    const data = [0, 0, 50, 100];
    const result = maxRelDrawUp(createBuffer(data));
    expect(result.value).toBe(1);
    expect(result.from).toBe(2);
    expect(result.to).toBe(3);
  });

  it("should calculate relative drawup (100% gain)", () => {
    const data = [100, 200];
    const result = maxRelDrawUp(createBuffer(data));
    expect(result.value).toBe(1);
    expect(result.from).toBe(0);
    expect(result.to).toBe(1);
  });

  it("should find max relative drawup in sequence", () => {
    const data = [100, 50, 200, 80, 100];
    const result = maxRelDrawUp(createBuffer(data));
    const expected = naiveMaxRelDrawUp(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(3);
    expect(result.from).toBe(1);
    expect(result.to).toBe(2);
  });

  it("should handle trough to peak calculation", () => {
    const data = [200, 100, 50, 200];
    const result = maxRelDrawUp(createBuffer(data));
    const expected = naiveMaxRelDrawUp(data);
    expect(result).toEqual(expected);
    expect(result.value).toBe(3);
    expect(result.from).toBe(2);
    expect(result.to).toBe(3);
  });
});

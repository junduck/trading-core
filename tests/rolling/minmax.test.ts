import { describe, it, expect } from "vitest";
import {
  RollingMin,
  RollingMax,
  RollingMinMax,
  RollingArgMin,
  RollingArgMax,
  RollingArgMinMax,
} from "../../src/rolling/minmax";

function naiveMin(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let min = data[start];
    for (let j = start + 1; j <= i; j++) {
      if (data[j] < min) min = data[j];
    }
    result.push(min);
  }
  return result;
}

function naiveMax(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let max = data[start];
    for (let j = start + 1; j <= i; j++) {
      if (data[j] > max) max = data[j];
    }
    result.push(max);
  }
  return result;
}

function naiveArgMin(
  data: number[],
  period: number
): { val: number; pos: number }[] {
  const result: { val: number; pos: number }[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let minVal = data[start];
    let minIdx = start;
    for (let j = start + 1; j <= i; j++) {
      if (data[j] < minVal) {
        minVal = data[j];
        minIdx = j;
      }
    }
    result.push({ val: minVal, pos: i - minIdx });
  }
  return result;
}

function naiveArgMax(
  data: number[],
  period: number
): { val: number; pos: number }[] {
  const result: { val: number; pos: number }[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    let maxVal = data[start];
    let maxIdx = start;
    for (let j = start + 1; j <= i; j++) {
      if (data[j] > maxVal) {
        maxVal = data[j];
        maxIdx = j;
      }
    }
    result.push({ val: maxVal, pos: i - maxIdx });
  }
  return result;
}

describe("RollingMin", () => {
  it("should compute rolling min with period 4", () => {
    const data = [50, 30, 60, 20, 70, 10, 80, 40];
    const period = 4;
    const expected = naiveMin(data, period);

    const rm = new RollingMin({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle period larger than data", () => {
    const data = [100, 50, 200];
    const period = 10;
    const expected = naiveMin(data, period);

    const rm = new RollingMin({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle single element period", () => {
    const data = [10, 20, 30, 40];
    const period = 1;

    const rm = new RollingMin({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(data);
  });

  it("should handle monotonic decreasing", () => {
    const data = [100, 80, 60, 40, 20];
    const period = 3;
    const expected = naiveMin(data, period);

    const rm = new RollingMin({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle monotonic increasing", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;
    const expected = naiveMin(data, period);

    const rm = new RollingMin({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should return same value from value property as last update", () => {
    const rm = new RollingMin({ period: 4 });
    rm.update(50);
    rm.update(30);
    rm.update(60);
    rm.update(20);
    const lastValue = rm.update(70);
    expect(rm.value).toBe(lastValue);
  });
});

describe("RollingMax", () => {
  it("should compute rolling max with period 4", () => {
    const data = [50, 30, 60, 20, 70, 10, 80, 40];
    const period = 4;
    const expected = naiveMax(data, period);

    const rm = new RollingMax({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle period larger than data", () => {
    const data = [100, 200, 50];
    const period = 10;
    const expected = naiveMax(data, period);

    const rm = new RollingMax({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle single element period", () => {
    const data = [10, 20, 30, 40];
    const period = 1;

    const rm = new RollingMax({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(data);
  });

  it("should handle monotonic increasing", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;
    const expected = naiveMax(data, period);

    const rm = new RollingMax({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should handle monotonic decreasing", () => {
    const data = [100, 80, 60, 40, 20];
    const period = 3;
    const expected = naiveMax(data, period);

    const rm = new RollingMax({ period });
    const result = data.map((x) => rm.update(x));

    expect(result).toEqual(expected);
  });

  it("should return same value from value property as last update", () => {
    const rm = new RollingMax({ period: 4 });
    rm.update(50);
    rm.update(30);
    rm.update(60);
    rm.update(20);
    const lastValue = rm.update(70);
    expect(rm.value).toBe(lastValue);
  });
});

describe("RollingMinMax", () => {
  it("should compute both min and max with period 4", () => {
    const data = [50, 30, 60, 20, 70, 10, 80, 40];
    const period = 4;
    const expectedMin = naiveMin(data, period);
    const expectedMax = naiveMax(data, period);

    const rmm = new RollingMinMax({ period });
    const results = data.map((x) => rmm.update(x));

    expect(results.map((r) => r.min)).toEqual(expectedMin);
    expect(results.map((r) => r.max)).toEqual(expectedMax);
  });

  it("should handle period 2", () => {
    const data = [100, 50, 200, 25];
    const period = 2;
    const expectedMin = naiveMin(data, period);
    const expectedMax = naiveMax(data, period);

    const rmm = new RollingMinMax({ period });
    const results = data.map((x) => rmm.update(x));

    expect(results.map((r) => r.min)).toEqual(expectedMin);
    expect(results.map((r) => r.max)).toEqual(expectedMax);
  });

  it("should handle constant values", () => {
    const data = [50, 50, 50, 50];
    const period = 3;

    const rmm = new RollingMinMax({ period });
    const results = data.map((x) => rmm.update(x));

    for (const r of results) {
      expect(r.min).toBe(50);
      expect(r.max).toBe(50);
    }
  });

  it("should return same value from value property as last update", () => {
    const rmm = new RollingMinMax({ period: 4 });
    rmm.update(50);
    rmm.update(30);
    rmm.update(60);
    rmm.update(20);
    const lastValue = rmm.update(70);
    expect(rmm.value).toEqual(lastValue);
  });
});

describe("RollingArgMin", () => {
  it("should track min position with period 4", () => {
    const data = [50, 30, 60, 20, 70, 10, 80, 40];
    const period = 4;
    const expected = naiveArgMin(data, period);

    const ram = new RollingArgMin({ period });
    const results = data.map((x) => ram.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].val).toBe(expected[i].val);
      expect(results[i].pos).toBe(expected[i].pos);
    }
  });

  it("should handle period 2", () => {
    const data = [100, 50, 200, 25, 300];
    const period = 2;
    const expected = naiveArgMin(data, period);

    const ram = new RollingArgMin({ period });
    const results = data.map((x) => ram.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].val).toBe(expected[i].val);
      expect(results[i].pos).toBe(expected[i].pos);
    }
  });

  it("should return pos 0 for newest min", () => {
    const data = [100, 80, 60, 40, 20];
    const period = 3;

    const ram = new RollingArgMin({ period });
    const results = data.map((x) => ram.update(x));

    for (const r of results) {
      expect(r.pos).toBe(0);
    }
  });

  it("should handle period larger than data", () => {
    const data = [30, 10, 50];
    const period = 10;
    const expected = naiveArgMin(data, period);

    const ram = new RollingArgMin({ period });
    const results = data.map((x) => ram.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].val).toBe(expected[i].val);
      expect(results[i].pos).toBe(expected[i].pos);
    }
  });

  it("should return same value from value property as last update", () => {
    const ram = new RollingArgMin({ period: 4 });
    ram.update(50);
    ram.update(30);
    ram.update(60);
    ram.update(20);
    const lastValue = ram.update(70);
    expect(ram.value).toEqual(lastValue);
  });
});

describe("RollingArgMax", () => {
  it("should track max position with period 4", () => {
    const data = [50, 30, 60, 20, 70, 10, 80, 40];
    const period = 4;
    const expected = naiveArgMax(data, period);

    const ram = new RollingArgMax({ period });
    const results = data.map((x) => ram.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].val).toBe(expected[i].val);
      expect(results[i].pos).toBe(expected[i].pos);
    }
  });

  it("should handle period 2", () => {
    const data = [100, 200, 50, 300, 25];
    const period = 2;
    const expected = naiveArgMax(data, period);

    const ram = new RollingArgMax({ period });
    const results = data.map((x) => ram.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].val).toBe(expected[i].val);
      expect(results[i].pos).toBe(expected[i].pos);
    }
  });

  it("should return pos 0 for newest max", () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;

    const ram = new RollingArgMax({ period });
    const results = data.map((x) => ram.update(x));

    for (const r of results) {
      expect(r.pos).toBe(0);
    }
  });

  it("should handle period larger than data", () => {
    const data = [30, 100, 50];
    const period = 10;
    const expected = naiveArgMax(data, period);

    const ram = new RollingArgMax({ period });
    const results = data.map((x) => ram.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].val).toBe(expected[i].val);
      expect(results[i].pos).toBe(expected[i].pos);
    }
  });

  it("should return same value from value property as last update", () => {
    const ram = new RollingArgMax({ period: 4 });
    ram.update(50);
    ram.update(30);
    ram.update(60);
    ram.update(20);
    const lastValue = ram.update(70);
    expect(ram.value).toEqual(lastValue);
  });
});

describe("RollingArgMinMax", () => {
  it("should track both min and max positions with period 4", () => {
    const data = [50, 30, 60, 20, 70, 10, 80, 40];
    const period = 4;
    const expectedMin = naiveArgMin(data, period);
    const expectedMax = naiveArgMax(data, period);

    const ramm = new RollingArgMinMax({ period });
    const results = data.map((x) => ramm.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].min.val).toBe(expectedMin[i].val);
      expect(results[i].min.pos).toBe(expectedMin[i].pos);
      expect(results[i].max.val).toBe(expectedMax[i].val);
      expect(results[i].max.pos).toBe(expectedMax[i].pos);
    }
  });

  it("should handle period 2", () => {
    const data = [100, 50, 200, 25];
    const period = 2;
    const expectedMin = naiveArgMin(data, period);
    const expectedMax = naiveArgMax(data, period);

    const ramm = new RollingArgMinMax({ period });
    const results = data.map((x) => ramm.update(x));

    for (let i = 0; i < results.length; i++) {
      expect(results[i].min.val).toBe(expectedMin[i].val);
      expect(results[i].min.pos).toBe(expectedMin[i].pos);
      expect(results[i].max.val).toBe(expectedMax[i].val);
      expect(results[i].max.pos).toBe(expectedMax[i].pos);
    }
  });

  it("should handle constant values", () => {
    const data = [50, 50, 50, 50];
    const period = 3;

    const ramm = new RollingArgMinMax({ period });
    const results = data.map((x) => ramm.update(x));

    for (const r of results) {
      expect(r.min.val).toBe(50);
      expect(r.max.val).toBe(50);
    }
  });

  it("should return same value from value property as last update", () => {
    const ramm = new RollingArgMinMax({ period: 4 });
    ramm.update(50);
    ramm.update(30);
    ramm.update(60);
    ramm.update(20);
    const lastValue = ramm.update(70);
    expect(ramm.value).toEqual(lastValue);
  });
});

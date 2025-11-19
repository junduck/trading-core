import { describe, it, expect } from "vitest";
import { CountMinSketch, BloomFilter } from "../../src/online/probs";

describe("CountMinSketch", () => {
  it("should initialize with width and depth", () => {
    const sketch = new CountMinSketch({ width: 100, depth: 4 });
    expect(sketch.query("key")).toBe(0);
  });

  it("should initialize with epsilon and delta", () => {
    const sketch = new CountMinSketch({ epsilon: 0.01, delta: 0.01 });
    expect(sketch.query("key")).toBe(0);
  });

  it("should update and query single key", () => {
    const sketch = new CountMinSketch({ width: 100, depth: 4 });
    sketch.update("test");
    expect(sketch.query("test")).toBeGreaterThanOrEqual(1);
  });

  it("should track multiple updates for same key", () => {
    const sketch = new CountMinSketch({ width: 100, depth: 4 });
    const key = "key";
    const count = 10;

    for (let i = 0; i < count; i++) {
      sketch.update(key);
    }

    expect(sketch.query(key)).toBeGreaterThanOrEqual(count);
  });

  it("should support custom count increment", () => {
    const sketch = new CountMinSketch({ width: 100, depth: 4 });
    sketch.update("key", 100);
    expect(sketch.query("key")).toBeGreaterThanOrEqual(100);
  });

  it("should maintain upper bound property with synthesis data", () => {
    const sketch = new CountMinSketch({ width: 1000, depth: 4 });
    const counts = new Map<string, number>();

    for (let i = 0; i < 100; i++) {
      const key = `key${i % 10}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      sketch.update(key);
    }

    for (const [key, actualCount] of counts) {
      const estimated = sketch.query(key);
      expect(estimated).toBeGreaterThanOrEqual(actualCount);
    }
  });

  it("should handle numeric keys", () => {
    const sketch = new CountMinSketch<number>({ width: 100, depth: 4 });
    sketch.update(1, 10);
    sketch.update(2, 20);

    expect(sketch.query(1)).toBeGreaterThanOrEqual(10);
    expect(sketch.query(2)).toBeGreaterThanOrEqual(20);
  });

  it("should handle unobserved keys", () => {
    const sketch = new CountMinSketch({ width: 10000, depth: 4 });
    sketch.update("observed", 10);
    const unobservedCount = sketch.query("unobserved");
    expect(unobservedCount).toBeGreaterThanOrEqual(0);
    expect(unobservedCount).toBeLessThanOrEqual(10);
  });

  it("should work with custom hash function", () => {
    const simpleHash = (key: string) => {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash += key.charCodeAt(i);
      }
      return hash;
    };

    const sketch = new CountMinSketch({
      width: 100,
      depth: 4,
      hash: simpleHash,
    });

    sketch.update("test", 10);
    expect(sketch.query("test")).toBeGreaterThanOrEqual(10);
  });
});

describe("BloomFilter", () => {
  it("should initialize with size and numHashes", () => {
    const filter = new BloomFilter({ size: 100, numHashes: 4 });
    expect(filter.has("key")).toBe(false);
  });

  it("should initialize with expectedItems and falsePositiveRate", () => {
    const filter = new BloomFilter({
      expectedItems: 1000,
      falsePositiveRate: 0.01,
    });
    expect(filter.has("key")).toBe(false);
  });

  it("should add and test single key", () => {
    const filter = new BloomFilter({ size: 1000, numHashes: 4 });
    filter.add("test");
    expect(filter.has("test")).toBe(true);
  });

  it("should return false for keys not added", () => {
    const filter = new BloomFilter({ size: 1000, numHashes: 4 });
    filter.add("added");
    expect(filter.has("not-added")).toBe(false);
  });

  it("should handle multiple keys", () => {
    const filter = new BloomFilter({ size: 10000, numHashes: 4 });
    const keys = ["key1", "key2", "key3", "key4", "key5"];

    for (const key of keys) {
      filter.add(key);
    }

    for (const key of keys) {
      expect(filter.has(key)).toBe(true);
    }
  });

  it("should have no false negatives", () => {
    const filter = new BloomFilter({
      expectedItems: 100,
      falsePositiveRate: 0.01,
    });

    for (let i = 0; i < 100; i++) {
      filter.add(`key${i}`);
    }

    for (let i = 0; i < 100; i++) {
      expect(filter.has(`key${i}`)).toBe(true);
    }
  });

  it("should have reasonable false positive rate", () => {
    const filter = new BloomFilter({
      expectedItems: 100,
      falsePositiveRate: 0.01,
    });

    for (let i = 0; i < 100; i++) {
      filter.add(`added${i}`);
    }

    let falsePositives = 0;
    const testCount = 1000;
    for (let i = 0; i < testCount; i++) {
      if (filter.has(`notadded${i}`)) {
        falsePositives++;
      }
    }

    expect(falsePositives / testCount).toBeLessThan(0.05);
  });

  it("should handle numeric keys", () => {
    const filter = new BloomFilter<number>({ size: 1000, numHashes: 4 });
    filter.add(1);
    filter.add(2);

    expect(filter.has(1)).toBe(true);
    expect(filter.has(2)).toBe(true);
    expect(filter.has(3)).toBe(false);
  });

  it("should work with custom hash function", () => {
    const simpleHash = (key: string) => {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash += key.charCodeAt(i);
      }
      return hash;
    };

    const filter = new BloomFilter({
      size: 1000,
      numHashes: 4,
      hash: simpleHash,
    });

    filter.add("test");
    expect(filter.has("test")).toBe(true);
    expect(filter.has("other")).toBe(false);
  });
});

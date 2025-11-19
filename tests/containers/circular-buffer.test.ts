import { describe, it, expect, beforeEach } from "vitest";
import { CircularBuffer } from "../../src/containers/circular-buffer";

describe("CircularBuffer", () => {
  let buffer: CircularBuffer<number>;

  beforeEach(() => {
    buffer = new CircularBuffer<number>(5);
  });

  describe("Basic Operations", () => {
    it("should create empty buffer with correct capacity", () => {
      expect(buffer.size()).toBe(0);
      expect(buffer.capacity()).toBe(5);
      expect(buffer.empty()).toBe(true);
      expect(buffer.full()).toBe(false);
    });

    it("should add elements and update size correctly", () => {
      buffer.push_back(1);
      expect(buffer.size()).toBe(1);
      expect(buffer.empty()).toBe(false);
      expect(buffer.full()).toBe(false);

      buffer.push_back(2);
      buffer.push_back(3);
      buffer.push_back(4);
      buffer.push_back(5);
      expect(buffer.size()).toBe(5);
      expect(buffer.full()).toBe(true);
    });

    it("should remove elements and update size correctly", () => {
      buffer.push_back(1);
      buffer.push_back(2);
      buffer.push_back(3);

      const item = buffer.pop_front();
      expect(item).toBe(1);
      expect(buffer.size()).toBe(2);

      buffer.pop_front();
      buffer.pop_front();
      expect(buffer.empty()).toBe(true);
    });

    it("should return undefined when popping from empty buffer", () => {
      expect(buffer.pop_front()).toBeUndefined();
      buffer.push_back(1);
      buffer.pop_front();
      expect(buffer.pop_front()).toBeUndefined();
    });
  });

  describe("Circular Behavior", () => {
    it("should overwrite oldest elements when full", () => {
      // Fill buffer
      for (let i = 1; i <= 5; i++) {
        buffer.push_back(i);
      }

      // Add one more element
      buffer.push_back(6);

      // Size should remain at capacity
      expect(buffer.size()).toBe(5);
      expect(buffer.full()).toBe(true);

      // Oldest element (1) should be overwritten
      expect(buffer.front()).toBe(2);
      expect(buffer.back()).toBe(6);

      // Check all elements
      const expected = [2, 3, 4, 5, 6];
      const actual = buffer.toArray();
      expect(actual).toEqual(expected);
    });

    it("should handle multiple overwrites correctly", () => {
      // Fill buffer
      for (let i = 1; i <= 5; i++) {
        buffer.push_back(i);
      }

      // Add more elements to test multiple overwrites
      buffer.push_back(6);
      buffer.push_back(7);
      buffer.push_back(8);

      const expected = [4, 5, 6, 7, 8];
      const actual = buffer.toArray();
      expect(actual).toEqual(expected);
    });
  });

  describe("Element Access", () => {
    beforeEach(() => {
      // Fill with elements 1, 2, 3
      buffer.push_back(1);
      buffer.push_back(2);
      buffer.push_back(3);
    });

    it("should access elements by index correctly", () => {
      expect(buffer.at(0)).toBe(1); // front
      expect(buffer.at(1)).toBe(2);
      expect(buffer.at(2)).toBe(3); // back
      expect(buffer.at(3)).toBe(1); // wraps around to first element
    });

    it("should support Python-style negative indices", () => {
      expect(buffer.at(-1)).toBe(3); // last element (back)
      expect(buffer.at(-2)).toBe(2);
      expect(buffer.at(-3)).toBe(1); // first element (front)
      expect(buffer.at(-4)).toBe(3); // wraps around to last element
      expect(buffer.at(-5)).toBe(2); // wraps around
      expect(buffer.at(-6)).toBe(1); // wraps around to first
    });

    it("should support modulo wrap-around for large positive indices", () => {
      expect(buffer.at(3)).toBe(1); // 3 % 3 = 0, wraps to first element
      expect(buffer.at(4)).toBe(2); // 4 % 3 = 1, wraps to second element
      expect(buffer.at(5)).toBe(3); // 5 % 3 = 2, wraps to third element
      expect(buffer.at(10)).toBe(2); // 10 % 3 = 1, wraps to second element
      expect(buffer.at(100)).toBe(2); // 100 % 3 = 1, wraps to second element
    });

    it("should support modulo wrap-around for large negative indices", () => {
      expect(buffer.at(-10)).toBe(3); // -10 % 3 = 2 (effectively), wraps to third element
      expect(buffer.at(-100)).toBe(3); // -100 % 3 = 2 (effectively), wraps to third element
    });

    it("should get front and back elements correctly", () => {
      expect(buffer.front()).toBe(1);
      expect(buffer.back()).toBe(3);
    });

    it("should return undefined for front/back when empty", () => {
      const emptyBuffer = new CircularBuffer<number>(3);
      expect(emptyBuffer.front()).toBeUndefined();
      expect(emptyBuffer.back()).toBeUndefined();
    });

    it("should handle wrap-around access correctly", () => {
      // Fill buffer to capacity
      buffer.push_back(4);
      buffer.push_back(5);

      // Add one more to trigger overwrite
      buffer.push_back(6);

      // Buffer now contains: [2, 3, 4, 5, 6]
      expect(buffer.front()).toBe(2);
      expect(buffer.back()).toBe(6);
      expect(buffer.at(0)).toBe(2);
      expect(buffer.at(4)).toBe(6);
    });

    it("should support negative indices with wrap-around", () => {
      // Fill buffer to capacity
      buffer.push_back(4);
      buffer.push_back(5);

      // Add one more to trigger overwrite
      buffer.push_back(6);

      // Buffer now contains: [2, 3, 4, 5, 6]
      expect(buffer.at(-1)).toBe(6); // last element
      expect(buffer.at(-2)).toBe(5);
      expect(buffer.at(-3)).toBe(4);
      expect(buffer.at(-4)).toBe(3);
      expect(buffer.at(-5)).toBe(2); // first element
      expect(buffer.at(-6)).toBe(6); // wraps around to last element
      expect(buffer.at(-10)).toBe(2); // wraps around
    });

    it("should support modulo wrap-around with circular buffer", () => {
      // Fill buffer to capacity
      buffer.push_back(4);
      buffer.push_back(5);

      // Add one more to trigger overwrite
      buffer.push_back(6);

      // Buffer now contains: [2, 3, 4, 5, 6]
      expect(buffer.at(5)).toBe(2); // 5 % 5 = 0, wraps to first element
      expect(buffer.at(7)).toBe(4); // 7 % 5 = 2, wraps to third element
      expect(buffer.at(10)).toBe(2); // 10 % 5 = 0, wraps to first element
      expect(buffer.at(15)).toBe(2); // 15 % 5 = 0, wraps to first element
    });
  });

  describe("Aliases", () => {
    it("should work with push() alias", () => {
      buffer.push(1);
      buffer.push(2);
      expect(buffer.size()).toBe(2);
      expect(buffer.front()).toBe(1);
    });

    it("should work with pop() alias", () => {
      buffer.push(1);
      buffer.push(2);
      const item = buffer.pop();
      expect(item).toBe(1);
      expect(buffer.size()).toBe(1);
    });

    it("should work with get() alias", () => {
      buffer.push(1);
      buffer.push(2);
      expect(buffer.get(0)).toBe(1);
      expect(buffer.get(1)).toBe(2);
    });

    it("should work with get() alias for negative indices", () => {
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      expect(buffer.get(-1)).toBe(3); // last element
      expect(buffer.get(-2)).toBe(2);
      expect(buffer.get(-3)).toBe(1); // first element
      expect(buffer.get(-4)).toBe(3); // wraps around to last element
    });

    it("should work with get() alias for modulo wrap-around", () => {
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      expect(buffer.get(5)).toBe(3); // 5 % 3 = 2, wraps to third element
      expect(buffer.get(10)).toBe(2); // 10 % 3 = 1, wraps to second element
      expect(buffer.get(-10)).toBe(3); // wraps around
    });

    it("should work with peek() alias", () => {
      buffer.push(1);
      buffer.push(2);
      expect(buffer.peek()).toBe(1);
    });
  });

  describe("Iterator Support", () => {
    it("should iterate over elements in correct order", () => {
      buffer.push_back(1);
      buffer.push_back(2);
      buffer.push_back(3);

      const result = [];
      for (const item of buffer) {
        result.push(item);
      }

      expect(result).toEqual([1, 2, 3]);
    });

    it("should iterate correctly after wrap-around", () => {
      // Fill buffer
      for (let i = 1; i <= 5; i++) {
        buffer.push_back(i);
      }

      // Add more to trigger wrap-around
      buffer.push_back(6);
      buffer.push_back(7);

      const result = [];
      for (const item of buffer) {
        result.push(item);
      }

      expect(result).toEqual([3, 4, 5, 6, 7]);
    });

    it("should iterate over empty buffer", () => {
      const result = [];
      for (const item of buffer) {
        result.push(item);
      }
      expect(result).toEqual([]);
    });
  });

  describe("toArray()", () => {
    it("should convert buffer to array in correct order", () => {
      buffer.push_back(1);
      buffer.push_back(2);
      buffer.push_back(3);

      const result = buffer.toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle wrap-around correctly", () => {
      // Fill buffer
      for (let i = 1; i <= 5; i++) {
        buffer.push_back(i);
      }

      // Add more to trigger wrap-around
      buffer.push_back(6);
      buffer.push_back(7);

      const result = buffer.toArray();
      expect(result).toEqual([3, 4, 5, 6, 7]);
    });

    it("should return empty array for empty buffer", () => {
      const result = buffer.toArray();
      expect(result).toEqual([]);
    });
  });

  describe("clear()", () => {
    it("should clear buffer and reset state", () => {
      buffer.push_back(1);
      buffer.push_back(2);
      buffer.push_back(3);

      buffer.clear();

      expect(buffer.size()).toBe(0);
      expect(buffer.empty()).toBe(true);
      expect(buffer.full()).toBe(false);
      expect(buffer.front()).toBeUndefined();
      expect(buffer.back()).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle buffer of size 1", () => {
      const singleBuffer = new CircularBuffer<number>(1);

      singleBuffer.push_back(1);
      expect(singleBuffer.size()).toBe(1);
      expect(singleBuffer.front()).toBe(1);
      expect(singleBuffer.back()).toBe(1);

      singleBuffer.push_back(2); // Should overwrite
      expect(singleBuffer.size()).toBe(1);
      expect(singleBuffer.front()).toBe(2);
      expect(singleBuffer.back()).toBe(2);
    });

    it("should handle large number of operations", () => {
      const largeBuffer = new CircularBuffer<number>(100);

      // Add many elements
      for (let i = 0; i < 1000; i++) {
        largeBuffer.push_back(i);
      }

      expect(largeBuffer.size()).toBe(100);
      expect(largeBuffer.front()).toBe(900);
      expect(largeBuffer.back()).toBe(999);

      // Remove all elements
      let count = 0;
      while (!largeBuffer.empty()) {
        largeBuffer.pop_front();
        count++;
      }

      expect(count).toBe(100);
      expect(largeBuffer.empty()).toBe(true);
    });
  });

  describe("Type Safety", () => {
    it("should work with different types", () => {
      const stringBuffer = new CircularBuffer<string>(3);
      stringBuffer.push_back("hello");
      stringBuffer.push_back("world");

      expect(stringBuffer.front()).toBe("hello");
      expect(stringBuffer.back()).toBe("world");
      expect(stringBuffer.toArray()).toEqual(["hello", "world"]);

      const objectBuffer = new CircularBuffer<{ id: number }>(2);
      objectBuffer.push_back({ id: 1 });
      objectBuffer.push_back({ id: 2 });

      expect(objectBuffer.at(0)?.id).toBe(1);
      expect(objectBuffer.at(1)?.id).toBe(2);
    });
  });
});

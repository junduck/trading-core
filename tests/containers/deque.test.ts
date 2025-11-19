import { describe, it, expect, beforeEach } from "vitest";
import { Deque } from "../../src/containers/deque";

describe("Deque", () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>(4);
  });

  describe("Basic operations", () => {
    it("should start empty", () => {
      expect(deque.size()).toBe(0);
      expect(deque.empty()).toBe(true);
    });

    it("should push elements to the front", () => {
      deque.push_front(1);
      deque.push_front(2);
      expect(deque.front()).toBe(2);
      expect(deque.back()).toBe(1);
      expect(deque.size()).toBe(2);
    });

    it("should push elements to the back", () => {
      deque.push_back(1);
      deque.push_back(2);
      expect(deque.front()).toBe(1);
      expect(deque.back()).toBe(2);
      expect(deque.size()).toBe(2);
    });

    it("should push elements to both ends", () => {
      deque.push_front(1);
      deque.push_back(2);
      deque.push_front(3);
      deque.push_back(4);

      expect(deque.front()).toBe(3);
      expect(deque.back()).toBe(4);
      expect(deque.size()).toBe(4);
    });

    it("should pop elements from the front", () => {
      deque.push_back(1);
      deque.push_back(2);

      expect(deque.pop_front()).toBe(1);
      expect(deque.front()).toBe(2);
      expect(deque.size()).toBe(1);
    });

    it("should pop elements from the back", () => {
      deque.push_back(1);
      deque.push_back(2);

      expect(deque.pop_back()).toBe(2);
      expect(deque.back()).toBe(1);
      expect(deque.size()).toBe(1);
    });

    it("should return undefined when popping from empty deque", () => {
      expect(deque.pop_front()).toBeUndefined();
      expect(deque.pop_back()).toBeUndefined();
    });

    it("should access elements by index", () => {
      deque.push_back(1);
      deque.push_back(2);
      deque.push_back(3);

      expect(deque.at(0)).toBe(1);
      expect(deque.at(1)).toBe(2);
      expect(deque.at(2)).toBe(3);
      expect(deque.at(3)).toBeUndefined();
    });

    it("should convert to array", () => {
      deque.push_back(1);
      deque.push_back(2);
      deque.push_back(3);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it("should clear all elements", () => {
      deque.push_back(1);
      deque.push_back(2);
      deque.clear();

      expect(deque.size()).toBe(0);
      expect(deque.front()).toBeUndefined();
      expect(deque.back()).toBeUndefined();
    });
  });

  describe("Dynamic growth", () => {
    it("should rebalance instead of expand when skewed", () => {
      // Create deque with capacity 10 and threshold 0.3
      const d = new Deque<number>(10, 2.0, 0.3);

      // Push 3 elements to back - takes up back half
      d.push_back(1);
      d.push_back(2);
      d.push_back(3);

      const capBefore = d.capacity();

      // Now push to front - should rebalance instead of expand
      // because there's plenty of back space (7 slots vs threshold of 3*0.3=0.9)
      d.push_front(0);

      // Capacity should not change (rebalanced, not expanded)
      expect(d.capacity()).toBe(capBefore);
      expect(d.size()).toBe(4);
      expect(d.toArray()).toEqual([0, 1, 2, 3]);
    });

    it("should handle growth when pushing beyond initial capacity", () => {
      // Push multiple elements to back
      deque.push_back(1);
      deque.push_back(2);
      deque.push_back(3);
      deque.push_back(4);
      deque.push_back(5);

      expect(deque.size()).toBe(5);
      expect(deque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle growth when pushing to front", () => {
      // Push multiple elements
      deque.push_back(1);
      deque.push_back(2);
      deque.push_back(3);
      deque.push_back(4);
      deque.push_front(0);

      expect(deque.size()).toBe(5);
      expect(deque.toArray()).toEqual([0, 1, 2, 3, 4]);
    });

    it("should maintain order with many elements", () => {
      const smallDeque = new Deque<number>(2, 2.0);

      // Push many elements
      smallDeque.push_back(1);
      smallDeque.push_back(2);
      smallDeque.push_back(3);
      smallDeque.push_back(4);
      smallDeque.push_back(5);

      expect(smallDeque.size()).toBe(5);
      expect(smallDeque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("Iterator support", () => {
    it("should support for...of iteration", () => {
      deque.push_back(1);
      deque.push_back(2);
      deque.push_back(3);

      const result: number[] = [];
      for (const item of deque) {
        result.push(item);
      }

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Edge cases", () => {
    it("should handle mixed operations after expansion", () => {
      // Fill to trigger expansion
      deque.push_back(1);
      deque.push_back(2);
      deque.push_back(3);
      deque.push_back(4);
      deque.push_back(5); // Expansion happens here

      // Mixed operations
      deque.push_front(0);
      deque.pop_back();
      deque.push_back(6);
      deque.pop_front();

      expect(deque.toArray()).toEqual([1, 2, 3, 4, 6]);
    });

    it("should recenter when empty after pop", () => {
      deque.push_back(1);
      deque.push_back(2);

      // Pop all elements - should recenter
      deque.pop_front();
      deque.pop_front();

      // Now push to both ends to verify recentering worked
      deque.push_front(10);
      deque.push_back(20);

      expect(deque.front()).toBe(10);
      expect(deque.back()).toBe(20);
      expect(deque.size()).toBe(2);
    });

    it("should handle many front pushes after back pushes", () => {
      const smallDeque = new Deque<number>(4, 2.0);

      // Push to back first
      smallDeque.push_back(1);
      smallDeque.push_back(2);
      smallDeque.push_back(3);
      smallDeque.push_back(4);

      // Then push many to front
      smallDeque.push_front(5);
      smallDeque.push_front(6);
      smallDeque.push_front(7);
      smallDeque.push_front(8);
      smallDeque.push_front(9);

      expect(smallDeque.size()).toBe(9);
      expect(smallDeque.toArray()).toEqual([9, 8, 7, 6, 5, 1, 2, 3, 4]);
    });
  });
});

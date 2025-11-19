import { describe, it, expect } from "vitest";
import { PriorityQueue } from "../../src/containers/priority-queue";

describe("PriorityQueue", () => {
  describe("Min-heap (default)", () => {
    it("should create empty queue", () => {
      const pq = new PriorityQueue<number>();
      expect(pq.size()).toBe(0);
      expect(pq.empty()).toBe(true);
      expect(pq.peek()).toBeUndefined();
      expect(pq.pop()).toBeUndefined();
    });

    it("should maintain min-heap order", () => {
      const pq = new PriorityQueue<number>();
      pq.push(5);
      pq.push(2);
      pq.push(8);
      pq.push(1);
      pq.push(10);

      expect(pq.size()).toBe(5);
      expect(pq.peek()).toBe(1);

      expect(pq.pop()).toBe(1);
      expect(pq.pop()).toBe(2);
      expect(pq.pop()).toBe(5);
      expect(pq.pop()).toBe(8);
      expect(pq.pop()).toBe(10);

      expect(pq.empty()).toBe(true);
    });

    it("should handle duplicates", () => {
      const pq = new PriorityQueue<number>();
      pq.push(5);
      pq.push(2);
      pq.push(5);
      pq.push(2);

      expect(pq.pop()).toBe(2);
      expect(pq.pop()).toBe(2);
      expect(pq.pop()).toBe(5);
      expect(pq.pop()).toBe(5);
    });
  });

  describe("Max-heap", () => {
    it("should maintain max-heap order with custom comparator", () => {
      const pq = new PriorityQueue<number>((a, b) => b - a);
      pq.push(5);
      pq.push(2);
      pq.push(8);
      pq.push(1);
      pq.push(10);

      expect(pq.peek()).toBe(10);
      expect(pq.pop()).toBe(10);
      expect(pq.pop()).toBe(8);
      expect(pq.pop()).toBe(5);
      expect(pq.pop()).toBe(2);
      expect(pq.pop()).toBe(1);
    });
  });

  describe("Custom comparator", () => {
    it("should work with objects", () => {
      interface Event {
        time: number;
        name: string;
      }

      const pq = new PriorityQueue<Event>((a, b) => a.time - b.time);
      pq.push({ time: 100, name: "c" });
      pq.push({ time: 10, name: "a" });
      pq.push({ time: 50, name: "b" });

      expect(pq.pop()?.name).toBe("a");
      expect(pq.pop()?.name).toBe("b");
      expect(pq.pop()?.name).toBe("c");
    });
  });

  describe("Basic operations", () => {
    it("should support peek/top without removing", () => {
      const pq = new PriorityQueue<number>();
      pq.push(5);
      pq.push(2);

      expect(pq.peek()).toBe(2);
      expect(pq.top()).toBe(2);
      expect(pq.size()).toBe(2);
    });

    it("should clear all elements", () => {
      const pq = new PriorityQueue<number>();
      pq.push(1);
      pq.push(2);
      pq.push(3);

      pq.clear();

      expect(pq.size()).toBe(0);
      expect(pq.empty()).toBe(true);
      expect(pq.peek()).toBeUndefined();
    });

    it("should support iteration in heap order", () => {
      const pq = new PriorityQueue<number>();
      pq.push(5);
      pq.push(2);
      pq.push(8);

      const items = [...pq];
      expect(items.length).toBe(3);
      expect(items.includes(2)).toBe(true);
      expect(items.includes(5)).toBe(true);
      expect(items.includes(8)).toBe(true);
    });

    it("should convert to array in heap order", () => {
      const pq = new PriorityQueue<number>();
      pq.push(5);
      pq.push(2);
      pq.push(8);

      const arr = pq.toArray();
      expect(arr.length).toBe(3);
      expect(arr.includes(2)).toBe(true);
      expect(arr.includes(5)).toBe(true);
      expect(arr.includes(8)).toBe(true);
    });
  });
});

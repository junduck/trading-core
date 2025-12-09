import { describe, it, expect, beforeEach } from "vitest";
import { BlockQueue } from "../../src/containers/block-queue";

describe("BlockQueue", () => {
  let queue: BlockQueue<number>;

  beforeEach(() => {
    queue = new BlockQueue<number>(4); // Small block size for testing
  });

  describe("Basic Operations", () => {
    it("should create empty queue with correct properties", () => {
      expect(queue.size()).toBe(0);
      expect(queue.length).toBe(0);
      expect(queue.empty()).toBe(true);
      expect(queue.front()).toBeUndefined();
      expect(queue.back()).toBeUndefined();
    });

    it("should add elements and update size correctly", () => {
      queue.push_back(1);
      expect(queue.size()).toBe(1);
      expect(queue.empty()).toBe(false);
      expect(queue.front()).toBe(1);
      expect(queue.back()).toBe(1);

      queue.push_back(2);
      queue.push_back(3);
      expect(queue.size()).toBe(3);
      expect(queue.front()).toBe(1);
      expect(queue.back()).toBe(3);
    });

    it("should remove elements and update size correctly", () => {
      queue.push_back(1);
      queue.push_back(2);
      queue.push_back(3);

      const item = queue.pop_front();
      expect(item).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.front()).toBe(2);
      expect(queue.back()).toBe(3);

      queue.pop_front();
      queue.pop_front();
      expect(queue.empty()).toBe(true);
      expect(queue.front()).toBeUndefined();
      expect(queue.back()).toBeUndefined();
    });

    it("should return undefined when popping from empty queue", () => {
      expect(queue.pop_front()).toBeUndefined();
      queue.push_back(1);
      queue.pop_front();
      expect(queue.pop_front()).toBeUndefined();
    });
  });

  describe("Scenario 1: Push/Pop Balanced", () => {
    it("should handle balanced push/pop operations correctly", () => {
      const operations = 100;
      const expected = [];

      // Interleave push and pop operations
      for (let i = 0; i < operations; i++) {
        if (i % 2 === 0 || expected.length === 0) {
          // Push operation
          queue.push_back(i);
          expected.push(i);
        } else {
          // Pop operation
          const popped = queue.pop_front();
          const expectedValue = expected.shift();
          expect(popped).toBe(expectedValue);
        }

        // Verify queue state matches expected
        expect(queue.size()).toBe(expected.length);
        if (expected.length > 0) {
          expect(queue.front()).toBe(expected[0]);
          expect(queue.back()).toBe(expected[expected.length - 1]);
        }
      }

      // Final state verification
      expect(queue.toArray()).toEqual(expected);
    });

    it("should handle push followed by immediate pop", () => {
      for (let i = 0; i < 50; i++) {
        queue.push_back(i);
        const popped = queue.pop_front();
        expect(popped).toBe(i);
        expect(queue.empty()).toBe(true);
      }
    });
  });

  describe("Scenario 2: Push Outpaces Pop", () => {
    it("should handle rapid pushing with slow popping", () => {
      const pushCount = 20;
      const popCount = 5;

      // Push many elements
      for (let i = 0; i < pushCount; i++) {
        queue.push_back(i);
      }

      expect(queue.size()).toBe(pushCount);

      // Pop few elements
      const popped = [];
      for (let i = 0; i < popCount; i++) {
        popped.push(queue.pop_front()!);
      }

      expect(queue.size()).toBe(pushCount - popCount);
      expect(queue.front()).toBe(popCount);
      expect(queue.back()).toBe(pushCount - 1);

      // Verify remaining elements
      const expected = [];
      for (let i = popCount; i < pushCount; i++) {
        expected.push(i);
      }
      expect(queue.toArray()).toEqual(expected);
    });

    it("should create multiple blocks when pushing many elements", () => {
      const elementCount = 15; // More than one block of 4

      for (let i = 0; i < elementCount; i++) {
        queue.push_back(i);
      }

      expect(queue.size()).toBe(elementCount);
      expect(queue.front()).toBe(0);
      expect(queue.back()).toBe(elementCount - 1);

      const expected = Array.from({ length: elementCount }, (_, i) => i);
      expect(queue.toArray()).toEqual(expected);
    });
  });

  describe("Scenario 3: Pop Outpaces Push", () => {
    it("should handle rapid popping with slow pushing", () => {
      // Push some initial elements
      const initialCount = 10;
      for (let i = 0; i < initialCount; i++) {
        queue.push_back(i);
      }

      expect(queue.size()).toBe(initialCount);

      // Pop more than we push
      const extraPops = 5;
      for (let i = 0; i < initialCount + extraPops; i++) {
        const popped = queue.pop_front();
        if (i < initialCount) {
          expect(popped).toBe(i);
        } else {
          expect(popped).toBeUndefined();
        }
      }

      expect(queue.empty()).toBe(true);
    });

    it("should reuse blocks when emptying them", () => {
      // Fill and empty a block multiple times
      for (let cycle = 0; cycle < 3; cycle++) {
        // Fill a block
        for (let i = 0; i < 4; i++) {
          queue.push_back(cycle * 10 + i);
        }

        expect(queue.size()).toBe(4);
        expect(queue.back()).toBe(cycle * 10 + 3);

        // Empty the block
        for (let i = 0; i < 4; i++) {
          const popped = queue.pop_front();
          expect(popped).toBe(cycle * 10 + i);
        }

        expect(queue.empty()).toBe(true);
      }
    });

    it("should manage free list correctly with multiple blocks", () => {
      // Use a queue with small maxFreeBlocks to test capping
      const testQueue = new BlockQueue<number>(2, 2); // blockSize=2, maxFreeBlocks=2

      // Phase 1: Create multiple blocks and populate free list
      // Push 6 elements: creates 3 blocks (2+2+2)
      for (let i = 0; i < 6; i++) {
        testQueue.push_back(100 + i);
      }
      expect(testQueue.size()).toBe(6);
      expect(testQueue.toArray()).toEqual([100, 101, 102, 103, 104, 105]);

      // Pop 4 elements: empties first 2 blocks, adding them to free list
      for (let i = 0; i < 4; i++) {
        expect(testQueue.pop_front()).toBe(100 + i);
      }
      expect(testQueue.size()).toBe(2); // 104, 105 left
      expect(testQueue.toArray()).toEqual([104, 105]);

      // Phase 2: Push more elements, should reuse from free list
      // Push 4 more elements: should reuse the 2 free blocks
      for (let i = 0; i < 4; i++) {
        testQueue.push_back(200 + i);
      }
      expect(testQueue.size()).toBe(6);
      expect(testQueue.toArray()).toEqual([104, 105, 200, 201, 202, 203]);

      // Phase 3: Empty more blocks to test free list capping
      // Pop all current elements: should add blocks to free list up to maxFreeBlocks=2
      const allElements = [];
      while (!testQueue.empty()) {
        allElements.push(testQueue.pop_front()!);
      }
      expect(allElements).toEqual([104, 105, 200, 201, 202, 203]);
      expect(testQueue.empty()).toBe(true);

      // Phase 4: Push many elements to exceed free list capacity
      // Push 8 elements: 4 blocks, but only 2 can be reused from free list
      for (let i = 0; i < 8; i++) {
        testQueue.push_back(300 + i);
      }
      expect(testQueue.size()).toBe(8);
      expect(testQueue.toArray()).toEqual([
        300, 301, 302, 303, 304, 305, 306, 307,
      ]);

      // Phase 5: Verify queue still works correctly after free list operations
      // Pop some elements
      for (let i = 0; i < 3; i++) {
        expect(testQueue.pop_front()).toBe(300 + i);
      }
      expect(testQueue.size()).toBe(5);
      expect(testQueue.front()).toBe(303);
      expect(testQueue.back()).toBe(307);

      // Push more to ensure continued correct operation
      testQueue.push_back(400);
      testQueue.push_back(401);
      expect(testQueue.size()).toBe(7);
      expect(testQueue.back()).toBe(401);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single block reuse correctly", () => {
      // Test the head === tail optimization
      queue.push_back(1);
      queue.push_back(2);

      // Pop both, should reuse the same block
      expect(queue.pop_front()).toBe(1);
      expect(queue.pop_front()).toBe(2);
      expect(queue.empty()).toBe(true);

      // Add more elements, should reuse the same block
      queue.push_back(3);
      queue.push_back(4);

      expect(queue.size()).toBe(2);
      expect(queue.front()).toBe(3);
      expect(queue.back()).toBe(4);
      expect(queue.toArray()).toEqual([3, 4]);
    });

    it("should handle emptying and refilling queue", () => {
      // Fill and empty multiple times
      for (let round = 0; round < 5; round++) {
        // Fill
        for (let i = 0; i < 3; i++) {
          queue.push_back(round * 100 + i);
        }

        expect(queue.size()).toBe(3);

        // Empty
        const popped = [];
        while (!queue.empty()) {
          popped.push(queue.pop_front()!);
        }

        expect(popped).toEqual([round * 100, round * 100 + 1, round * 100 + 2]);
        expect(queue.empty()).toBe(true);
      }
    });

    it("should handle large number of operations", () => {
      const operations = 1000;

      // Mix of operations
      for (let i = 0; i < operations; i++) {
        if (Math.random() < 0.6 || queue.empty()) {
          // 60% chance to push, or push if empty
          queue.push_back(i);
        } else {
          // 40% chance to pop
          queue.pop_front();
        }
      }

      // Should not crash and maintain consistency
      const toArray = queue.toArray();
      expect(toArray.length).toBe(queue.size());

      // Verify order
      for (let i = 1; i < toArray.length; i++) {
        // Elements should be in the order they were pushed
        expect(toArray[i]).toBeGreaterThan(toArray[i - 1]);
      }
    });

    it("should handle different data types", () => {
      const stringQueue = new BlockQueue<string>(2);
      stringQueue.push_back("hello");
      stringQueue.push_back("world");

      expect(stringQueue.front()).toBe("hello");
      expect(stringQueue.back()).toBe("world");
      expect(stringQueue.toArray()).toEqual(["hello", "world"]);

      const objectQueue = new BlockQueue<{ id: number; name: string }>(2);
      objectQueue.push_back({ id: 1, name: "Alice" });
      objectQueue.push_back({ id: 2, name: "Bob" });

      expect(objectQueue.front()?.id).toBe(1);
      expect(objectQueue.back()?.name).toBe("Bob");
    });

    it("should handle block size of 1", () => {
      const tinyQueue = new BlockQueue<number>(1);

      tinyQueue.push_back(1);
      expect(tinyQueue.size()).toBe(1);
      expect(tinyQueue.front()).toBe(1);
      expect(tinyQueue.back()).toBe(1);

      tinyQueue.push_back(2);
      expect(tinyQueue.size()).toBe(2);
      expect(tinyQueue.front()).toBe(1);
      expect(tinyQueue.back()).toBe(2);

      expect(tinyQueue.pop_front()).toBe(1);
      expect(tinyQueue.size()).toBe(1);
      expect(tinyQueue.front()).toBe(2);
    });

    it("should handle clear operation correctly", () => {
      // Fill with elements
      for (let i = 0; i < 10; i++) {
        queue.push_back(i);
      }

      expect(queue.size()).toBe(10);

      queue.clear();

      expect(queue.size()).toBe(0);
      expect(queue.empty()).toBe(true);
      expect(queue.front()).toBeUndefined();
      expect(queue.back()).toBeUndefined();
      expect(queue.toArray()).toEqual([]);

      // Should be able to add elements after clear
      queue.push_back(100);
      expect(queue.size()).toBe(1);
      expect(queue.front()).toBe(100);
      expect(queue.back()).toBe(100);
    });

    it("should handle queue with large block size", () => {
      const largeBlockQueue = new BlockQueue<number>(1000);

      // Add many elements
      for (let i = 0; i < 1500; i++) {
        largeBlockQueue.push_back(i);
      }

      expect(largeBlockQueue.size()).toBe(1500);
      expect(largeBlockQueue.front()).toBe(0);
      expect(largeBlockQueue.back()).toBe(1499);

      // Remove some elements
      for (let i = 0; i < 500; i++) {
        expect(largeBlockQueue.pop_front()).toBe(i);
      }

      expect(largeBlockQueue.size()).toBe(1000);
      expect(largeBlockQueue.front()).toBe(500);
      expect(largeBlockQueue.back()).toBe(1499);
    });
  });

  describe("Iterator Support", () => {
    it("should iterate over elements in correct order", () => {
      queue.push_back(1);
      queue.push_back(2);
      queue.push_back(3);

      const result = [];
      for (const item of queue) {
        result.push(item);
      }

      expect(result).toEqual([1, 2, 3]);
    });

    it("should iterate over empty queue", () => {
      const result = [];
      for (const item of queue) {
        result.push(item);
      }
      expect(result).toEqual([]);
    });

    it("should iterate across multiple blocks", () => {
      // Fill multiple blocks
      for (let i = 0; i < 10; i++) {
        queue.push_back(i);
      }

      const result = [];
      for (const item of queue) {
        result.push(item);
      }

      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should iterate correctly after pops and pushes", () => {
      // Mix operations
      for (let i = 0; i < 8; i++) {
        queue.push_back(i);
      }

      // Pop some elements
      queue.pop_front();
      queue.pop_front();

      // Add more
      queue.push_back(8);
      queue.push_back(9);

      const result = [];
      for (const item of queue) {
        result.push(item);
      }

      expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe("toArray()", () => {
    it("should convert queue to array in correct order", () => {
      queue.push_back(1);
      queue.push_back(2);
      queue.push_back(3);

      const result = queue.toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should return empty array for empty queue", () => {
      const result = queue.toArray();
      expect(result).toEqual([]);
    });

    it("should handle multiple blocks correctly", () => {
      for (let i = 0; i < 10; i++) {
        queue.push_back(i);
      }

      const result = queue.toArray();
      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe("Performance Characteristics", () => {
    it("should maintain O(1) operations for large queues", () => {
      const largeQueue = new BlockQueue<number>(1000);
      // Add and remove a large number of elements to ensure correctness
      for (let i = 0; i < 10000; i++) {
        largeQueue.push_back(i);
      }

      for (let i = 0; i < 10000; i++) {
        largeQueue.pop_front();
      }

      // Ensure queue is empty and operations completed without throwing
      expect(largeQueue.empty()).toBe(true);
    });

    it("should handle memory efficiently by reusing blocks", () => {
      // This test verifies that blocks are reused rather than endlessly allocated
      const initialPushes = 20; // 5 blocks of 4 elements each
      const pops = 16; // Leave 4 elements (1 full block)

      // Push initial elements
      for (let i = 0; i < initialPushes; i++) {
        queue.push_back(i);
      }

      expect(queue.size()).toBe(initialPushes);

      // Pop most elements
      for (let i = 0; i < pops; i++) {
        queue.pop_front();
      }

      expect(queue.size()).toBe(initialPushes - pops);
      expect(queue.front()).toBe(pops);

      // Add more elements - should reuse existing blocks
      for (let i = 0; i < 10; i++) {
        queue.push_back(100 + i);
      }

      expect(queue.size()).toBe(initialPushes - pops + 10);

      // Verify order is correct
      const expected = [];
      for (let i = pops; i < initialPushes; i++) {
        expected.push(i);
      }
      for (let i = 0; i < 10; i++) {
        expected.push(100 + i);
      }

      expect(queue.toArray()).toEqual(expected);
    });

    it("constructor should throw for non-positive block sizes", () => {
      // Zero and negative block sizes are invalid
      // Expect constructor to throw
      expect(() => new BlockQueue<number>(0)).toThrow();
      expect(() => new BlockQueue<number>(-5)).toThrow();
    });
  });
});

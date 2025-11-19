import { describe, it, expect } from "vitest";
import { RBTree } from "../../src/containers/rbtree";

describe("RBTree", () => {
  describe("Basic operations", () => {
    it("should create empty tree", () => {
      const tree = new RBTree<number>();
      expect(tree.size()).toBe(0);
      expect(tree.empty()).toBe(true);
      expect(tree.min()).toBeUndefined();
      expect(tree.max()).toBeUndefined();
      expect(tree.search(1)).toBeUndefined();
    });

    it("should insert and maintain sorted order", () => {
      const tree = new RBTree<number>();
      tree.insert(5);
      tree.insert(2);
      tree.insert(8);
      tree.insert(1);
      tree.insert(10);

      expect(tree.size()).toBe(5);
      expect(tree.min()).toBe(1);
      expect(tree.max()).toBe(10);

      const sorted = tree.toArray();
      expect(sorted).toEqual([1, 2, 5, 8, 10]);
    });

    it("should search for keys", () => {
      const tree = new RBTree<number>();
      tree.insert(5);
      tree.insert(2);
      tree.insert(8);

      expect(tree.has(5)).toBe(true);
      expect(tree.has(2)).toBe(true);
      expect(tree.has(8)).toBe(true);
      expect(tree.has(3)).toBe(false);

      expect(tree.search(5)).toBe(5);
      expect(tree.search(3)).toBeUndefined();
    });

    it("should delete keys", () => {
      const tree = new RBTree<number>();
      tree.insert(5);
      tree.insert(2);
      tree.insert(8);
      tree.insert(1);
      tree.insert(10);

      expect(tree.delete(2)).toBe(true);
      expect(tree.has(2)).toBe(false);
      expect(tree.size()).toBe(4);
      expect(tree.toArray()).toEqual([1, 5, 8, 10]);

      expect(tree.delete(99)).toBe(false);
      expect(tree.size()).toBe(4);
    });

    it("should handle duplicates by insertion order", () => {
      const tree = new RBTree<number>();
      tree.insert(5);
      tree.insert(5);
      tree.insert(5);

      expect(tree.size()).toBe(3);
      expect(tree.toArray()).toEqual([5, 5, 5]);
    });

    it("should clear all elements", () => {
      const tree = new RBTree<number>();
      tree.insert(1);
      tree.insert(2);
      tree.insert(3);

      tree.clear();

      expect(tree.size()).toBe(0);
      expect(tree.empty()).toBe(true);
      expect(tree.min()).toBeUndefined();
    });

    it("should support iteration in sorted order", () => {
      const tree = new RBTree<number>();
      const values = [5, 2, 8, 1, 10, 3];
      values.forEach((v) => tree.insert(v));

      const result = [...tree];
      expect(result).toEqual([1, 2, 3, 5, 8, 10]);
    });
  });

  describe("Custom comparator", () => {
    it("should work with reverse order", () => {
      const tree = new RBTree<number>((a, b) => b - a);
      tree.insert(5);
      tree.insert(2);
      tree.insert(8);
      tree.insert(1);
      tree.insert(10);

      expect(tree.min()).toBe(10);
      expect(tree.max()).toBe(1);
      expect(tree.toArray()).toEqual([10, 8, 5, 2, 1]);
    });

    it("should work with objects", () => {
      interface Order {
        price: number;
        qty: number;
      }

      const tree = new RBTree<Order>((a, b) => a.price - b.price);
      tree.insert({ price: 100, qty: 10 });
      tree.insert({ price: 99, qty: 5 });
      tree.insert({ price: 101, qty: 8 });

      const orders = tree.toArray();
      expect(orders[0]!.price).toBe(99);
      expect(orders[1]!.price).toBe(100);
      expect(orders[2]!.price).toBe(101);
    });
  });

  describe("Orderbook simulation", () => {
    interface PriceLevel {
      price: number;
      quantity: number;
      timestamp: number;
    }

    it("should maintain bid levels in descending order", () => {
      const bids = new RBTree<PriceLevel>((a, b) => b.price - a.price);

      bids.insert({ price: 100.5, quantity: 10, timestamp: 1 });
      bids.insert({ price: 100.3, quantity: 5, timestamp: 2 });
      bids.insert({ price: 100.7, quantity: 8, timestamp: 3 });
      bids.insert({ price: 100.1, quantity: 12, timestamp: 4 });

      const levels = bids.toArray();
      expect(levels.map((l) => l.price)).toEqual([100.7, 100.5, 100.3, 100.1]);
      expect(bids.min()!.price).toBe(100.7);
      expect(bids.max()!.price).toBe(100.1);
    });

    it("should maintain ask levels in ascending order", () => {
      const asks = new RBTree<PriceLevel>((a, b) => a.price - b.price);

      asks.insert({ price: 101.5, quantity: 10, timestamp: 1 });
      asks.insert({ price: 101.3, quantity: 5, timestamp: 2 });
      asks.insert({ price: 101.7, quantity: 8, timestamp: 3 });
      asks.insert({ price: 101.1, quantity: 12, timestamp: 4 });

      const levels = asks.toArray();
      expect(levels.map((l) => l.price)).toEqual([101.1, 101.3, 101.5, 101.7]);
      expect(asks.min()!.price).toBe(101.1);
      expect(asks.max()!.price).toBe(101.7);
    });

    it("should handle random price updates efficiently", () => {
      const asks = new RBTree<number>();
      const prices: number[] = [];

      const seed = 42;
      let rng = seed;
      const random = () => {
        rng = (rng * 1103515245 + 12345) % 2147483648;
        return rng / 2147483648;
      };

      for (let i = 0; i < 100; i++) {
        const price = 100 + random() * 10;
        prices.push(price);
        asks.insert(price);
      }

      expect(asks.size()).toBe(100);

      const sorted = asks.toArray();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]!).toBeGreaterThanOrEqual(sorted[i - 1]!);
      }

      const manualSort = [...prices].sort((a, b) => a - b);
      expect(sorted).toEqual(manualSort);
    });

    it("should handle orderbook updates with insertions and deletions", () => {
      interface Order {
        id: number;
        price: number;
        qty: number;
      }

      const book = new RBTree<Order>((a, b) => a.price - b.price);

      const order1 = { id: 1, price: 100, qty: 10 };
      const order2 = { id: 2, price: 101, qty: 5 };
      const order3 = { id: 3, price: 99, qty: 8 };

      book.insert(order1);
      book.insert(order2);
      book.insert(order3);

      expect(book.size()).toBe(3);
      expect(book.min()!.price).toBe(99);

      book.delete(order3);
      expect(book.size()).toBe(2);
      expect(book.min()!.price).toBe(100);

      book.insert({ id: 4, price: 98, qty: 12 });
      expect(book.min()!.price).toBe(98);
    });

    it("should efficiently find best bid/ask", () => {
      const bids = new RBTree<number>((a, b) => b - a);
      const asks = new RBTree<number>((a, b) => a - b);

      const seed = 123;
      let rng = seed;
      const random = () => {
        rng = (rng * 1103515245 + 12345) % 2147483648;
        return rng / 2147483648;
      };

      for (let i = 0; i < 50; i++) {
        bids.insert(99 + random() * 1);
        asks.insert(101 + random() * 1);
      }

      const bestBid = bids.min();
      const bestAsk = asks.min();

      expect(bestBid).toBeDefined();
      expect(bestAsk).toBeDefined();
      expect(bestBid!).toBeLessThan(100);
      expect(bestAsk!).toBeGreaterThan(101);

      const allBids = bids.toArray();
      expect(allBids[0]).toBe(bestBid);

      const allAsks = asks.toArray();
      expect(allAsks[0]).toBe(bestAsk);
    });
  });

  describe("Edge cases", () => {
    it("should handle single element", () => {
      const tree = new RBTree<number>();
      tree.insert(42);

      expect(tree.size()).toBe(1);
      expect(tree.min()).toBe(42);
      expect(tree.max()).toBe(42);
      expect(tree.toArray()).toEqual([42]);

      tree.delete(42);
      expect(tree.empty()).toBe(true);
    });

    it("should handle sequential insertions", () => {
      const tree = new RBTree<number>();
      for (let i = 1; i <= 100; i++) {
        tree.insert(i);
      }

      expect(tree.size()).toBe(100);
      expect(tree.min()).toBe(1);
      expect(tree.max()).toBe(100);

      const arr = tree.toArray();
      for (let i = 0; i < 100; i++) {
        expect(arr[i]).toBe(i + 1);
      }
    });

    it("should handle reverse sequential insertions", () => {
      const tree = new RBTree<number>();
      for (let i = 100; i >= 1; i--) {
        tree.insert(i);
      }

      expect(tree.size()).toBe(100);
      expect(tree.min()).toBe(1);
      expect(tree.max()).toBe(100);
    });

    it("should handle deletions in various orders", () => {
      const tree = new RBTree<number>();
      const values = [5, 2, 8, 1, 10, 3, 7, 9, 4, 6];
      values.forEach((v) => tree.insert(v));

      tree.delete(1);
      expect(tree.toArray()).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);

      tree.delete(10);
      expect(tree.toArray()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);

      tree.delete(5);
      expect(tree.toArray()).toEqual([2, 3, 4, 6, 7, 8, 9]);
    });
  });
});

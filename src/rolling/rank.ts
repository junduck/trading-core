import { CircularBuffer } from "../containers/circular-buffer.js";

/**
 * QuickSelect algorithm to find the nth smallest element.
 * Partially sorts array so that element at position n is correct.
 */
export function nth_element(
  arr: number[],
  left: number,
  right: number,
  n: number
): number {
  while (left < right - 1) {
    const pivot = arr[left + Math.floor(Math.random() * (right - left))]!;
    let i = left;
    let j = right - 1;

    while (i <= j) {
      while (arr[i]! < pivot) i++;
      while (arr[j]! > pivot) j--;
      if (i <= j) {
        const tmp = arr[i]!;
        arr[i] = arr[j]!;
        arr[j] = tmp;
        i++;
        j--;
      }
    }

    if (n <= j) {
      right = j + 1;
    } else if (n >= i) {
      left = i;
    } else {
      return arr[n]!;
    }
  }

  return arr[left]!;
}

/**
 * Rolling median calculator. O(n) per update using QuickSelect.
 * For even periods, returns the average of the two middle elements.
 * Returns undefined if window is not full.
 */
export class RollingMedian {
  readonly buffer: CircularBuffer<number>;
  readonly queue: Array<number>;
  private readonly midx: number;
  private readonly isEven: boolean;

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.queue = new Array(opts.period);
    this.midx = Math.floor(opts.period / 2);
    this.isEven = opts.period % 2 === 0;
  }

  update(x: number): number | undefined {
    this.buffer.push(x);
    const n = this.buffer.size();

    if (n < this.buffer.capacity()) {
      return undefined;
    }

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = val;
    }

    if (this.isEven) {
      const a = nth_element(this.queue, 0, n, this.midx - 1);
      const b = nth_element(this.queue, 0, n, this.midx);
      return (a + b) / 2;
    }
    return nth_element(this.queue, 0, n, this.midx);
  }
}

/**
 * Rolling quantile calculator. O(n·log(k)) per update where k is number of quantiles.
 * Returns undefined if window is not full.
 */
export class RollingQuantile {
  readonly buffer: CircularBuffer<number>;
  readonly queue: Array<number>;
  readonly sortedIndices: Array<{ qidx: number; outIdx: number }>;

  constructor(opts: { period: number; quantiles: number[] }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.queue = new Array(opts.period);

    this.sortedIndices = opts.quantiles.map((q, i) => ({
      qidx: Math.round(opts.period * q),
      outIdx: i,
    }));
    this.sortedIndices.sort((a, b) => a.qidx - b.qidx);
  }

  update(x: number): number[] | undefined {
    this.buffer.push(x);
    const n = this.buffer.size();

    if (n < this.buffer.capacity()) {
      return undefined;
    }

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = val;
    }

    const result = new Array<number>(this.sortedIndices.length);
    let left = 0;
    let right = n;

    for (const { qidx, outIdx } of this.sortedIndices) {
      const idx = Math.min(qidx, n - 1);
      const val = nth_element(this.queue, left, right, idx);
      result[outIdx] = val;
      // Exploit partial sort: after finding idx, search [idx, right) for next quantile
      left = idx;
    }

    return result;
  }
}

import { CircularBuffer } from "../containers/circular-buffer.js";
import { lerp, nth_element } from "../numeric/utils.js";

/**
 * Rolling median calculator. O(n) per update using QuickSelect.
 * For even periods, returns the average of the two middle elements.
 * Returns undefined if window is not full.
 * @group Rolling Statistics
 */
export class RollingMedian {
  readonly buffer: CircularBuffer<number>;
  readonly queue: Array<number>;
  private readonly midx: number;
  private readonly isEven: boolean;
  private median: number | undefined;

  get value(): number | undefined {
    return this.median;
  }

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
      this.median = undefined;
      return undefined;
    }

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = val;
    }

    if (this.isEven) {
      const a = nth_element(this.queue, 0, n, this.midx - 1);
      // After partitioning at midx-1, minimum of [midx, n) is the element at midx
      let b = this.queue[this.midx]!;
      for (let i = this.midx + 1; i < n; i++) {
        if (this.queue[i]! < b) b = this.queue[i]!;
      }
      this.median = lerp(a, b, 0.5);
      return this.median;
    }
    this.median = nth_element(this.queue, 0, n, this.midx);
    return this.median;
  }

  reset(): void {
    this.buffer.clear();
    this.queue.fill(0);
    this.median = undefined;
  }
}

/**
 * Rolling quantile calculator. O(n·log(k)) per update where k is number of quantiles.
 * Returns undefined if window is not full.
 * @group Rolling Statistics
 */
export class RollingQuantile {
  readonly buffer: CircularBuffer<number>;
  readonly queue: Array<number>;
  readonly sortedIndices: Array<{ qidx: number; outIdx: number }>;
  private quantiles: number[];

  get value(): number[] | undefined {
    if (!this.buffer.full()) {
      return undefined;
    }
    return [...this.quantiles];
  }

  constructor(opts: { period: number; quantiles: number[] }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.queue = new Array(opts.period);

    this.sortedIndices = opts.quantiles.map((q, i) => ({
      qidx: Math.round(opts.period * q),
      outIdx: i,
    }));
    this.sortedIndices.sort((a, b) => a.qidx - b.qidx);
    this.quantiles = new Array<number>(this.sortedIndices.length);
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

    let left = 0;
    let right = n;

    for (const { qidx, outIdx } of this.sortedIndices) {
      const idx = Math.min(qidx, n - 1);
      const val = nth_element(this.queue, left, right, idx);
      this.quantiles[outIdx] = val;
      // Exploit partial sort: after finding idx, search [idx, right) for next quantile
      left = idx;
    }

    return [...this.quantiles];
  }

  reset(): void {
    this.buffer.clear();
    this.queue.fill(0);
    this.quantiles.fill(0);
  }
}

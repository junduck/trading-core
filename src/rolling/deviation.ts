import { CircularBuffer } from "../containers/circular-buffer.js";
import { SMA } from "./average.js";
import { RollingMedian } from "./rank.js";
import { nth_element } from "../numeric/utils.js";

/**
 * Rolling Mean Absolute Deviation.
 * MeadAD = mean(|x_i - mean(x)|)
 * @group Rolling Statistics
 */
export class MeanAbsDeviation {
  private sma: SMA;
  readonly buffer: CircularBuffer<number>;

  constructor(opts: { period: number }) {
    this.sma = new SMA(opts);
    this.buffer = this.sma.buffer;
  }

  update(x: number): { mean: number; mad: number } {
    const mean = this.sma.update(x);
    const n = this.buffer.size();

    let sum = 0;
    for (let i = 0; i < n; i++) {
      const val = this.buffer.at(i)!;
      sum += Math.abs(val - mean);
    }

    return { mean, mad: sum / n };
  }
}

/**
 * Rolling Median Absolute Deviation (MAD).
 * MAD = median(|x_i - median(x)|)
 * @group Rolling Statistics
 */
export class MedianAbsDeviation {
  private median: RollingMedian;
  readonly buffer: CircularBuffer<number>;
  private queue: Array<number>;
  private readonly midIdx: number;
  private readonly isEven: boolean;

  constructor(opts: { period: number }) {
    this.median = new RollingMedian(opts);
    this.buffer = this.median.buffer;
    this.queue = new Array(opts.period);
    this.midIdx = Math.floor(opts.period / 2);
    this.isEven = opts.period % 2 === 0;
  }

  update(x: number): { median: number; mad: number } | undefined {
    const med = this.median.update(x);

    if (med === undefined) {
      return undefined;
    }

    const n = this.buffer.size();

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = Math.abs(val - med);
    }

    let mad: number;
    if (this.isEven) {
      const a = nth_element(this.queue, 0, n, this.midIdx - 1);
      const b = nth_element(this.queue, 0, n, this.midIdx);
      mad = (a + b) / 2;
    } else {
      mad = nth_element(this.queue, 0, n, this.midIdx);
    }

    return { median: med, mad };
  }
}

/**
 * Rolling Interquartile Range (IQR).
 * IQR = Q3 - Q1 (75th percentile - 25th percentile)
 * @group Rolling Statistics
 */
export class IQR {
  readonly buffer: CircularBuffer<number>;
  private queue: Array<number>;
  private readonly q1Idx: number;
  private readonly q3Idx: number;

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.queue = new Array(opts.period);
    this.q1Idx = Math.floor((opts.period - 1) * 0.25);
    this.q3Idx = Math.floor((opts.period - 1) * 0.75);
  }

  update(x: number): { q1: number; q3: number; iqr: number } | null {
    this.buffer.push(x);
    const n = this.buffer.size();

    if (n < this.buffer.capacity()) {
      return null;
    }

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = val;
    }

    const q1 = nth_element(this.queue, 0, n, this.q1Idx);
    const q3 = nth_element(this.queue, this.q1Idx, n, this.q3Idx);

    return { q1, q3, iqr: q3 - q1 };
  }
}

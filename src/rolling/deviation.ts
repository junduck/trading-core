import { CircularBuffer } from "../containers/circular-buffer.js";
import { SMA } from "./average.js";
import { RollingMedian } from "./rank.js";
import { lerp, nth_element } from "../numeric/utils.js";

/**
 * Rolling Mean Absolute Deviation.
 * MeadAD = mean(|x_i - mean(x)|)
 * @group Rolling Statistics
 */
export class MeanAbsDeviation {
  private sma: SMA;
  readonly buffer: CircularBuffer<number>;
  private mad?: number;

  get value(): { mean: number; mad: number } {
    if (this.mad === undefined) {
      return { mean: 0, mad: 0 };
    }
    return { mean: this.sma.value, mad: this.mad! };
  }

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
    this.mad = sum / n;

    return { mean, mad: this.mad };
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
  private med?: number | undefined;
  private mad?: number;

  get value(): { median: number; mad: number } | undefined {
    if (this.med === undefined) {
      return undefined;
    }
    return { median: this.med!, mad: this.mad! };
  }

  constructor(opts: { period: number }) {
    this.median = new RollingMedian(opts);
    this.buffer = this.median.buffer;
    this.queue = new Array(opts.period);
    this.midIdx = Math.floor(opts.period / 2);
    this.isEven = opts.period % 2 === 0;
  }

  update(x: number): { median: number; mad: number } | undefined {
    this.med = this.median.update(x);

    if (this.med === undefined) {
      return undefined;
    }

    const n = this.buffer.size();

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = Math.abs(val - this.med);
    }

    if (this.isEven) {
      const a = nth_element(this.queue, 0, n, this.midIdx - 1);
      const b = nth_element(this.queue, 0, n, this.midIdx);
      this.mad = lerp(a, b, 0.5);
    } else {
      this.mad = nth_element(this.queue, 0, n, this.midIdx);
    }

    return { median: this.med!, mad: this.mad! };
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
  private q1?: number;
  private q3?: number;

  get value(): { q1: number; q3: number; iqr: number } | undefined {
    if (this.q1 === undefined) {
      return undefined;
    }
    return { q1: this.q1!, q3: this.q3!, iqr: this.q3! - this.q1! };
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.queue = new Array(opts.period);
    this.q1Idx = Math.floor((opts.period - 1) * 0.25);
    this.q3Idx = Math.floor((opts.period - 1) * 0.75);
  }

  update(x: number): { q1: number; q3: number; iqr: number } | undefined {
    this.buffer.push(x);
    const n = this.buffer.size();

    if (n < this.buffer.capacity()) {
      return undefined;
    }

    let i = 0;
    for (const val of this.buffer) {
      this.queue[i++] = val;
    }

    this.q1 = nth_element(this.queue, 0, n, this.q1Idx);
    this.q3 = nth_element(this.queue, this.q1Idx, n, this.q3Idx);

    return { q1: this.q1, q3: this.q3, iqr: this.q3 - this.q1 };
  }
}

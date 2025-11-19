import { CircularBuffer } from "../containers/circular-buffer.js";
import { exp_factor, SmoothedAccum, Kahan } from "./accum.js";

/**
 * O(1) moving sum using circular buffer and Kahan summation.
 */
export class RollingSum {
  readonly buffer: CircularBuffer<number>;
  private readonly sum: Kahan = new Kahan();

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
  }

  /**
   * @param x New value
   * @returns Sum of values in the window
   */
  update(x: number): number {
    if (!this.buffer.full()) {
      this.buffer.push(x);
      return this.sum.accum(x);
    } else {
      const old = this.buffer.front()!;
      this.buffer.push(x);
      return this.sum.accum(x - old);
    }
  }
}

/**
 * O(1) simple moving average (SMA) using circular buffer.
 */
export class SMA {
  readonly buffer: CircularBuffer<number>;
  private sma: SmoothedAccum = new SmoothedAccum();
  private weight: number;

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.weight = 1.0 / opts.period;
  }

  update(x: number): number {
    if (!this.buffer.full()) {
      this.buffer.push(x);
      this.sma.accum(x, 1 / this.buffer.size());
    } else {
      const old = this.buffer.front()!;
      this.sma.roll(x, old, this.weight);
      this.buffer.push(x);
    }
    return this.sma.val;
  }
}

/**
 * Exponential moving average (EMA) with infinite window.
 * EMA = alpha * x + (1 - alpha) * EMA_prev
 */
export class EMA {
  private alpha: number;
  private ema?: SmoothedAccum;

  constructor(opts: { period: number } | { alpha: number }) {
    if ("alpha" in opts) {
      this.alpha = opts.alpha;
    } else {
      this.alpha = exp_factor(opts.period);
    }
  }

  update(x: number): number {
    if (this.ema === undefined) {
      this.ema = new SmoothedAccum(x);
    } else {
      this.ema.accum(x, this.alpha);
    }
    return this.ema.val;
  }
}

/**
 * O(1) exponential weighted moving average with fixed window.
 * Combines exponential weighting with sliding window.
 */
export class EWMA {
  readonly buffer: CircularBuffer<number>;
  private readonly alpha: number;
  private readonly a1: number;
  private a1_n: number = 1;
  private s: number = 0;
  private readonly totalWeight: Kahan;

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    this.alpha = exp_factor(opts.period);
    this.a1 = 1 - this.alpha;
    this.totalWeight = new Kahan();
  }

  update(x: number): number {
    if (!this.buffer.full()) {
      this.buffer.push(x);
      this.totalWeight.accum(this.a1_n);
      this.s = this.a1 * this.s + x;
      this.a1_n *= this.a1;
    } else {
      const x0 = this.buffer.front()!;
      this.buffer.push(x);
      this.s = this.a1 * this.s + x - this.a1_n * x0;
    }
    return this.s / this.totalWeight.val;
  }
}

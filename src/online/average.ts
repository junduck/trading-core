import { exp_factor, Kahan, SmoothedAccum } from "../rolling/accum.js";

/**
 * O(1) cumulative moving average (CMA).
 */
export class CMA {
  private cma: Kahan = new Kahan();
  private n: number = 0;

  update(x: number): number {
    this.n++;
    return this.cma.accum((x - this.cma.val) / this.n);
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

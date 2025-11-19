import { CircularBuffer } from "../containers/circular-buffer.js";
import { exp_factor, SmoothedAccum, Kahan } from "../utils/accum.js";

/**
 * O(1) rolling variance using Welford's online algorithm.
 */
export class RollingVar {
  readonly buffer: CircularBuffer<number>;
  private m: Kahan = new Kahan();
  private m2: Kahan = new Kahan();
  private ddof: number;
  private weight: number;
  private varWeight: number;

  /**
   * @param opts.period Window size
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts: { period: number; ddof?: number }) {
    this.ddof = opts.ddof ?? 0;
    if (opts.period <= this.ddof) {
      throw new Error("Period should be larger than DDoF.");
    }
    this.buffer = new CircularBuffer<number>(opts.period);
    this.weight = 1.0 / opts.period;
    this.varWeight = 1.0 / (opts.period - this.ddof);
  }

  update(x: number): { mean: number; variance: number } {
    if (!this.buffer.full()) {
      this.buffer.push(x);
      const delta = x - this.m.val;
      this.m.accum(delta / this.buffer.size());
      this.m2.accum((x - this.m.val) * delta);
      if (this.buffer.size() <= this.ddof) {
        return { mean: this.m.val, variance: 0 };
      } else {
        return {
          mean: this.m.val,
          variance: this.m2.val / (this.buffer.size() - this.ddof),
        };
      }
    } else {
      const x0 = this.buffer.front()!;
      const d = x - this.m.val;
      const d0 = x0 - this.m.val;
      const dx = x - x0;
      this.m.accum(this.weight * dx);
      this.m2.accum(dx * (d + d0) - this.weight * dx * dx);
      this.buffer.push(x);
      return { mean: this.m.val, variance: this.m2.val * this.varWeight };
    }
  }
}

/**
 * Exponentially weighted variance with infinite window.
 */
export class RollingVarEW {
  private m?: number;
  private s2: SmoothedAccum = new SmoothedAccum();
  private alpha: number;

  /**
   * @param opts.period Period to calculate alpha
   * @param opts.alpha Direct smoothing factor
   */
  constructor(opts: { period: number } | { alpha: number }) {
    if ("alpha" in opts) {
      this.alpha = opts.alpha;
    } else {
      this.alpha = exp_factor(opts.period);
    }
  }

  update(x: number): { mean: number; variance: number } {
    if (this.m === undefined) {
      this.m = x;
      return { mean: this.m, variance: this.s2.val };
    }
    const d = x - this.m;
    this.m += d * this.alpha;
    const d2 = x - this.m;
    this.s2.accum(d * d2, this.alpha);
    return { mean: this.m, variance: this.s2.val };
  }
}

/**
 * O(1) rolling standard deviation.
 */
export class RollingStddev {
  private readonly variance: RollingVar;
  readonly buffer: CircularBuffer<number>;

  /**
   * @param opts.period Window size
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts: { period: number; ddof?: number }) {
    this.variance = new RollingVar(opts);
    this.buffer = this.variance.buffer;
  }

  update(x: number): { mean: number; stddev: number } {
    const { mean, variance } = this.variance.update(x);
    return { mean, stddev: Math.sqrt(variance) };
  }
}

/**
 * Exponentially weighted standard deviation with infinite window.
 */
export class RollingStddevEW {
  private readonly variance: RollingVarEW;

  /**
   * @param opts.period Period to calculate alpha
   * @param opts.alpha Direct smoothing factor
   */
  constructor(opts: { period: number } | { alpha: number }) {
    this.variance = new RollingVarEW(opts);
  }

  update(x: number): { mean: number; stddev: number } {
    const { mean, variance } = this.variance.update(x);
    return { mean, stddev: Math.sqrt(variance) };
  }
}

/**
 * O(1) rolling z-score calculator.
 */
export class RollingZScore {
  private stddev: RollingStddev;
  readonly buffer: CircularBuffer<number>;

  constructor(opts: { period: number }) {
    this.stddev = new RollingStddev({ period: opts.period, ddof: 0 });
    this.buffer = this.stddev.buffer;
  }

  update(x: number): { mean: number; stddev: number; zscore: number } {
    const { mean, stddev } = this.stddev.update(x);
    const zscore = stddev === 0 ? 0 : (x - mean) / stddev;
    return { mean, stddev, zscore };
  }
}

/**
 * Exponentially weighted z-score with infinite window.
 */
export class RollingZScoreEW {
  private stddev: RollingStddevEW;

  /**
   * @param opts.period Period to calculate alpha
   * @param opts.alpha Direct smoothing factor
   */
  constructor(opts: { period: number } | { alpha: number }) {
    this.stddev = new RollingStddevEW(opts);
  }

  update(x: number): { mean: number; stddev: number; zscore: number } {
    const { mean, stddev } = this.stddev.update(x);
    const zscore = stddev === 0 ? 0 : (x - mean) / stddev;
    return { mean, stddev, zscore };
  }
}

/**
 * O(1) rolling covariance between two series.
 */
export class RollingCov {
  readonly bufferX: CircularBuffer<number>;
  readonly bufferY: CircularBuffer<number>;
  private readonly kahanMXY: Kahan = new Kahan();
  private mx: SmoothedAccum = new SmoothedAccum();
  private my: SmoothedAccum = new SmoothedAccum();
  private ddof: number;
  private weight: number;
  private covWeight: number;

  /**
   * @param opts.period Window size
   * @param opts.ddof Delta degrees of freedom (default: 1)
   */
  constructor(opts: { period: number; ddof?: number }) {
    this.ddof = opts.ddof ?? 1;
    if (opts.period <= this.ddof) {
      throw new Error("Period should be larger than DDoF.");
    }
    this.bufferX = new CircularBuffer<number>(opts.period);
    this.bufferY = new CircularBuffer<number>(opts.period);
    this.weight = 1.0 / opts.period;
    this.covWeight = 1.0 / (opts.period - this.ddof);
  }

  update(x: number, y: number): { meanX: number; meanY: number; cov: number } {
    if (!this.bufferX.full()) {
      const n = this.bufferX.size() + 1;
      const a = 1.0 / n;
      const dy = y - this.my.val;

      this.mx.accum(x, a);
      this.my.accum(y, a);
      this.kahanMXY.accum((x - this.mx.val) * dy);

      this.bufferX.push(x);
      this.bufferY.push(y);

      if (n <= this.ddof) {
        return { meanX: this.mx.val, meanY: this.my.val, cov: 0 };
      } else {
        return {
          meanX: this.mx.val,
          meanY: this.my.val,
          cov: this.kahanMXY.val / (n - this.ddof),
        };
      }
    } else {
      const x0 = this.bufferX.front()!;
      const y0 = this.bufferY.front()!;
      const dy = y - this.my.val;
      const dy0 = y0 - this.my.val;

      this.mx.roll(x, x0, this.weight);
      this.my.roll(y, y0, this.weight);
      this.kahanMXY.accum((x - this.mx.val) * dy - (x0 - this.mx.val) * dy0);

      this.bufferX.push(x);
      this.bufferY.push(y);

      return {
        meanX: this.mx.val,
        meanY: this.my.val,
        cov: this.kahanMXY.val * this.covWeight,
      };
    }
  }
}

/**
 * O(1) rolling correlation between two series.
 */
export class RollingCorr {
  readonly bufferX: CircularBuffer<number>;
  readonly bufferY: CircularBuffer<number>;
  private readonly kahanMXY: Kahan;
  private readonly kahanM2X: Kahan;
  private readonly kahanM2Y: Kahan;
  private mx: number = 0;
  private my: number = 0;
  private ddof: number;
  private weight: number;
  private statWeight: number;

  /**
   * @param opts.period Window size
   * @param opts.ddof Delta degrees of freedom (default: 1)
   */
  constructor(opts: { period: number; ddof?: number }) {
    this.ddof = opts.ddof ?? 1;
    if (opts.period <= this.ddof) {
      throw new Error("Period should be larger than DDoF.");
    }
    this.bufferX = new CircularBuffer<number>(opts.period);
    this.bufferY = new CircularBuffer<number>(opts.period);
    this.kahanMXY = new Kahan();
    this.kahanM2X = new Kahan();
    this.kahanM2Y = new Kahan();
    this.weight = 1.0 / opts.period;
    this.statWeight = 1.0 / (opts.period - this.ddof);
  }

  update(
    x: number,
    y: number
  ): {
    meanX: number;
    meanY: number;
    cov: number;
    corr: number;
  } {
    if (!this.bufferX.full()) {
      const n = this.bufferX.size() + 1;
      const a = 1.0 / n;
      const dx = x - this.mx;
      const dy = y - this.my;

      this.mx += dx * a;
      this.my += dy * a;
      this.kahanMXY.accum((x - this.mx) * dy);
      this.kahanM2X.accum((x - this.mx) * dx);
      this.kahanM2Y.accum((y - this.my) * dy);

      this.bufferX.push(x);
      this.bufferY.push(y);

      if (n <= this.ddof) {
        return {
          meanX: this.mx,
          meanY: this.my,
          cov: 0,
          corr: 0,
        };
      } else {
        const mxy = this.kahanMXY.val;
        const m2x = this.kahanM2X.val;
        const m2y = this.kahanM2Y.val;
        const denom = Math.sqrt(m2x * m2y);
        return {
          meanX: this.mx,
          meanY: this.my,
          cov: mxy / (n - this.ddof),
          corr: denom === 0 ? 0 : mxy / denom,
        };
      }
    } else {
      const x0 = this.bufferX.front()!;
      const y0 = this.bufferY.front()!;
      const dx = x - this.mx;
      const dy = y - this.my;
      const dx0 = x0 - this.mx;
      const dy0 = y0 - this.my;

      this.mx += (x - x0) * this.weight;
      this.my += (y - y0) * this.weight;
      this.kahanMXY.accum((x - this.mx) * dy - (x0 - this.mx) * dy0);
      this.kahanM2X.accum((x - this.mx) * dx - (x0 - this.mx) * dx0);
      this.kahanM2Y.accum((y - this.my) * dy - (y0 - this.my) * dy0);

      this.bufferX.push(x);
      this.bufferY.push(y);

      const mxy = this.kahanMXY.val;
      const m2x = this.kahanM2X.val;
      const m2y = this.kahanM2Y.val;
      const denom = Math.sqrt(m2x * m2y);

      return {
        meanX: this.mx,
        meanY: this.my,
        cov: mxy * this.statWeight,
        corr: denom === 0 ? 0 : mxy / denom,
      };
    }
  }
}

/**
 * O(1) rolling beta coefficient (regression slope).
 */
export class RollingBeta {
  readonly bufferX: CircularBuffer<number>;
  readonly bufferY: CircularBuffer<number>;
  private readonly kahanMXY: Kahan;
  private readonly kahanM2X: Kahan;
  private mx: number = 0;
  private my: number = 0;
  private ddof: number;
  private weight: number;
  private statWeight: number;

  /**
   * @param opts.period Window size
   * @param opts.ddof Delta degrees of freedom (default: 1)
   */
  constructor(opts: { period: number; ddof?: number }) {
    this.ddof = opts.ddof ?? 1;
    if (opts.period <= this.ddof) {
      throw new Error("Period should be larger than DDoF.");
    }
    this.bufferX = new CircularBuffer<number>(opts.period);
    this.bufferY = new CircularBuffer<number>(opts.period);
    this.kahanMXY = new Kahan();
    this.kahanM2X = new Kahan();
    this.weight = 1.0 / opts.period;
    this.statWeight = 1.0 / (opts.period - this.ddof);
  }

  update(
    x: number,
    y: number
  ): { meanX: number; meanY: number; cov: number; beta: number } {
    if (!this.bufferX.full()) {
      const n = this.bufferX.size() + 1;
      const a = 1.0 / n;
      const dx = x - this.mx;
      const dy = y - this.my;

      this.mx += dx * a;
      this.my += dy * a;
      this.kahanMXY.accum((x - this.mx) * dy);
      this.kahanM2X.accum((x - this.mx) * dx);

      this.bufferX.push(x);
      this.bufferY.push(y);

      if (n <= this.ddof) {
        return { meanX: this.mx, meanY: this.my, cov: 0, beta: 0 };
      } else {
        const mxy = this.kahanMXY.val;
        const m2x = this.kahanM2X.val;
        const cov = mxy / (n - this.ddof);
        const beta = m2x > 0 ? mxy / m2x : 0;
        return { meanX: this.mx, meanY: this.my, cov, beta };
      }
    } else {
      const x0 = this.bufferX.front()!;
      const y0 = this.bufferY.front()!;
      const dx = x - this.mx;
      const dy = y - this.my;
      const dx0 = x0 - this.mx;
      const dy0 = y0 - this.my;

      this.mx += (x - x0) * this.weight;
      this.my += (y - y0) * this.weight;
      this.kahanMXY.accum((x - this.mx) * dy - (x0 - this.mx) * dy0);
      this.kahanM2X.accum((x - this.mx) * dx - (x0 - this.mx) * dx0);

      this.bufferX.push(x);
      this.bufferY.push(y);

      const mxy = this.kahanMXY.val;
      const m2x = this.kahanM2X.val;
      const cov = mxy * this.statWeight;
      const beta = m2x > 0 ? mxy / m2x : 0;

      return { meanX: this.mx, meanY: this.my, cov, beta };
    }
  }
}

/**
 * Exponentially weighted covariance with infinite window.
 */
export class RollingCovEW {
  private mx?: number;
  private my?: number;
  private sxy: SmoothedAccum = new SmoothedAccum();
  private alpha: number;

  /**
   * @param opts.period Period to calculate alpha
   * @param opts.alpha Direct smoothing factor
   */
  constructor(opts: { period: number } | { alpha: number }) {
    if ("alpha" in opts) {
      this.alpha = opts.alpha;
    } else {
      this.alpha = exp_factor(opts.period);
    }
  }

  update(x: number, y: number): { meanX: number; meanY: number; cov: number } {
    if (this.mx === undefined || this.my === undefined) {
      this.mx = x;
      this.my = y;
      return { meanX: this.mx, meanY: this.my, cov: 0 };
    }
    const dx = x - this.mx;
    const dy = y - this.my;
    this.mx += dx * this.alpha;
    this.my += dy * this.alpha;
    const dy2 = y - this.my;
    this.sxy.accum(dx * dy2, this.alpha);
    return { meanX: this.mx, meanY: this.my, cov: this.sxy.val };
  }
}

/**
 * Exponentially weighted correlation with infinite window.
 */
export class RollingCorrEW {
  private mx?: number;
  private my?: number;
  private sxy: SmoothedAccum = new SmoothedAccum();
  private s2x: SmoothedAccum = new SmoothedAccum();
  private s2y: SmoothedAccum = new SmoothedAccum();
  private alpha: number;

  /**
   * @param opts.period Period to calculate alpha
   * @param opts.alpha Direct smoothing factor
   */
  constructor(opts: { period: number } | { alpha: number }) {
    if ("alpha" in opts) {
      this.alpha = opts.alpha;
    } else {
      this.alpha = exp_factor(opts.period);
    }
  }

  update(
    x: number,
    y: number
  ): { meanX: number; meanY: number; cov: number; corr: number } {
    if (this.mx === undefined || this.my === undefined) {
      this.mx = x;
      this.my = y;
      return { meanX: this.mx, meanY: this.my, cov: 0, corr: 0 };
    }
    const dx = x - this.mx;
    const dy = y - this.my;
    this.mx += dx * this.alpha;
    this.my += dy * this.alpha;
    const dx2 = x - this.mx;
    const dy2 = y - this.my;
    this.sxy.accum(dx * dy2, this.alpha);
    this.s2x.accum(dx * dx2, this.alpha);
    this.s2y.accum(dy * dy2, this.alpha);
    const denom = Math.sqrt(this.s2x.val * this.s2y.val);
    return {
      meanX: this.mx,
      meanY: this.my,
      cov: this.sxy.val,
      corr: denom === 0 ? 0 : this.sxy.val / denom,
    };
  }
}

/**
 * Exponentially weighted beta coefficient with infinite window.
 */
export class RollingBetaEW {
  private mx?: number;
  private my?: number;
  private sxy: SmoothedAccum = new SmoothedAccum();
  private s2x: SmoothedAccum = new SmoothedAccum();
  private alpha: number;

  /**
   * @param opts.period Period to calculate alpha
   * @param opts.alpha Direct smoothing factor
   */
  constructor(opts: { period: number } | { alpha: number }) {
    if ("alpha" in opts) {
      this.alpha = opts.alpha;
    } else {
      this.alpha = exp_factor(opts.period);
    }
  }

  update(
    x: number,
    y: number
  ): { meanX: number; meanY: number; cov: number; beta: number } {
    if (this.mx === undefined || this.my === undefined) {
      this.mx = x;
      this.my = y;
      return { meanX: this.mx, meanY: this.my, cov: 0, beta: 0 };
    }
    const dx = x - this.mx;
    const dy = y - this.my;
    this.mx += dx * this.alpha;
    this.my += dy * this.alpha;
    const dx2 = x - this.mx;
    const dy2 = y - this.my;
    this.sxy.accum(dx * dy2, this.alpha);
    this.s2x.accum(dx * dx2, this.alpha);
    return {
      meanX: this.mx,
      meanY: this.my,
      cov: this.sxy.val,
      beta: this.s2x.val > 0 ? this.sxy.val / this.s2x.val : 0,
    };
  }
}

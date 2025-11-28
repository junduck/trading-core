import { Kahan } from "../numeric/accum.js";

/**
 * O(1) cumulative variance using Welford's online algorithm.
 * @group Online Statistics
 */
export class CuVar {
  private m: Kahan = new Kahan();
  private m2: Kahan = new Kahan();
  private n: number = 0;
  private ddof: number;

  get value(): { mean: number; variance: number } {
    if (this.n <= this.ddof) {
      return { mean: this.m.val, variance: 0 };
    }
    return {
      mean: this.m.val,
      variance: this.m2.val / (this.n - this.ddof),
    };
  }

  /**
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts?: { ddof?: number }) {
    this.ddof = opts?.ddof ?? 0;
  }

  update(x: number): { mean: number; variance: number } {
    this.n++;
    const delta = x - this.m.val;
    this.m.accum(delta / this.n);
    this.m2.accum((x - this.m.val) * delta);

    return this.value;
  }

  reset(): void {
    this.m.reset();
    this.m2.reset();
    this.n = 0;
  }
}

/**
 * O(1) cumulative standard deviation.
 * @group Online Statistics
 */
export class CuStddev {
  private readonly variance: CuVar;

  get value(): { mean: number; stddev: number } {
    const { mean, variance } = this.variance.value;
    return { mean, stddev: Math.sqrt(variance) };
  }

  /**
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts?: { ddof?: number }) {
    this.variance = new CuVar(opts);
  }

  update(x: number): { mean: number; stddev: number } {
    const { mean, variance } = this.variance.update(x);
    return { mean, stddev: Math.sqrt(variance) };
  }

  reset(): void {
    this.variance.reset();
  }
}

/**
 * O(1) cumulative covariance between two series.
 * @group Online Statistics
 */
export class CuCov {
  private mx: Kahan = new Kahan();
  private my: Kahan = new Kahan();
  private mxy: Kahan = new Kahan();
  private n: number = 0;
  private ddof: number;

  get value(): { meanX: number; meanY: number; cov: number } {
    if (this.n <= this.ddof) {
      return { meanX: this.mx.val, meanY: this.my.val, cov: 0 };
    }
    return {
      meanX: this.mx.val,
      meanY: this.my.val,
      cov: this.mxy.val / (this.n - this.ddof),
    };
  }

  /**
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts?: { ddof?: number }) {
    this.ddof = opts?.ddof ?? 0;
  }

  update(x: number, y: number): { meanX: number; meanY: number; cov: number } {
    this.n++;
    const a = 1.0 / this.n;
    const dy = y - this.my.val;

    this.mx.accum((x - this.mx.val) * a);
    this.my.accum(dy * a);
    this.mxy.accum((x - this.mx.val) * dy);

    return this.value;
  }

  reset(): void {
    this.mx.reset();
    this.my.reset();
    this.mxy.reset();
    this.n = 0;
  }
}

/**
 * O(1) cumulative correlation between two series.
 * @group Online Statistics
 */
export class CuCorr {
  private mx: Kahan = new Kahan();
  private my: Kahan = new Kahan();
  private mxy: Kahan = new Kahan();
  private m2x: Kahan = new Kahan();
  private m2y: Kahan = new Kahan();
  private n: number = 0;
  private ddof: number;

  get value(): { meanX: number; meanY: number; cov: number; corr: number } {
    if (this.n <= this.ddof) {
      return { meanX: this.mx.val, meanY: this.my.val, cov: 0, corr: 0 };
    }

    const mxy = this.mxy.val;
    const m2x = this.m2x.val;
    const m2y = this.m2y.val;
    const denom = Math.sqrt(m2x * m2y);

    return {
      meanX: this.mx.val,
      meanY: this.my.val,
      cov: mxy / (this.n - this.ddof),
      corr: denom === 0 ? 0 : mxy / denom,
    };
  }

  /**
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts?: { ddof?: number }) {
    this.ddof = opts?.ddof ?? 0;
  }

  update(
    x: number,
    y: number
  ): { meanX: number; meanY: number; cov: number; corr: number } {
    this.n++;
    const a = 1.0 / this.n;
    const dx = x - this.mx.val;
    const dy = y - this.my.val;

    this.mx.accum(dx * a);
    this.my.accum(dy * a);
    this.mxy.accum((x - this.mx.val) * dy);
    this.m2x.accum((x - this.mx.val) * dx);
    this.m2y.accum((y - this.my.val) * dy);

    return this.value;
  }

  reset(): void {
    this.mx.reset();
    this.my.reset();
    this.mxy.reset();
    this.m2x.reset();
    this.m2y.reset();
    this.n = 0;
  }
}

/**
 * O(1) cumulative beta coefficient (regression slope).
 * @group Online Statistics
 */
export class CuBeta {
  private mx: Kahan = new Kahan();
  private my: Kahan = new Kahan();
  private mxy: Kahan = new Kahan();
  private m2x: Kahan = new Kahan();
  private n: number = 0;
  private ddof: number;

  get value(): { meanX: number; meanY: number; cov: number; beta: number } {
    if (this.n <= this.ddof) {
      return { meanX: this.mx.val, meanY: this.my.val, cov: 0, beta: 0 };
    }

    const mxy = this.mxy.val;
    const m2x = this.m2x.val;
    const cov = mxy / (this.n - this.ddof);
    const beta = m2x > 0 ? mxy / m2x : 0;

    return { meanX: this.mx.val, meanY: this.my.val, cov, beta };
  }

  /**
   * @param opts.ddof Delta degrees of freedom (default: 0)
   */
  constructor(opts?: { ddof?: number }) {
    this.ddof = opts?.ddof ?? 0;
  }

  update(
    x: number,
    y: number
  ): { meanX: number; meanY: number; cov: number; beta: number } {
    this.n++;
    const a = 1.0 / this.n;
    const dx = x - this.mx.val;
    const dy = y - this.my.val;

    this.mx.accum(dx * a);
    this.my.accum(dy * a);
    this.mxy.accum((x - this.mx.val) * dy);
    this.m2x.accum((x - this.mx.val) * dx);

    return this.value;
  }

  reset(): void {
    this.mx.reset();
    this.my.reset();
    this.mxy.reset();
    this.m2x.reset();
    this.n = 0;
  }
}

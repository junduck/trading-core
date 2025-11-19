import { CMA } from "./average.js";
import { center_moment } from "../utils/misc.js";

/**
 * O(1) cumulative moments up to 3rd or 4th order.
 */
class CuMoments {
  private readonly cma1: CMA;
  private readonly cma2: CMA;
  private readonly cma3: CMA;
  private readonly cma4?: CMA;
  private readonly order: 3 | 4;

  constructor(opts: { order: 3 | 4 }) {
    this.order = opts.order;
    this.cma1 = new CMA();
    this.cma2 = new CMA();
    this.cma3 = new CMA();
    if (this.order === 4) {
      this.cma4 = new CMA();
    }
  }

  update(x: number): {
    u: number;
    u2: number;
    u3: number;
    u4?: number;
  } {
    const x2 = x * x;
    const x3 = x2 * x;

    const m = this.cma1.update(x);
    const m2 = this.cma2.update(x2);
    const m3 = this.cma3.update(x3);

    if (this.order === 4) {
      const x4 = x2 * x2;
      const m4 = this.cma4!.update(x4);
      const centered = center_moment({ m, m2, m3, m4 });
      return {
        u: centered.u,
        u2: centered.u2,
        u3: centered.u3,
        u4: centered.u4!,
      };
    } else {
      const centered = center_moment({ m, m2, m3 });
      return {
        u: centered.u,
        u2: centered.u2,
        u3: centered.u3,
      };
    }
  }
}

/**
 * O(1) cumulative skewness.
 */
export class CuSkew {
  private readonly moments: CuMoments;

  constructor() {
    this.moments = new CuMoments({ order: 3 });
  }

  update(x: number): { mean: number; variance: number; skew: number } {
    const { u, u2, u3 } = this.moments.update(x);
    const skew = u2 === 0 ? 0 : u3 / Math.pow(u2, 1.5);
    return { mean: u, variance: u2, skew };
  }
}

/**
 * O(1) cumulative kurtosis.
 */
export class CuKurt {
  private readonly moments: CuMoments;

  constructor() {
    this.moments = new CuMoments({ order: 4 });
  }

  update(x: number): { mean: number; variance: number; kurt: number } {
    const { u, u2, u4 } = this.moments.update(x);
    const kurt = u2 === 0 ? 0 : u4! / (u2 * u2) - 3;
    return { mean: u, variance: u2, kurt };
  }
}

import { SMA } from "./average.js";
import { center_moment } from "../utils/misc.js";

/**
 * O(1) rolling moments up to 3rd or 4th order.
 * Stores powers in buffers and uses SMAs for speed.
 */
class RollingMoments {
  private readonly sma1: SMA;
  private readonly sma2: SMA;
  private readonly sma3: SMA;
  private readonly sma4?: SMA;
  private readonly order: 3 | 4;

  constructor(opts: { period: number; order: 3 | 4 }) {
    this.order = opts.order;
    this.sma1 = new SMA({ period: opts.period });
    this.sma2 = new SMA({ period: opts.period });
    this.sma3 = new SMA({ period: opts.period });
    if (this.order === 4) {
      this.sma4 = new SMA({ period: opts.period });
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

    const m = this.sma1.update(x);
    const m2 = this.sma2.update(x2);
    const m3 = this.sma3.update(x3);

    if (this.order === 4) {
      const x4 = x2 * x2;
      const m4 = this.sma4!.update(x4);
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
 * O(1) rolling skewness.
 * @group Rolling Statistics
 */
export class RollingSkew {
  private readonly moments: RollingMoments;

  constructor(opts: { period: number }) {
    this.moments = new RollingMoments({ period: opts.period, order: 3 });
  }

  update(x: number): { mean: number; variance: number; skew: number } {
    const { u, u2, u3 } = this.moments.update(x);
    const skew = u2 === 0 ? 0 : u3 / Math.pow(u2, 1.5);
    return { mean: u, variance: u2, skew };
  }
}

/**
 * O(1) rolling kurtosis.
 * @group Rolling Statistics
 */
export class RollingKurt {
  private readonly moments: RollingMoments;

  constructor(opts: { period: number }) {
    this.moments = new RollingMoments({ period: opts.period, order: 4 });
  }

  update(x: number): { mean: number; variance: number; kurt: number } {
    const { u, u2, u4 } = this.moments.update(x);
    const kurt = u2 === 0 ? 0 : u4! / (u2 * u2) - 3;
    return { mean: u, variance: u2, kurt };
  }
}

import { CuStddev } from "./stats.js";
import { CMA } from "./average.js";
import { Kahan } from "../numeric/accum.js";

/**
 * Tracks downside mean and standard deviation (semi-deviation).
 * Only considers returns below the threshold (typically riskfree rate).
 */
export class DownStats {
  private readonly std: CuStddev;
  private threshold: number;

  get value(): { mean: number; stddev: number } {
    return this.std.value;
  }

  /**
   * @param opts.threshold Returns below this are considered downside (default: 0)
   */
  constructor(opts?: { threshold?: number }) {
    this.threshold = opts?.threshold ?? 0;
    this.std = new CuStddev({ ddof: 1 });
  }

  /**
   * @param ret Return value
   * @returns Mean and stddev of downside returns, 0 if no downside yet
   */
  update(ret: number): { mean: number; stddev: number } {
    if (ret < this.threshold) {
      return this.std.update(ret - this.threshold);
    }
    return this.std.value;
  }

  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }
}

/**
 * Running Sharpe ratio: (mean_return - riskfree) / stddev_return
 * Uses sample standard deviation (ddof=1) per industry convention.
 */
export class RunningSharpe {
  private readonly stats: CuStddev;
  private riskfree: number;

  get value(): number {
    const { mean, stddev } = this.stats.value;

    if (stddev === 0) return 0;
    return (mean - this.riskfree) / stddev;
  }

  /**
   * @param opts.riskfree Risk-free rate per period (default: 0)
   */
  constructor(opts?: { riskfree?: number }) {
    this.riskfree = opts?.riskfree ?? 0;
    this.stats = new CuStddev({ ddof: 1 });
  }

  /**
   * @param ret Period return (e.g., (price_t - price_{t-1}) / price_{t-1}), not cumulative
   * @returns Current Sharpe ratio
   */
  update(ret: number): number {
    const { mean, stddev } = this.stats.update(ret);

    if (stddev === 0) return 0;
    return (mean - this.riskfree) / stddev;
  }
}

/**
 * Running Sortino ratio: (mean_return - riskfree) / downside_stddev
 * Similar to Sharpe but only penalizes downside volatility.
 * Uses sample standard deviation (ddof=1) per industry convention.
 */
export class RunningSortino {
  private readonly downside: DownStats;
  private readonly mean: CMA = new CMA();
  private riskfree: number;

  get value(): number {
    const avgReturn = this.mean.value;
    const { stddev } = this.downside.value;

    if (stddev === 0) return 0;
    return (avgReturn - this.riskfree) / stddev;
  }

  /**
   * @param opts.riskfree Risk-free rate per period (default: 0)
   */
  constructor(opts?: { riskfree?: number }) {
    this.riskfree = opts?.riskfree ?? 0;
    this.downside = new DownStats({ threshold: this.riskfree });
  }

  /**
   * @param ret Period return (e.g., (price_t - price_{t-1}) / price_{t-1}), not cumulative
   * @returns Current Sortino ratio
   */
  update(ret: number): number {
    const avgReturn = this.mean.update(ret);
    const { stddev } = this.downside.update(ret);

    if (stddev === 0) return 0;
    return (avgReturn - this.riskfree) / stddev;
  }
}

/**
 * Running win rate (hit ratio): percentage of positive returns.
 */
export class RunningWinRate {
  private wins: number = 0;
  private total: number = 0;
  private threshold: number;

  get value(): number {
    return this.total === 0 ? 0 : this.wins / this.total;
  }

  /**
   * @param opts.threshold Returns above this are considered wins (default: 0)
   */
  constructor(opts?: { threshold?: number }) {
    this.threshold = opts?.threshold ?? 0;
  }

  /**
   * @param ret Period return
   * @returns Current win rate [0, 1]
   */
  update(ret: number): number {
    this.total++;
    if (ret > this.threshold) {
      this.wins++;
    }

    return this.value;
  }
}

/**
 * Running gain/loss ratio: average_gain / average_loss.
 */
export class RunningGainLoss {
  private readonly gainMean: CMA = new CMA();
  private readonly lossMean: CMA = new CMA();
  private threshold: number;

  get value(): number {
    const avgGain = this.gainMean.value;
    const avgLoss = this.lossMean.value;
    if (avgLoss === 0) return 0;
    return avgGain / Math.abs(avgLoss);
  }

  /**
   * @param opts.threshold Returns above this are gains, below are losses (default: 0)
   */
  constructor(opts?: { threshold?: number }) {
    this.threshold = opts?.threshold ?? 0;
  }

  /**
   * @param ret Period return
   * @returns Current gain/loss ratio, or 0 if no losses yet
   */
  update(ret: number): number {
    if (ret > this.threshold) {
      this.gainMean.update(ret);
    } else if (ret < this.threshold) {
      this.lossMean.update(ret);
    }

    return this.value;
  }
}

/**
 * Running expectancy: (win_rate × avg_gain) - (loss_rate × avg_loss).
 */
export class RunningExpectancy {
  private readonly gainMean: CMA = new CMA();
  private readonly lossMean: CMA = new CMA();
  private nGains: number = 0;
  private nLosses: number = 0;
  private total: number = 0;
  private threshold: number;

  get value(): number {
    const avgGain = this.gainMean.value;
    const avgLoss = this.lossMean.value;
    const winRate = this.total === 0 ? 0 : this.nGains / this.total;
    const lossRate = this.total === 0 ? 0 : this.nLosses / this.total;
    return winRate * avgGain - lossRate * Math.abs(avgLoss);
  }

  /**
   * @param opts.threshold Returns above this are gains, below are losses (default: 0)
   */
  constructor(opts?: { threshold?: number }) {
    this.threshold = opts?.threshold ?? 0;
  }

  /**
   * @param ret Period return
   * @returns Current expectancy
   */
  update(ret: number): number {
    this.total++;
    if (ret > this.threshold) {
      this.nGains++;
      this.gainMean.update(ret);
    } else if (ret < this.threshold) {
      this.nLosses++;
      this.lossMean.update(ret);
    }

    return this.value;
  }
}

/**
 * Running profit factor: sum_of_gains / sum_of_losses.
 */
export class RunningProfitFactor {
  private readonly gainSum: Kahan = new Kahan();
  private readonly lossSum: Kahan = new Kahan();
  private threshold: number;

  get value(): number {
    if (this.lossSum.val === 0) return 0;
    return this.gainSum.val / this.lossSum.val;
  }

  /**
   * @param opts.threshold Returns above this are gains, below are losses (default: 0)
   */
  constructor(opts?: { threshold?: number }) {
    this.threshold = opts?.threshold ?? 0;
  }

  /**
   * @param ret Period return
   * @returns Current profit factor, or 0 if no losses yet
   */
  update(ret: number): number {
    if (ret > this.threshold) {
      this.gainSum.accum(ret);
    } else if (ret < this.threshold) {
      this.lossSum.accum(Math.abs(ret));
    }

    return this.value;
  }
}

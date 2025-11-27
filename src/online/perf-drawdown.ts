/**
 * @template T Time type
 * @group Performance Analysis - Online
 */
export interface RunningDrawResult<T> {
  value: number;
  max: number;
  maxFrom: T;
  maxTo: T;
}

/**
 * Tracks absolute drawdown as peak - value.
 * @template T Time type (default: Date)
 * @group Performance Analysis - Online
 */
export class RunningDrawdown<T = Date> {
  private peak: number;
  private peakTime: T;
  private max: number = 0;
  private maxFrom: T;
  private maxTo: T;
  private dd: number = 0;

  get value(): RunningDrawResult<T> {
    return {
      value: this.dd,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T) {
    this.peak = initValue;
    this.peakTime = initTime;
    this.maxFrom = initTime;
    this.maxTo = initTime;
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawdown, max drawdown, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    // New peak
    if (value > this.peak) {
      this.peak = value;
      this.peakTime = time;
    }

    // Absolute drawdown: simple difference
    this.dd = this.peak - value;

    if (this.dd > this.max) {
      this.max = this.dd;
      this.maxFrom = this.peakTime;
      this.maxTo = time;
    }

    return this.value;
  }
}

/**
 * Tracks absolute drawup as value - trough.
 * @template T Time type (default: Date)
 * @group Performance Analysis - Online
 */
export class RunningDrawup<T = Date> {
  private trough: number;
  private troughTime: T;
  private max: number = 0;
  private maxFrom: T;
  private maxTo: T;
  private du: number = 0;

  get value(): RunningDrawResult<T> {
    return {
      value: this.du,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T) {
    this.trough = initValue;
    this.troughTime = initTime;
    this.maxFrom = initTime;
    this.maxTo = initTime;
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawup, max drawup, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    // New trough
    if (value < this.trough) {
      this.trough = value;
      this.troughTime = time;
    }

    // Absolute drawup: simple difference
    this.du = value - this.trough;

    if (this.du > this.max) {
      this.max = this.du;
      this.maxFrom = this.troughTime;
      this.maxTo = time;
    }

    return this.value;
  }
}

/**
 * Tracks relative drawdown as (peak - value) / peak.
 * @template T Time type (default: Date)
 * @throws {Error} If initValue <= 0
 * @note Mathematically invalid if values cross zero
 * @group Performance Analysis - Online
 */
export class RunningRelDrawdown<T = Date> {
  private peak: number;
  private peakTime: T;
  private max: number = 0;
  private maxFrom: T;
  private maxTo: T;
  private dd: number = 0;

  get value(): RunningDrawResult<T> {
    return {
      value: this.dd,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T) {
    this.peak = initValue;
    this.peakTime = initTime;
    this.maxFrom = initTime;
    this.maxTo = initTime;
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current relative drawdown, max drawdown, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    // New peak
    if (value > this.peak) {
      this.peak = value;
      this.peakTime = time;
    }

    // Relative drawdown: (peak - value) / peak
    this.dd = (this.peak - value) / this.peak;

    if (this.dd > this.max) {
      this.max = this.dd;
      this.maxFrom = this.peakTime;
      this.maxTo = time;
    }

    return this.value;
  }
}

/**
 * Tracks relative drawup as (value - trough) / trough.
 * @template T Time type (default: Date)
 * @throws {Error} If initValue <= 0
 * @note Mathematically invalid if values cross zero
 * @group Performance Analysis - Online
 */
export class RunningRelDrawup<T = Date> {
  private trough: number;
  private troughTime: T;
  private max: number = 0;
  private maxFrom: T;
  private maxTo: T;
  private du: number = 0;

  get value(): RunningDrawResult<T> {
    return {
      value: this.du,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }
  constructor(initValue: number, initTime: T) {
    this.trough = initValue;
    this.troughTime = initTime;
    this.maxFrom = initTime;
    this.maxTo = initTime;
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current relative drawup, max drawup, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    // New trough
    if (value < this.trough) {
      this.trough = value;
      this.troughTime = time;
    }

    // Relative drawup: (value - trough) / trough
    this.du = (value - this.trough) / this.trough;

    if (this.du > this.max) {
      this.max = this.du;
      this.maxFrom = this.troughTime;
      this.maxTo = time;
    }

    return this.value;
  }
}

/**
 * @template T Time type
 * @group Performance Analysis - Online
 */
export interface RunningDrawDurationResult<T> {
  duration: number;
  longest: number;
  longestFrom: T;
  longestTo: T;
}

/**
 * Tracks longest drawdown duration (time from peak to recovery).
 * @template T Time type (default: Date)
 * @group Performance Analysis - Online
 */
export class RunningLongestDrawdown<T = Date> {
  private peak: number;
  private peakTime: T;
  private readonly computeDuration: (from: T, to: T) => number;

  private v: RunningDrawDurationResult<T>;

  get value(): RunningDrawDurationResult<T> {
    return { ...this.v };
  }

  /**
   * @param initValue Initial value
   * @param initTime Initial time
   * @param computeDuration Function to compute duration between two time points (defaults to Date millisecond difference)
   */
  constructor(
    initValue: number,
    initTime: T,
    computeDuration?: (from: T, to: T) => number
  ) {
    this.peak = initValue;
    this.peakTime = initTime;
    this.computeDuration =
      computeDuration ??
      ((from: T, to: T) => (to as any).getTime() - (from as any).getTime());
    this.v = {
      duration: 0,
      longest: 0,
      longestFrom: initTime,
      longestTo: initTime,
    };
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawdown duration, longest duration, and longest period [from, to]
   */
  update(value: number, time: T): RunningDrawDurationResult<T> {
    const currentDuration = this.computeDuration(this.peakTime, time);

    // New peak - finalize previous drawdown period
    if (value > this.peak) {
      this.v.duration = 0;
      if (currentDuration > this.v.longest) {
        this.v.longest = currentDuration;
        this.v.longestFrom = this.peakTime;
        this.v.longestTo = time;
      }

      this.peak = value;
      this.peakTime = time;

      return this.value;
    }

    // Still in drawdown - current might be the longest
    if (currentDuration > this.v.longest) {
      this.v.duration = currentDuration;
      this.v.longest = currentDuration;
      this.v.longestFrom = this.peakTime;
      this.v.longestTo = time;

      return this.value;
    }

    this.v.duration = currentDuration;

    return this.value;
  }
}

/**
 * Tracks longest drawup duration (time from trough to recovery).
 * @template T Time type (default: Date)
 * @group Performance Analysis - Online
 */
export class RunningLongestDrawup<T = Date> {
  private trough: number;
  private troughTime: T;
  private readonly computeDuration: (from: T, to: T) => number;

  private v: RunningDrawDurationResult<T>;

  get value(): RunningDrawDurationResult<T> {
    return { ...this.v };
  }

  /**
   * @param initValue Initial value
   * @param initTime Initial time
   * @param computeDuration Function to compute duration between two time points (defaults to Date millisecond difference)
   */
  constructor(
    initValue: number,
    initTime: T,
    computeDuration?: (from: T, to: T) => number
  ) {
    this.trough = initValue;
    this.troughTime = initTime;
    this.computeDuration =
      computeDuration ??
      ((from: T, to: T) => (to as any).getTime() - (from as any).getTime());
    this.v = {
      duration: 0,
      longest: 0,
      longestFrom: initTime,
      longestTo: initTime,
    };
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawup duration, longest duration, and longest period [from, to]
   */
  update(value: number, time: T): RunningDrawDurationResult<T> {
    const currentDuration = this.computeDuration(this.troughTime, time);

    // New trough - finalize previous drawup period
    if (value < this.trough) {
      this.v.duration = 0;
      if (currentDuration > this.v.longest) {
        this.v.longest = currentDuration;
        this.v.longestFrom = this.troughTime;
        this.v.longestTo = time;
      }

      this.trough = value;
      this.troughTime = time;

      return this.value;
    }

    // Still in drawup - current might be the longest
    if (currentDuration > this.v.longest) {
      this.v.duration = currentDuration;
      this.v.longest = currentDuration;
      this.v.longestFrom = this.troughTime;
      this.v.longestTo = time;

      return this.value;
    }

    this.v.duration = currentDuration;

    return this.value;
  }
}

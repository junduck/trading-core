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
  private isInitialized: boolean = false;
  private peak!: number;
  private peakTime!: T;
  private max!: number;
  private maxFrom!: T;
  private maxTo!: T;
  private dd!: number;

  get value(): RunningDrawResult<T> | undefined {
    if (!this.isInitialized) {
      return undefined;
    }

    return {
      value: this.dd,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T);
  constructor();
  constructor(initValue?: number, initTime?: T) {
    if (initValue !== undefined && initTime !== undefined) {
      this.peak = initValue;
      this.peakTime = initTime;
      this.maxFrom = initTime;
      this.maxTo = initTime;
      this.dd = 0;
      this.max = 0;
      this.isInitialized = true;
    }
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawdown, max drawdown, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    if (!this.isInitialized) {
      // First update after reset/construction - establish initial state
      this.peak = value;
      this.peakTime = time;
      this.maxFrom = time;
      this.maxTo = time;
      this.dd = 0;
      this.max = 0;
      this.isInitialized = true;

      return this.value!;
    }

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

    return this.value!;
  }

  reset(): void {
    this.isInitialized = false;
  }
}

/**
 * Tracks absolute drawup as value - trough.
 * @template T Time type (default: Date)
 * @group Performance Analysis - Online
 */
export class RunningDrawup<T = Date> {
  private isInitialized: boolean = false;
  private trough!: number;
  private troughTime!: T;
  private max!: number;
  private maxFrom!: T;
  private maxTo!: T;
  private du!: number;

  get value(): RunningDrawResult<T> | undefined {
    if (!this.isInitialized) {
      return undefined;
    }

    return {
      value: this.du,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T);
  constructor();
  constructor(initValue?: number, initTime?: T) {
    if (initValue !== undefined && initTime !== undefined) {
      this.trough = initValue;
      this.troughTime = initTime;
      this.maxFrom = initTime;
      this.maxTo = initTime;
      this.du = 0;
      this.max = 0;
      this.isInitialized = true;
    }
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawup, max drawup, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    if (!this.isInitialized) {
      this.trough = value;
      this.troughTime = time;
      this.maxFrom = time;
      this.maxTo = time;
      this.du = 0;
      this.max = 0;
      this.isInitialized = true;

      return this.value!;
    }

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

    return this.value!;
  }

  reset(): void {
    this.isInitialized = false;
  }
}

/**
 * Tracks relative drawdown as (peak - value) / peak.
 * @template T Time type (default: Date)
 * @note Mathematically invalid if values cross zero
 * @group Performance Analysis - Online
 */
export class RunningRelDrawdown<T = Date> {
  private isInitialized: boolean = false;
  private peak!: number;
  private peakTime!: T;
  private max!: number;
  private maxFrom!: T;
  private maxTo!: T;
  private dd!: number;

  get value(): RunningDrawResult<T> | undefined {
    if (!this.isInitialized) {
      return undefined;
    }

    return {
      value: this.dd,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T);
  constructor();
  constructor(initValue?: number, initTime?: T) {
    if (initValue !== undefined && initTime !== undefined) {
      this.peak = initValue;
      this.peakTime = initTime;
      this.maxFrom = initTime;
      this.maxTo = initTime;
      this.dd = 0;
      this.max = 0;
      this.isInitialized = true;
    }
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current relative drawdown, max drawdown, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    if (!this.isInitialized) {
      this.peak = value;
      this.peakTime = time;
      this.maxFrom = time;
      this.maxTo = time;
      this.dd = 0;
      this.max = 0;
      this.isInitialized = true;

      return this.value!;
    }

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

    return this.value!;
  }

  reset(): void {
    this.isInitialized = false;
  }
}

/**
 * Tracks relative drawup as (value - trough) / trough.
 * @template T Time type (default: Date)
 * @note Mathematically invalid if values cross zero
 * @group Performance Analysis - Online
 */
export class RunningRelDrawup<T = Date> {
  private isInitialized: boolean = false;
  private trough!: number;
  private troughTime!: T;
  private max!: number;
  private maxFrom!: T;
  private maxTo!: T;
  private du!: number;

  get value(): RunningDrawResult<T> | undefined {
    if (!this.isInitialized) {
      return undefined;
    }

    return {
      value: this.du,
      max: this.max,
      maxFrom: this.maxFrom,
      maxTo: this.maxTo,
    };
  }

  constructor(initValue: number, initTime: T);
  constructor();
  constructor(initValue?: number, initTime?: T) {
    if (initValue !== undefined && initTime !== undefined) {
      this.trough = initValue;
      this.troughTime = initTime;
      this.maxFrom = initTime;
      this.maxTo = initTime;
      this.du = 0;
      this.max = 0;
      this.isInitialized = true;
    }
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current relative drawup, max drawup, and max period [from, to]
   */
  update(value: number, time: T): RunningDrawResult<T> {
    if (!this.isInitialized) {
      this.trough = value;
      this.troughTime = time;
      this.maxFrom = time;
      this.maxTo = time;
      this.du = 0;
      this.max = 0;
      this.isInitialized = true;

      return this.value!;
    }

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

    return this.value!;
  }

  reset(): void {
    this.isInitialized = false;
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
  private isInitialized: boolean = false;
  private peak!: number;
  private peakTime!: T;
  private readonly computeDuration: (from: T, to: T) => number;

  private v!: RunningDrawDurationResult<T>;

  get value(): RunningDrawDurationResult<T> | undefined {
    if (!this.isInitialized) {
      return undefined;
    }

    return { ...this.v };
  }

  constructor(
    initValue: number,
    initTime: T,
    computeDuration?: (from: T, to: T) => number
  );
  constructor(computeDuration?: (from: T, to: T) => number);
  constructor(
    initValueOrComputeDuration?: number | ((from: T, to: T) => number),
    initTime?: T,
    computeDuration?: (from: T, to: T) => number
  ) {
    if (
      typeof initValueOrComputeDuration === "number" &&
      initTime !== undefined
    ) {
      this.peak = initValueOrComputeDuration;
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
      this.isInitialized = true;
    } else {
      this.computeDuration =
        (initValueOrComputeDuration as
          | ((from: T, to: T) => number)
          | undefined) ??
        ((from: T, to: T) => (to as any).getTime() - (from as any).getTime());
    }
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawdown duration, longest duration, and longest period [from, to]
   */
  update(value: number, time: T): RunningDrawDurationResult<T> {
    if (!this.isInitialized) {
      this.peak = value;
      this.peakTime = time;
      this.v = {
        duration: 0,
        longest: 0,
        longestFrom: time,
        longestTo: time,
      };
      this.isInitialized = true;

      return this.value!;
    }

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

      return this.value!;
    }

    // Still in drawdown - current might be the longest
    if (currentDuration > this.v.longest) {
      this.v.duration = currentDuration;
      this.v.longest = currentDuration;
      this.v.longestFrom = this.peakTime;
      this.v.longestTo = time;

      return this.value!;
    }

    this.v.duration = currentDuration;

    return this.value!;
  }

  reset(): void {
    this.isInitialized = false;
  }
}

/**
 * Tracks longest drawup duration (time from trough to recovery).
 * @template T Time type (default: Date)
 * @group Performance Analysis - Online
 */
export class RunningLongestDrawup<T = Date> {
  private isInitialized: boolean = false;
  private trough!: number;
  private troughTime!: T;
  private readonly computeDuration: (from: T, to: T) => number;

  private v!: RunningDrawDurationResult<T>;

  get value(): RunningDrawDurationResult<T> | undefined {
    if (!this.isInitialized) {
      return undefined;
    }

    return { ...this.v };
  }

  constructor(
    initValue: number,
    initTime: T,
    computeDuration?: (from: T, to: T) => number
  );
  constructor(computeDuration?: (from: T, to: T) => number);
  constructor(
    initValueOrComputeDuration?: number | ((from: T, to: T) => number),
    initTime?: T,
    computeDuration?: (from: T, to: T) => number
  ) {
    if (
      typeof initValueOrComputeDuration === "number" &&
      initTime !== undefined
    ) {
      this.trough = initValueOrComputeDuration;
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
      this.isInitialized = true;
    } else {
      this.computeDuration =
        (initValueOrComputeDuration as
          | ((from: T, to: T) => number)
          | undefined) ??
        ((from: T, to: T) => (to as any).getTime() - (from as any).getTime());
    }
  }

  /**
   * @param value Current value
   * @param time Current time
   * @returns Current drawup duration, longest duration, and longest period [from, to]
   */
  update(value: number, time: T): RunningDrawDurationResult<T> {
    if (!this.isInitialized) {
      this.trough = value;
      this.troughTime = time;
      this.v = {
        duration: 0,
        longest: 0,
        longestFrom: time,
        longestTo: time,
      };
      this.isInitialized = true;

      return this.value!;
    }

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

      return this.value!;
    }

    // Still in drawup - current might be the longest
    if (currentDuration > this.v.longest) {
      this.v.duration = currentDuration;
      this.v.longest = currentDuration;
      this.v.longestFrom = this.troughTime;
      this.v.longestTo = time;

      return this.value!;
    }

    this.v.duration = currentDuration;

    return this.value!;
  }

  reset(): void {
    this.isInitialized = false;
  }
}

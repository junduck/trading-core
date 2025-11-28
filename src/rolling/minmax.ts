import { CircularBuffer } from "../containers/circular-buffer.js";
import { Deque } from "../containers/deque.js";

/**
 * Rolling minimum over a sliding window using monotonic deque.
 * O(1) amortized time per update.
 * @group Rolling Statistics
 */
export class RollingMin {
  readonly buffer: CircularBuffer<number>;
  private minDeque: Deque<number>;

  get value(): number {
    return this.minDeque.empty() ? Infinity : this.minDeque.front()!;
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    // Monotonic deque primarily push_back, so allocate 1.5x to avoid rebalancing
    this.minDeque = new Deque(Math.ceil(opts.period * 1.5));
  }

  update(x: number): number {
    if (this.buffer.full()) {
      const old = this.buffer.front()!;
      if (!this.minDeque.empty() && this.minDeque.front() === old) {
        this.minDeque.pop_front();
      }
    }

    this.buffer.push(x);

    while (!this.minDeque.empty() && this.minDeque.back()! >= x) {
      this.minDeque.pop_back();
    }
    this.minDeque.push_back(x);

    return this.minDeque.front()!;
  }

  reset(): void {
    this.buffer.clear();
    this.minDeque.clear();
  }
}

/**
 * Rolling maximum over a sliding window using monotonic deque.
 * O(1) amortized time per update.
 * @group Rolling Statistics
 */
export class RollingMax {
  readonly buffer: CircularBuffer<number>;
  private maxDeque: Deque<number>;

  get value(): number {
    return this.maxDeque.empty() ? -Infinity : this.maxDeque.front()!;
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    // Monotonic deque primarily push_back, so allocate 1.5x to avoid rebalancing
    this.maxDeque = new Deque(Math.ceil(opts.period * 1.5));
  }

  update(x: number): number {
    if (this.buffer.full()) {
      const old = this.buffer.front()!;
      if (!this.maxDeque.empty() && this.maxDeque.front() === old) {
        this.maxDeque.pop_front();
      }
    }

    this.buffer.push(x);

    while (!this.maxDeque.empty() && this.maxDeque.back()! <= x) {
      this.maxDeque.pop_back();
    }
    this.maxDeque.push_back(x);

    return this.maxDeque.front()!;
  }

  reset(): void {
    this.buffer.clear();
    this.maxDeque.clear();
  }
}

/**
 * Rolling minimum and maximum over a sliding window.
 * O(1) amortized time per update.
 * @group Rolling Statistics
 */
export class RollingMinMax {
  readonly buffer: CircularBuffer<number>;
  private minDeque: Deque<number>;
  private maxDeque: Deque<number>;

  get value(): { min: number; max: number } {
    return {
      min: this.minDeque.empty() ? Infinity : this.minDeque.front()!,
      max: this.maxDeque.empty() ? -Infinity : this.maxDeque.front()!,
    };
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    // Monotonic deque primarily push_back, so allocate 1.5x to avoid rebalancing
    const dequeCapacity = Math.ceil(opts.period * 1.5);
    this.minDeque = new Deque(dequeCapacity);
    this.maxDeque = new Deque(dequeCapacity);
  }

  update(x: number): { min: number; max: number } {
    if (this.buffer.full()) {
      const old = this.buffer.front()!;
      if (!this.minDeque.empty() && this.minDeque.front() === old) {
        this.minDeque.pop_front();
      }
      if (!this.maxDeque.empty() && this.maxDeque.front() === old) {
        this.maxDeque.pop_front();
      }
    }

    this.buffer.push(x);

    while (!this.minDeque.empty() && this.minDeque.back()! >= x) {
      this.minDeque.pop_back();
    }
    this.minDeque.push_back(x);

    while (!this.maxDeque.empty() && this.maxDeque.back()! <= x) {
      this.maxDeque.pop_back();
    }
    this.maxDeque.push_back(x);

    return {
      min: this.minDeque.front()!,
      max: this.maxDeque.front()!,
    };
  }

  reset(): void {
    this.buffer.clear();
    this.minDeque.clear();
    this.maxDeque.clear();
  }
}

/**
 * Rolling minimum with position tracking over a sliding window.
 * Returns both minimum value and its index within the window (0 = oldest).
 * O(1) amortized time per update.
 * @group Rolling Statistics
 */
export class RollingArgMin {
  readonly buffer: CircularBuffer<number>;
  private minDeque: Deque<{ val: number; pos: number }>;
  private readonly period: number;
  private position: number = 0;

  get value(): { val: number; pos: number } {
    if (this.minDeque.empty()) {
      return { val: Infinity, pos: 0 };
    }
    const front = this.minDeque.front()!;
    return { val: front.val, pos: this.position - front.pos - 1 };
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    // Monotonic deque primarily push_back, so allocate 1.5x to avoid rebalancing
    this.minDeque = new Deque(Math.ceil(opts.period * 1.5));
    this.period = opts.period;
  }

  update(x: number): { val: number; pos: number } {
    this.buffer.push(x);

    // Remove elements outside window
    while (
      !this.minDeque.empty() &&
      this.position - this.minDeque.front()!.pos >= this.period
    ) {
      this.minDeque.pop_front();
    }

    // Maintain monotonic property
    while (!this.minDeque.empty() && this.minDeque.back()!.val >= x) {
      this.minDeque.pop_back();
    }
    this.minDeque.push_back({ val: x, pos: this.position });

    this.position++;

    const front = this.minDeque.front()!;
    return { val: front.val, pos: this.position - front.pos - 1 };
  }

  reset(): void {
    this.buffer.clear();
    this.minDeque.clear();
    this.position = 0;
  }
}

/**
 * Rolling maximum with position tracking over a sliding window.
 * Returns both maximum value and its index within the window (0 = oldest).
 * O(1) amortized time per update.
 * @group Rolling Statistics
 */
export class RollingArgMax {
  readonly buffer: CircularBuffer<number>;
  private maxDeque: Deque<{ val: number; pos: number }>;
  private readonly period: number;
  private position: number = 0;

  get value(): { val: number; pos: number } {
    if (this.maxDeque.empty()) {
      return { val: -Infinity, pos: 0 };
    }
    const front = this.maxDeque.front()!;
    return { val: front.val, pos: this.position - front.pos - 1 };
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    // Monotonic deque primarily push_back, so allocate 1.5x to avoid rebalancing
    this.maxDeque = new Deque(Math.ceil(opts.period * 1.5));
    this.period = opts.period;
  }

  update(x: number): { val: number; pos: number } {
    this.buffer.push(x);

    // Remove elements outside window
    while (
      !this.maxDeque.empty() &&
      this.position - this.maxDeque.front()!.pos >= this.period
    ) {
      this.maxDeque.pop_front();
    }

    // Maintain monotonic property
    while (!this.maxDeque.empty() && this.maxDeque.back()!.val <= x) {
      this.maxDeque.pop_back();
    }
    this.maxDeque.push_back({ val: x, pos: this.position });

    this.position++;

    const front = this.maxDeque.front()!;
    return { val: front.val, pos: this.position - front.pos - 1 };
  }

  reset(): void {
    this.buffer.clear();
    this.maxDeque.clear();
    this.position = 0;
  }
}

/**
 * Rolling minimum and maximum with position tracking over a sliding window.
 * Returns both min/max values and their indices within the window (0 = oldest).
 * O(1) amortized time per update.
 * @group Rolling Statistics
 */
export class RollingArgMinMax {
  readonly buffer: CircularBuffer<number>;
  private minDeque: Deque<{ val: number; pos: number }>;
  private maxDeque: Deque<{ val: number; pos: number }>;
  private readonly period: number;
  private position: number = 0;

  get value(): {
    min: { val: number; pos: number };
    max: { val: number; pos: number };
  } {
    const minFront = this.minDeque.front();
    const maxFront = this.maxDeque.front();

    return {
      min: minFront
        ? { val: minFront.val, pos: this.position - minFront.pos - 1 }
        : { val: Infinity, pos: 0 },
      max: maxFront
        ? { val: maxFront.val, pos: this.position - maxFront.pos - 1 }
        : { val: -Infinity, pos: 0 },
    };
  }

  constructor(opts: { period: number }) {
    this.buffer = new CircularBuffer<number>(opts.period);
    // Monotonic deque primarily push_back, so allocate 1.5x to avoid rebalancing
    const dequeCapacity = Math.ceil(opts.period * 1.5);
    this.minDeque = new Deque(dequeCapacity);
    this.maxDeque = new Deque(dequeCapacity);
    this.period = opts.period;
  }

  update(x: number): {
    min: { val: number; pos: number };
    max: { val: number; pos: number };
  } {
    this.buffer.push(x);

    // Remove elements outside window
    while (
      !this.minDeque.empty() &&
      this.position - this.minDeque.front()!.pos >= this.period
    ) {
      this.minDeque.pop_front();
    }
    while (
      !this.maxDeque.empty() &&
      this.position - this.maxDeque.front()!.pos >= this.period
    ) {
      this.maxDeque.pop_front();
    }

    // Maintain monotonic property for min
    while (!this.minDeque.empty() && this.minDeque.back()!.val >= x) {
      this.minDeque.pop_back();
    }
    this.minDeque.push_back({ val: x, pos: this.position });

    // Maintain monotonic property for max
    while (!this.maxDeque.empty() && this.maxDeque.back()!.val <= x) {
      this.maxDeque.pop_back();
    }
    this.maxDeque.push_back({ val: x, pos: this.position });

    this.position++;

    const minFront = this.minDeque.front()!;
    const maxFront = this.maxDeque.front()!;

    return {
      min: { val: minFront.val, pos: this.position - minFront.pos - 1 },
      max: { val: maxFront.val, pos: this.position - maxFront.pos - 1 },
    };
  }

  reset(): void {
    this.buffer.clear();
    this.minDeque.clear();
    this.maxDeque.clear();
    this.position = 0;
  }
}

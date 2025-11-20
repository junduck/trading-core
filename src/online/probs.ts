/**
 * Count-Min Sketch for frequency estimation in data streams.
 * O(1) update and query with configurable error bounds.
 * Error is within epsilon * N with probability 1 - delta, where N is total count.
 * @group Online Statistics
 */
export class CountMinSketch<T = string> {
  private readonly width: number;
  private readonly depth: number;
  private readonly counters: number[][];
  private readonly hash: (key: T) => number;

  /**
   * @param opts.width Table width (rounded to power of 2)
   * @param opts.depth Number of hash functions
   * @param opts.epsilon Error bound (alternative to width)
   * @param opts.delta Probability bound (alternative to depth)
   * @param opts.hash Custom hash function
   */
  constructor(
    opts: (
      | { width: number; depth: number }
      | { epsilon: number; delta: number }
    ) & { hash?: (key: T) => number }
  ) {
    if ("width" in opts) {
      this.width = nextPowerOfTwo(opts.width);
      this.depth = opts.depth;
    } else {
      this.width = nextPowerOfTwo(Math.ceil(Math.E / opts.epsilon));
      this.depth = Math.ceil(Math.log(1 / opts.delta));
    }

    this.counters = Array.from({ length: this.depth }, () =>
      new Array(this.width).fill(0)
    );

    this.hash = opts.hash || defaultHash;
  }

  /**
   * Increment count for a key.
   * @param key Key to increment
   * @param count Count to add (default 1)
   */
  update(key: T, count: number = 1): void {
    const baseHash = this.hash(key);
    for (let i = 0; i < this.depth; i++) {
      const col = this.hashForRow(baseHash, i);
      this.counters[i]![col]! += count;
    }
  }

  /**
   * Estimate frequency of a key.
   * @param key Key to query
   * @returns Estimated count (upper bound)
   */
  query(key: T): number {
    const baseHash = this.hash(key);
    let min = Infinity;
    for (let i = 0; i < this.depth; i++) {
      const col = this.hashForRow(baseHash, i);
      min = Math.min(min, this.counters[i]![col]!);
    }
    return min;
  }

  private hashForRow(baseHash: number, row: number): number {
    let h = baseHash ^ ((row * 2654435761) >>> 0);
    h ^= h >>> 16;
    h = (h * 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    // h = (h * 0xc2b2ae35) >>> 0;
    // h ^= h >>> 16;
    return h & (this.width - 1);
  }
}

function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1;
  return 1 << (32 - Math.clz32(n - 1));
}

function defaultHash(key: unknown): number {
  const str = String(key);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash;
}

/**
 * Bloom filter for membership testing in data streams.
 * O(k) add and test where k is number of hash functions.
 * May have false positives but no false negatives.
 * @group Online Statistics
 */
export class BloomFilter<T = string> {
  private readonly size: number;
  private readonly numHashes: number;
  private readonly bits: Uint32Array;
  private readonly hash: (key: T) => number;

  /**
   * @param opts.size Bit array size (rounded to power of 2)
   * @param opts.numHashes Number of hash functions
   * @param opts.expectedItems Expected number of items (alternative to size)
   * @param opts.falsePositiveRate Target false positive rate (alternative to numHashes)
   * @param opts.hash Custom hash function
   */
  constructor(
    opts: (
      | { size: number; numHashes: number }
      | { expectedItems: number; falsePositiveRate: number }
    ) & { hash?: (key: T) => number }
  ) {
    if ("size" in opts) {
      this.size = nextPowerOfTwo(opts.size);
      this.numHashes = opts.numHashes;
    } else {
      const n = opts.expectedItems;
      const p = opts.falsePositiveRate;
      const m = Math.ceil(-(n * Math.log(p)) / (Math.LN2 * Math.LN2));
      this.size = nextPowerOfTwo(m);
      this.numHashes = Math.max(1, Math.round((this.size / n) * Math.LN2));
    }

    this.bits = new Uint32Array(Math.ceil(this.size / 32));
    this.hash = opts.hash || defaultHash;
  }

  /**
   * Add a key to the filter.
   */
  add(key: T): void {
    const baseHash = this.hash(key);
    for (let i = 0; i < this.numHashes; i++) {
      const idx = this.hashForIndex(baseHash, i);
      this.bits[idx >>> 5]! |= 1 << (idx & 31);
    }
  }

  /**
   * Test if a key may be in the filter.
   * @returns false = definitely not present, true = possibly present
   */
  has(key: T): boolean {
    const baseHash = this.hash(key);
    for (let i = 0; i < this.numHashes; i++) {
      const idx = this.hashForIndex(baseHash, i);
      if ((this.bits[idx >>> 5]! & (1 << (idx & 31))) === 0) {
        return false;
      }
    }
    return true;
  }

  private hashForIndex(baseHash: number, i: number): number {
    let h = baseHash ^ ((i * 2654435761) >>> 0);
    h ^= h >>> 16;
    h = (h * 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    return h & (this.size - 1);
  }
}

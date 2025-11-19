/**
 * Cumulative histogram over entire data stream.
 * Maintains frequency distribution across fixed bins.
 */
export class CuHistogram {
  private readonly edges: readonly number[];
  private readonly counts: number[];
  private n: number = 0;

  /**
   * @param opts.edges Sorted bin edges defining (n+1) bins:
   *   - Bin 0: values < edges[0] (underflow)
   *   - Bin i: [edges[i-1], edges[i]) for i = 1..(n-1)
   *   - Bin n: values >= edges[n-1] (overflow)
   *
   * Example: edges = [0, 10, 20] creates 4 bins:
   *   <0, [0,10), [10,20), >=20
   */
  constructor(opts: { edges: number[] }) {
    this.edges = [...opts.edges];
    this.counts = new Array(opts.edges.length + 1).fill(0);
  }

  /**
   * Process new data point.
   * @param x New value
   * @returns Reference to internal counts array
   */
  update(x: number): readonly number[] {
    this.n++;
    const bin = this.findBin(x);
    this.counts[bin]!++;
    return this.counts;
  }

  /**
   * Get count for a specific bin.
   * @param binIndex 0 = underflow, 1..(n-1) = regular bins, n = overflow
   */
  getCount(binIndex: number): number {
    return this.counts[binIndex] ?? 0;
  }

  /** Get all bin counts */
  getCounts(): readonly number[] {
    return this.counts;
  }

  /** Get bin edges */
  getEdges(): readonly number[] {
    return this.edges;
  }

  /** Get total count of all observations */
  getTotal(): number {
    return this.n;
  }

  /**
   * Get normalized frequencies (probabilities).
   * @returns counts[i] / total_count
   */
  getProbabilities(): number[] {
    if (this.n === 0) return this.counts.map(() => 0);
    return this.counts.map((c) => c / this.n);
  }

  /**
   * Get cumulative distribution.
   * @returns Cumulative sum of probabilities
   */
  getCDF(): number[] {
    const probs = this.getProbabilities();
    const cdf = new Array(probs.length);
    let sum = 0;
    for (let i = 0; i < probs.length; i++) {
      sum += probs[i]!;
      cdf[i] = sum;
    }
    return cdf;
  }

  /**
   * Find bin index for a value.
   * @returns Bin index: 0 = underflow, 1..(n-1) = regular, n = overflow
   */
  private findBin(x: number): number {
    if (this.edges.length === 0) return 0;

    if (x < this.edges[0]!) return 0;

    if (this.edges.length < 64) {
      for (let i = 0; i < this.edges.length; i++) {
        if (x < this.edges[i]!) return i;
      }
      return this.edges.length;
    }

    let left = 0;
    let right = this.edges.length;

    while (left < right) {
      const mid = (left + right) >>> 1;
      if (x < this.edges[mid]!) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }
}

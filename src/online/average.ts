import { Kahan } from "../numeric/accum.js";

/**
 * O(1) cumulative moving average (CMA).
 * @group Online Statistics
 */
export class CMA {
  private cma: Kahan = new Kahan();
  private n: number = 0;

  get value(): number {
    return this.cma.val;
  }

  update(x: number): number {
    this.n++;
    return this.cma.accum((x - this.cma.val) / this.n);
  }

  reset(): void {
    this.cma.reset();
    this.n = 0;
  }
}

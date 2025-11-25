import { Kahan } from "../numeric/accum.js";

/**
 * O(1) cumulative moving average (CMA).
 * @group Online Statistics
 */
export class CMA {
  private cma: Kahan = new Kahan();
  private n: number = 0;

  update(x: number): number {
    this.n++;
    return this.cma.accum((x - this.cma.val) / this.n);
  }
}

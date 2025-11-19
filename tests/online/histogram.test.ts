import { describe, it, expect } from "vitest";
import { CuHistogram } from "../../src/online/histogram";

describe("CuHistogram", () => {
  it("should accumulate bin counts over time", () => {
    const hist = new CuHistogram({ edges: [10, 20, 30] });

    expect([...hist.update(5)]).toEqual([1, 0, 0, 0]);
    expect([...hist.update(15)]).toEqual([1, 1, 0, 0]);
    expect([...hist.update(25)]).toEqual([1, 1, 1, 0]);
    expect([...hist.update(35)]).toEqual([1, 1, 1, 1]);
    expect([...hist.update(5)]).toEqual([2, 1, 1, 1]);
    expect(hist.getTotal()).toBe(5);
  });

  it("should handle underflow and overflow bins", () => {
    const hist = new CuHistogram({ edges: [0, 10] });

    hist.update(-5);
    hist.update(5);
    hist.update(15);
    hist.update(20);

    const counts = hist.getCounts();
    expect(counts[0]).toBe(1);
    expect(counts[1]).toBe(1);
    expect(counts[2]).toBe(2);
    expect(hist.getTotal()).toBe(4);
  });

  it("should compute probabilities and CDF", () => {
    const hist = new CuHistogram({ edges: [10, 20] });

    hist.update(5);
    hist.update(5);
    hist.update(15);
    hist.update(25);

    const probs = hist.getProbabilities();
    expect(probs).toEqual([0.5, 0.25, 0.25]);

    const cdf = hist.getCDF();
    expect(cdf).toEqual([0.5, 0.75, 1]);
    expect(cdf[cdf.length - 1]).toBeCloseTo(1, 10);
  });

  it("should return bin edges", () => {
    const edges = [10, 20, 30];
    const hist = new CuHistogram({ edges });
    expect(hist.getEdges()).toEqual(edges);
  });
});

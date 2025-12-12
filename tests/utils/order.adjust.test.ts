import { describe, it, expect } from "vitest";
import type { OrderState } from "../../src/trading.js";
import {
  adjustOrderSplit,
  adjustOrderBonusIssue,
  adjustOrderRightsIssueTERP,
} from "../../src/utils/order.adjust.js";

describe("adjustOrderSplit", () => {
  it("adjusts quantity and price for split", () => {
    const state: OrderState = {
      quantity: 100,
      price: 10,
      stopPrice: 9,
      modified: new Date(),
    };
    adjustOrderSplit(state, 2);
    expect(state.quantity).toBe(200);
    expect(state.price).toBe(5);
    expect(state.stopPrice).toBe(4.5);
  });

  it("adjusts without stopPrice", () => {
    const state: OrderState = {
      quantity: 50,
      price: 20,
      modified: new Date(),
    };
    adjustOrderSplit(state, 0.5);
    expect(state.quantity).toBe(25);
    expect(state.price).toBe(40);
  });
});

describe("adjustOrderBonusIssue", () => {
  it("adjusts for bonus and capital issue", () => {
    const state: OrderState = {
      quantity: 100,
      price: 10,
      modified: new Date(),
    };
    adjustOrderBonusIssue(state, 0.1, 0.2);
    expect(state.quantity).toBe(130);
    expect(state.price).toBeCloseTo(7.692);
  });
});

describe("adjustOrderRightsIssueTERP", () => {
  it("adjusts price for rights issue", () => {
    const state: OrderState = {
      quantity: 100,
      price: 10,
      stopPrice: 9,
      modified: new Date(),
    };
    adjustOrderRightsIssueTERP(state, 0.25, 8);
    expect(state.price).toBeCloseTo(9.6);
    expect(state.stopPrice).toBeCloseTo(8.8);
  });

  it("adjusts without stopPrice", () => {
    const state: OrderState = {
      quantity: 100,
      price: 10,
      modified: new Date(),
    };
    adjustOrderRightsIssueTERP(state, 0.25, 8);
    expect(state.price).toBeCloseTo(9.6);
  });
});

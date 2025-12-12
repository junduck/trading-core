import type { OrderState } from "../trading.js";

// ! These functions do not follow FINRA or exchange-specific rules. They are generic implementations for simulation purposes only.

/**
 * Adjusts the order in queue when split occurs.
 * Modifies the order's quantity and price/stopPrice accordingly in place.
 * @param state - The order state to adjust
 * @param ratio - The split ratio (e.g., 2 for 2-for-1 split)
 * @param time - Optional time of adjustment; defaults to current time
 * @group Order Management
 */
export function adjustOrderSplit(
  state: OrderState,
  ratio: number,
  time?: Date
): void {
  const actTime = time ?? new Date();

  state.quantity = Math.floor(state.quantity * ratio);
  if (state.price !== undefined) {
    state.price = state.price / ratio;
  }
  if (state.stopPrice !== undefined) {
    state.stopPrice = state.stopPrice / ratio;
  }

  state.modified = actTime;
}

/**
 * Adjusts the order in queue when bonus issue occurs.
 * Modifies the order's quantity and price/stopPrice accordingly in place.
 * @param state - The order state to adjust
 * @param bonusRatio - The bonus issue ratio (e.g., 0.2 for 20% bonus)
 * @param capitalRatio - The capital issue ratio (e.g., 0.5 for 50% capital)
 * @param time - Optional time of adjustment; defaults to current time
 * @group Order Management
 */
export function adjustOrderBonusIssue(
  state: OrderState,
  bonusRatio: number,
  capitalRatio: number,
  time?: Date
) {
  const splitRatio = 1 + bonusRatio + capitalRatio;
  adjustOrderSplit(state, splitRatio, time);
}

/**
 * Adjusts the order in queue when rights issue occurs.
 * Notice that only price is adjusted, quantity remains the same.
 * Modification is based on Theoretical Ex-Rights Price (TERP), assumed all rights are taken up.
 * @param state - The order state to adjust
 * @param rightsRatio - The rights issue ratio (e.g., 0.25 for 25%)
 * @param rightsOfferPrice - Offer price per share / subscription price for the rights
 * @param time - Optional time of adjustment; defaults to current time
 * @group Order Management
 */
export function adjustOrderRightsIssueTERP(
  state: OrderState,
  rightsRatio: number,
  rightsOfferPrice: number,
  time?: Date
) {
  const terpAdjust = rightsRatio * rightsOfferPrice;
  if (state.price !== undefined) {
    state.price = (state.price + terpAdjust) / (1 + rightsRatio);
  }
  if (state.stopPrice !== undefined) {
    state.stopPrice = (state.stopPrice + terpAdjust) / (1 + rightsRatio);
  }

  state.modified = time ?? new Date();
}

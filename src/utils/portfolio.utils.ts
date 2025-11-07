import type { Asset } from "../types/asset.js";
import type { Portfolio } from "../types/portfolio.js";
import type { LongPositionLot, ShortPositionLot } from "../types/position.js";
import type { CloseStrategy } from "../types/trade.js";

/**
 * Adds cash to the portfolio.
 * @param p - The portfolio to modify
 * @param currency - The currency code
 * @param amount - The amount to add
 */
function debit_cash(p: Portfolio, currency: string, amount: number) {
  const balance = p.cash.get(currency) ?? 0;
  p.cash.set(currency, balance + amount);
}

/**
 * Removes cash from the portfolio.
 * @param p - The portfolio to modify
 * @param currency - The currency code
 * @param amount - The amount to remove
 */
function credit_cash(p: Portfolio, currency: string, amount: number) {
  const balance = p.cash.get(currency) ?? 0;
  p.cash.set(currency, balance - amount);
}

export { debit_cash as deposit, credit_cash as withdraw };

/**
 * Adds commission to the portfolio for a specific currency.
 * @param p - The portfolio to modify
 * @param currency - The currency code
 * @param amount - The commission amount to add
 */
function add_commission(p: Portfolio, currency: string, amount: number) {
  const current = p.totalCommission.get(currency) ?? 0;
  p.totalCommission.set(currency, current + amount);
}

/**
 * Updates realised PnL for the portfolio in a specific currency.
 * @param p - The portfolio to modify
 * @param currency - The currency code
 * @param pnl - The PnL amount to add (can be negative for losses)
 */
function update_realised_pnl(p: Portfolio, currency: string, pnl: number) {
  const current = p.realisedPnL.get(currency) ?? 0;
  p.realisedPnL.set(currency, current + pnl);
}

/**
 * Validates portfolio integrity by checking position lots.
 * @param p - The portfolio to validate
 * @returns True if portfolio is valid, false otherwise
 */
export function validatePortfolio(p: Portfolio): boolean {
  // validate long
  for (const [_, pos] of p.longPosition ?? []) {
    const quantity = pos.lots.reduce((sum, lot) => sum + lot.quantity, 0);
    const totalCost = pos.lots.reduce((sum, lot) => sum + lot.totalCost, 0);
    if (quantity != pos.quantity || totalCost != pos.totalCost) {
      return false;
    }
  }

  // validate short
  for (const [_, pos] of p.shortPosition ?? []) {
    const quantity = pos.lots.reduce((sum, lot) => sum + lot.quantity, 0);
    const totalProceeds = pos.lots.reduce(
      (sum, lot) => sum + lot.totalProceeds,
      0
    );
    if (quantity != pos.quantity || totalProceeds != pos.totalProceeds) {
      return false;
    }
  }

  // Note: Portfolio-level realisedPnL is not validated as positions don't track currency
  // avg = total/quantity is not validated, this invariant is never used
  return true;
}

/**
 * Opens a long position by purchasing an asset.
 * @param p - The portfolio to modify
 * @param asset - The asset to purchase
 * @param price - The price per unit
 * @param quant - The quantity to purchase
 * @param comm - The commission paid (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The cash flow (negative value representing cost)
 */
export function openLong(
  p: Portfolio,
  asset: Asset,
  price: number,
  quant: number,
  comm: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  const cost = price * quant + comm;

  // Deduct cash
  credit_cash(p, asset.currency, cost);

  // Create new lot
  const lot: LongPositionLot = {
    quantity: quant,
    price,
    totalCost: cost,
    created: actTime,
    modified: actTime,
  };

  // Initialize longs positions map if needed
  p.longPosition ??= new Map();

  // Add to position
  let pos = p.longPosition.get(asset.symbol);
  if (!pos) {
    pos = {
      symbol: asset.symbol,
      quantity: quant,
      totalCost: cost,
      averageCost: cost / quant,
      realisedPnL: 0,
      lots: [lot],
      created: actTime,
      modified: actTime,
    };
    p.longPosition.set(asset.symbol, pos);
  } else {
    pos.quantity += quant;
    pos.totalCost += cost;
    pos.averageCost = pos.totalCost / pos.quantity;
    pos.lots.push(lot);
    pos.modified = actTime;
  }

  add_commission(p, asset.currency, comm);
  p.modified = actTime;

  return -cost;
}

/**
 * Closes a long position by selling an asset.
 * @param p - The portfolio to modify
 * @param asset - The asset to sell
 * @param price - The price per unit
 * @param quant - The quantity to sell
 * @param comm - The commission paid (default: 0)
 * @param strat - The lot closing strategy (default: "LIFO")
 * @param time - The transaction time (default: current date)
 * @returns The realised profit or loss
 * @throws Error if no long position exists for the asset
 */
export function closeLong(
  p: Portfolio,
  asset: Asset,
  price: number,
  quant: number,
  comm: number = 0,
  strat: CloseStrategy = "LIFO",
  time?: Date
): number {
  const pos = p.longPosition?.get(asset.symbol);
  if (!pos) {
    throw new Error(`No long position found for ${asset.symbol}`);
  }

  const actTime = time ?? new Date();

  const proceeds = price * quant - comm;
  let remainingQty = quant;
  let totalCost = 0;

  // Sort lots based on closing strategy
  const lots = strat === "FIFO" ? pos.lots : [...pos.lots].reverse();

  for (const lot of lots) {
    if (remainingQty <= 0) break;

    const closeQty = Math.min(lot.quantity, remainingQty);

    let lotCost: number;
    if (closeQty === lot.quantity) {
      // Closing entire lot - use exact totalCost to avoid rounding error
      lotCost = lot.totalCost;
    } else {
      // Partial close - calculate proportionally
      lotCost = (lot.totalCost / lot.quantity) * closeQty;
    }

    totalCost += lotCost;
    remainingQty -= closeQty;

    lot.quantity -= closeQty;
    lot.totalCost -= lotCost;
    lot.modified = actTime;
  }

  // Remove empty lots
  pos.lots = pos.lots.filter((l) => l.quantity > 0);

  // Calculate realised PnL
  const realisedPnL = proceeds - totalCost;
  pos.realisedPnL += realisedPnL;
  pos.quantity -= quant;
  pos.totalCost -= totalCost;
  pos.averageCost = pos.quantity > 0 ? pos.totalCost / pos.quantity : 0;
  pos.modified = actTime;

  // Add cash back
  debit_cash(p, asset.currency, proceeds);

  // Update portfolio realised PnL
  add_commission(p, asset.currency, comm);
  update_realised_pnl(p, asset.currency, realisedPnL);
  p.modified = actTime;

  // Remove position if no lots remain
  if (pos.lots.length === 0) {
    p.longPosition!.delete(asset.symbol);
  }

  return realisedPnL;
}

/**
 * Opens a short position by borrowing and selling an asset.
 * @param p - The portfolio to modify
 * @param asset - The asset to short sell
 * @param price - The price per unit
 * @param quant - The quantity to short
 * @param comm - The commission paid (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The cash proceeds from the short sale
 */
export function openShort(
  p: Portfolio,
  asset: Asset,
  price: number,
  quant: number,
  comm: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  const proceeds = price * quant - comm;

  // Add cash
  debit_cash(p, asset.currency, proceeds);

  // Create new lot
  const lot: ShortPositionLot = {
    quantity: quant,
    price,
    totalProceeds: proceeds,
    created: actTime,
    modified: actTime,
  };

  // Initialize short positions map if needed
  p.shortPosition ??= new Map();

  // Add to position
  let pos = p.shortPosition.get(asset.symbol);
  if (!pos) {
    pos = {
      symbol: asset.symbol,
      quantity: quant,
      totalProceeds: proceeds,
      averageProceeds: proceeds / quant,
      realisedPnL: 0,
      lots: [lot],
      created: actTime,
      modified: actTime,
    };
    p.shortPosition.set(asset.symbol, pos);
  } else {
    pos.quantity += quant;
    pos.totalProceeds += proceeds;
    pos.averageProceeds = pos.totalProceeds / pos.quantity;
    pos.lots.push(lot);
    pos.modified = actTime;
  }

  add_commission(p, asset.currency, comm);
  p.modified = actTime;

  return proceeds;
}

/**
 * Closes a short position by buying back the asset.
 * @param p - The portfolio to modify
 * @param asset - The asset to buy back
 * @param price - The price per unit
 * @param quant - The quantity to buy back
 * @param comm - The commission paid (default: 0)
 * @param strat - The lot closing strategy (default: "LIFO")
 * @param time - The transaction time (default: current date)
 * @returns The realised profit or loss
 * @throws Error if no short position exists for the asset
 */
export function closeShort(
  p: Portfolio,
  asset: Asset,
  price: number,
  quant: number,
  comm: number = 0,
  strat: CloseStrategy = "LIFO",
  time?: Date
): number {
  const pos = p.shortPosition?.get(asset.symbol);
  if (!pos) {
    throw new Error(`No short position found for ${asset.symbol}`);
  }

  const actTime = time ?? new Date();

  const cost = price * quant + comm;
  let remainingQty = quant;
  let totalProceeds = 0;

  // Sort lots based on closing strategy
  const lots = strat === "FIFO" ? pos.lots : [...pos.lots].reverse();

  for (const lot of lots) {
    if (remainingQty <= 0) break;

    const closeQty = Math.min(lot.quantity, remainingQty);

    let lotProceeds: number;
    if (closeQty === lot.quantity) {
      // Closing entire lot - use exact totalProceeds to avoid rounding error
      lotProceeds = lot.totalProceeds;
    } else {
      // Partial close - calculate proportionally
      lotProceeds = (lot.totalProceeds / lot.quantity) * closeQty;
    }

    totalProceeds += lotProceeds;
    remainingQty -= closeQty;

    lot.quantity -= closeQty;
    lot.totalProceeds -= lotProceeds;
    lot.modified = actTime;
  }

  // Remove empty lots
  pos.lots = pos.lots.filter((l) => l.quantity > 0);

  // Calculate realised PnL (for shorts: proceeds from opening - cost to close)
  const realisedPnL = totalProceeds - cost;
  pos.realisedPnL += realisedPnL;
  pos.quantity -= quant;
  pos.totalProceeds -= totalProceeds;
  pos.averageProceeds = pos.quantity > 0 ? pos.totalProceeds / pos.quantity : 0;
  pos.modified = actTime;

  // Deduct cash (buying back the asset)
  credit_cash(p, asset.currency, cost);

  // Update portfolio realised PnL
  add_commission(p, asset.currency, comm);
  update_realised_pnl(p, asset.currency, realisedPnL);
  p.modified = actTime;

  // Remove position if no lots remain
  if (pos.lots.length === 0) {
    p.shortPosition!.delete(asset.symbol);
  }

  return realisedPnL;
}

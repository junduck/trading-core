import type {
  Position,
  LongPositionLot,
  ShortPositionLot,
} from "../types/position.js";
import type { CloseStrategy } from "../types/trade.js";

/**
 * Validates position integrity by checking that lot totals match position totals.
 * @param pos - The position to validate
 * @returns True if position is valid, false otherwise
 */
export function validatePosition(pos: Position): boolean {
  // validate long positions
  for (const [_, p] of pos.long ?? []) {
    const qty = p.lots.reduce((sum, lot) => sum + lot.quantity, 0);
    const val = p.lots.reduce((sum, lot) => sum + lot.totalCost, 0);
    if (qty != p.quantity || val != p.totalCost) {
      return false;
    }
  }

  // validate short positions
  for (const [_, p] of pos.short ?? []) {
    const qty = p.lots.reduce((sum, lot) => sum + lot.quantity, 0);
    const val = p.lots.reduce((sum, lot) => sum + lot.totalProceeds, 0);
    if (qty != p.quantity || val != p.totalProceeds) {
      return false;
    }
  }

  return true;
}

/**
 * Opens a long position by purchasing an asset.
 * @param pos - The position to modify
 * @param symbol - The asset symbol
 * @param price - The price per unit
 * @param quant - The quantity to purchase
 * @param comm - The commission paid (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The cash flow (negative value representing cost)
 */
export function openLong(
  pos: Position,
  symbol: string,
  price: number,
  quant: number,
  comm: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  const cost = price * quant + comm;

  // Deduct cash
  pos.cash -= cost;

  // Create new lot
  const lot: LongPositionLot = {
    quantity: quant,
    price,
    totalCost: cost,
  };

  // Initialize long positions map if needed
  pos.long ??= new Map();

  // Add to position
  let assetPos = pos.long.get(symbol);
  if (!assetPos) {
    assetPos = {
      symbol,
      quantity: quant,
      totalCost: cost,
      averageCost: cost / quant,
      realisedPnL: 0,
      lots: [lot],
      created: actTime,
      modified: actTime,
    };
    pos.long.set(symbol, assetPos);
  } else {
    assetPos.quantity += quant;
    assetPos.totalCost += cost;
    assetPos.averageCost = assetPos.totalCost / assetPos.quantity;
    assetPos.lots.push(lot);
    assetPos.modified = actTime;
  }

  pos.totalCommission += comm;
  pos.modified = actTime;

  return -cost;
}

/**
 * Closes a long position by selling an asset.
 * @param pos - The position to modify
 * @param symbol - The asset symbol
 * @param price - The price per unit
 * @param quant - The quantity to sell
 * @param comm - The commission paid (default: 0)
 * @param strat - The lot closing strategy (default: "FIFO")
 * @param time - The transaction time (default: current date)
 * @returns The realised profit or loss
 * @throws Error if no long position exists for the asset
 */
export function closeLong(
  pos: Position,
  symbol: string,
  price: number,
  quant: number,
  comm: number = 0,
  strat: CloseStrategy = "FIFO",
  time?: Date
): number {
  const assetPos = pos.long?.get(symbol);
  if (!assetPos) {
    throw new Error(`No long position found for ${symbol}`);
  }

  const actTime = time ?? new Date();

  const proceeds = price * quant - comm;
  let remainingQty = quant;
  let totalCost = 0;

  // Sort lots based on closing strategy
  const lots = strat === "FIFO" ? assetPos.lots : [...assetPos.lots].reverse();

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
  }

  // Remove empty lots
  assetPos.lots = assetPos.lots.filter((l) => l.quantity > 0);

  // Calculate realised PnL
  const realisedPnL = proceeds - totalCost;
  assetPos.realisedPnL += realisedPnL;
  assetPos.quantity -= quant;
  assetPos.totalCost -= totalCost;
  assetPos.averageCost =
    assetPos.quantity > 0 ? assetPos.totalCost / assetPos.quantity : 0;
  assetPos.modified = actTime;

  // Add cash back
  pos.cash += proceeds;

  // Update position realised PnL and commission
  pos.totalCommission += comm;
  pos.realisedPnL += realisedPnL;
  pos.modified = actTime;

  // Remove position if no lots remain
  if (assetPos.lots.length === 0) {
    pos.long!.delete(symbol);
  }

  return realisedPnL;
}

/**
 * Opens a short position by borrowing and selling an asset.
 * @param pos - The position to modify
 * @param symbol - The asset symbol
 * @param price - The price per unit
 * @param quant - The quantity to short
 * @param comm - The commission paid (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The cash proceeds from the short sale
 */
export function openShort(
  pos: Position,
  symbol: string,
  price: number,
  quant: number,
  comm: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  const proceeds = price * quant - comm;

  // Add cash
  pos.cash += proceeds;

  // Create new lot
  const lot: ShortPositionLot = {
    quantity: quant,
    price,
    totalProceeds: proceeds,
  };

  // Initialize short positions map if needed
  pos.short ??= new Map();

  // Add to position
  let assetPos = pos.short.get(symbol);
  if (!assetPos) {
    assetPos = {
      symbol,
      quantity: quant,
      totalProceeds: proceeds,
      averageProceeds: proceeds / quant,
      realisedPnL: 0,
      lots: [lot],
      created: actTime,
      modified: actTime,
    };
    pos.short.set(symbol, assetPos);
  } else {
    assetPos.quantity += quant;
    assetPos.totalProceeds += proceeds;
    assetPos.averageProceeds = assetPos.totalProceeds / assetPos.quantity;
    assetPos.lots.push(lot);
    assetPos.modified = actTime;
  }

  pos.totalCommission += comm;
  pos.modified = actTime;

  return proceeds;
}

/**
 * Closes a short position by buying back the asset.
 * @param pos - The position to modify
 * @param symbol - The asset symbol
 * @param price - The price per unit
 * @param quant - The quantity to buy back
 * @param comm - The commission paid (default: 0)
 * @param strat - The lot closing strategy (default: "FIFO")
 * @param time - The transaction time (default: current date)
 * @returns The realised profit or loss
 * @throws Error if no short position exists for the asset
 */
export function closeShort(
  pos: Position,
  symbol: string,
  price: number,
  quant: number,
  comm: number = 0,
  strat: CloseStrategy = "FIFO",
  time?: Date
): number {
  const assetPos = pos.short?.get(symbol);
  if (!assetPos) {
    throw new Error(`No short position found for ${symbol}`);
  }

  const actTime = time ?? new Date();

  const cost = price * quant + comm;
  let remainingQty = quant;
  let totalProceeds = 0;

  // Sort lots based on closing strategy
  const lots = strat === "FIFO" ? assetPos.lots : [...assetPos.lots].reverse();

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
  }

  // Remove empty lots
  assetPos.lots = assetPos.lots.filter((l) => l.quantity > 0);

  // Calculate realised PnL (for shorts: proceeds from opening - cost to close)
  const realisedPnL = totalProceeds - cost;
  assetPos.realisedPnL += realisedPnL;
  assetPos.quantity -= quant;
  assetPos.totalProceeds -= totalProceeds;
  assetPos.averageProceeds =
    assetPos.quantity > 0 ? assetPos.totalProceeds / assetPos.quantity : 0;
  assetPos.modified = actTime;

  // Deduct cash (buying back the asset)
  pos.cash -= cost;

  // Update position realised PnL and commission
  pos.totalCommission += comm;
  pos.realisedPnL += realisedPnL;
  pos.modified = actTime;

  // Remove position if no lots remain
  if (assetPos.lots.length === 0) {
    pos.short!.delete(symbol);
  }

  return realisedPnL;
}

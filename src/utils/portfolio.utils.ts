import type { Asset } from "../types/asset.js";
import type { Portfolio } from "../types/portfolio.js";
import type { LongPositionLot, ShortPositionLot } from "../types/position.js";
import type { CloseStrategy } from "../types/trade.js";

function debit_cash(p: Portfolio, currency: string, amount: number) {
  const balance = p.cash.get(currency) ?? 0;
  p.cash.set(currency, balance + amount);
}

function credit_cash(p: Portfolio, currency: string, amount: number) {
  const balance = p.cash.get(currency) ?? 0;
  p.cash.set(currency, balance - amount);
}

export { debit_cash as deposit, credit_cash as withdraw };

export function validatePortfolio(p: Portfolio): boolean {
  let realisedPnL = 0;

  // validate long
  for (const [_, pos] of p.longPosition ?? []) {
    const quantity = pos.lots.reduce((sum, lot) => sum + lot.quantity, 0);
    const totalCost = pos.lots.reduce((sum, lot) => sum + lot.totalCost, 0);
    if (quantity != pos.quantity || totalCost != pos.totalCost) {
      return false;
    }
    realisedPnL += pos.realisedPnL;
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
    realisedPnL += pos.realisedPnL;
  }

  if (realisedPnL != p.realisedPnL) {
    return false;
  }

  // avg = total/quantity is not validated, this invariant is never used
  return true;
}

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

  p.totalCommission += comm;
  p.modified = actTime;

  return -cost;
}

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
  p.totalCommission += comm;
  p.realisedPnL += realisedPnL;
  p.modified = actTime;

  // Remove position if no lots remain
  if (pos.lots.length === 0) {
    p.longPosition!.delete(asset.symbol);
  }

  return realisedPnL;
}

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

  p.totalCommission += comm;
  p.modified = actTime;

  return proceeds;
}

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
  p.totalCommission += comm;
  p.realisedPnL += realisedPnL;
  p.modified = actTime;

  // Remove position if no lots remain
  if (pos.lots.length === 0) {
    p.shortPosition!.delete(asset.symbol);
  }

  return realisedPnL;
}

export function handleSplit(
  p: Portfolio,
  asset: Asset,
  ratio: number,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid split ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = p.longPosition?.get(asset.symbol);
  if (long) {
    // Update each lot
    for (const lot of long.lots) {
      lot.quantity *= ratio;
      // lot.totalCost remains unchanged (total investment value doesn't change)
      lot.modified = actTime;
    }

    long.quantity *= ratio;
    // totalCost remains unchanged (total investment value doesn't change)
    long.averageCost = long.totalCost / long.quantity;
    long.modified = actTime;
  }

  const short = p.shortPosition?.get(asset.symbol);
  if (short) {
    // Update each lot
    for (const lot of short.lots) {
      lot.quantity *= ratio;
      // lot.totalProceeds remains unchanged (total investment value doesn't change)
      lot.modified = actTime;
    }

    short.quantity *= ratio;
    // totalProceeds remains unchanged (total investment value doesn't change)
    short.averageProceeds = short.totalProceeds / short.quantity;
    short.modified = actTime;
  }

  p.modified = actTime;
}

export function handleCashDividend(
  p: Portfolio,
  asset: Asset,
  amountPerShare: number,
  taxRate: number = 0,
  time?: Date
): number {
  if (amountPerShare < 0) {
    throw new Error(
      `Invalid dividend amount: ${amountPerShare}. Must be non-negative.`
    );
  }
  if (taxRate < 0 || taxRate > 1) {
    throw new Error(`Invalid tax rate: ${taxRate}. Must be between 0 and 1.`);
  }

  const actTime = time ?? new Date();

  let cashFlow = 0;

  const long = p.longPosition?.get(asset.symbol);
  if (long) {
    let totalPaid = 0;

    // Update each lot
    for (const lot of long.lots) {
      const divAmount = lot.quantity * amountPerShare;
      const afterTax = divAmount * (1 - taxRate);
      totalPaid += afterTax;
      lot.totalCost -= afterTax;
      lot.modified = actTime;
    }

    long.totalCost -= totalPaid;
    long.averageCost = long.totalCost / long.quantity;
    long.modified = actTime;

    cashFlow += totalPaid;
  }

  const short = p.shortPosition?.get(asset.symbol);
  if (short) {
    let totalOwed = 0;

    // Update each lot
    for (const lot of short.lots) {
      const divAmount = lot.quantity * amountPerShare;
      totalOwed += divAmount;
      lot.totalProceeds -= divAmount;
      lot.modified = actTime;
    }

    short.totalProceeds -= totalOwed;
    short.averageProceeds = short.totalProceeds / short.quantity;
    short.modified = actTime;

    cashFlow -= totalOwed;
  }

  // Adjust cash account
  debit_cash(p, asset.currency, cashFlow);

  p.modified = actTime;

  return cashFlow;
}

export function handleSpinoff(
  p: Portfolio,
  asset: Asset,
  newAsset: Asset,
  ratio: number,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid spinoff ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = p.longPosition?.get(asset.symbol);
  if (long) {
    const newShares = long.quantity * ratio;

    // Create new position in spinoff company
    const newLot: LongPositionLot = {
      quantity: newShares,
      price: 0, // Spinoff shares have no cost basis
      totalCost: 0,
      created: actTime,
      modified: actTime,
    };

    // Add to position
    let newPos = p.longPosition!.get(newAsset.symbol);
    if (!newPos) {
      newPos = {
        symbol: newAsset.symbol,
        quantity: newShares,
        totalCost: 0,
        averageCost: 0,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      p.longPosition!.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newShares;
      newPos.averageCost = newPos.totalCost / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }
  }

  const short = p.shortPosition?.get(asset.symbol);
  if (short) {
    const newShares = short.quantity * ratio;

    const newLot: ShortPositionLot = {
      quantity: newShares,
      price: 0, // Spinoff shares have no proceeds
      totalProceeds: 0,
      created: actTime,
      modified: actTime,
    };

    let newPos = p.shortPosition!.get(newAsset.symbol);
    if (!newPos) {
      newPos = {
        symbol: newAsset.symbol,
        quantity: newShares,
        totalProceeds: 0,
        averageProceeds: 0,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      p.shortPosition!.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newShares;
      newPos.averageProceeds = newPos.totalProceeds / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }
  }

  p.modified = actTime;
}

export function handleMerger(
  p: Portfolio,
  asset: Asset,
  newAsset: Asset,
  ratio: number,
  cashComponent: number = 0,
  time?: Date
): number {
  if (ratio <= 0) {
    throw new Error(`Invalid merger ratio: ${ratio}. Must be positive.`);
  }
  if (cashComponent < 0) {
    throw new Error(
      `Invalid cash component: ${cashComponent}. Must be non-negative.`
    );
  }

  const actTime = time ?? new Date();

  let cashFlow = 0;

  const long = p.longPosition?.get(asset.symbol);
  if (long) {
    const newShares = long.quantity * ratio;
    const cashReceived = long.quantity * cashComponent;
    const newCost = long.totalCost - cashReceived;
    cashFlow += cashReceived;

    // Create new position in acquiring company
    const newLot: LongPositionLot = {
      quantity: newShares,
      price: newCost / newShares, // for consistency only
      totalCost: newCost,
      created: actTime,
      modified: actTime,
    };

    let newPos = p.longPosition!.get(newAsset.symbol);
    if (!newPos) {
      newPos = {
        symbol: newAsset.symbol,
        quantity: newLot.quantity,
        totalCost: newLot.totalCost,
        averageCost: newLot.price,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      p.longPosition!.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newLot.quantity;
      newPos.totalCost += newLot.totalCost;
      newPos.averageCost = newPos.totalCost / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }

    // Remove old position
    p.longPosition!.delete(asset.symbol);
  }

  const short = p.shortPosition?.get(asset.symbol);
  if (short) {
    const newShorts = short.quantity * ratio;
    const cashOwed = short.quantity * cashComponent;
    const newProceeds = short.totalProceeds - cashOwed;
    cashFlow -= cashOwed;

    const newLot: ShortPositionLot = {
      quantity: newShorts,
      price: newProceeds / newShorts, // for consistency only
      totalProceeds: newProceeds,
      created: actTime,
      modified: actTime,
    };

    let newPos = p.shortPosition!.get(newAsset.symbol);
    if (!newPos) {
      newPos = {
        symbol: newAsset.symbol,
        quantity: newLot.quantity,
        totalProceeds: newLot.totalProceeds,
        averageProceeds: newLot.price,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      p.shortPosition!.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newLot.quantity;
      newPos.totalProceeds += newLot.totalProceeds;
      newPos.averageProceeds = newPos.totalProceeds / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }

    p.shortPosition!.delete(asset.symbol);
  }

  // Adjust cash account
  debit_cash(p, asset.currency, cashFlow);

  p.modified = actTime;

  return cashFlow;
}

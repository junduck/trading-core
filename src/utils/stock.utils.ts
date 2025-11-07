import type { Asset } from "../types/asset.js";
import type { Portfolio } from "../types/portfolio.js";
import type { LongPositionLot, ShortPositionLot } from "../types/position.js";
import { deposit } from "./portfolio.utils.js";

/**
 * Handles a stock split by adjusting position quantities and costs.
 * @param p - The portfolio to modify
 * @param asset - The asset undergoing the split
 * @param ratio - The split ratio (e.g., 2 for a 2-for-1 split)
 * @param time - The transaction time (default: current date)
 * @throws Error if the split ratio is not positive
 */
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

/**
 * Handles a cash dividend payment by adjusting cost basis and cash balance.
 * @param p - The portfolio to modify
 * @param asset - The asset paying the dividend
 * @param amountPerShare - The dividend amount per share
 * @param taxRate - The tax rate applied to the dividend (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The net cash flow after tax
 * @throws Error if the dividend amount is negative or tax rate is not between 0 and 1
 */
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
  deposit(p, asset.currency, cashFlow);

  p.modified = actTime;

  return cashFlow;
}

/**
 * Handles a corporate spinoff by creating positions in the new company.
 * @param p - The portfolio to modify
 * @param asset - The original asset
 * @param newAsset - The spun-off company asset
 * @param ratio - The number of new shares per original share
 * @param time - The transaction time (default: current date)
 * @throws Error if the spinoff ratio is not positive
 */
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

/**
 * Handles a corporate merger by exchanging positions to the acquiring company.
 * @param p - The portfolio to modify
 * @param asset - The asset being acquired
 * @param newAsset - The acquiring company asset
 * @param ratio - The exchange ratio of new shares per old share
 * @param cashComponent - The cash amount per share (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The net cash flow from the merger
 * @throws Error if the merger ratio is not positive or cash component is negative
 */
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
  deposit(p, asset.currency, cashFlow);

  p.modified = actTime;

  return cashFlow;
}

import type {
  Position,
  LongPositionLot,
  ShortPositionLot,
} from "../types/position.js";
import {
  pushLongPositionLot,
  pushShortPositionLot,
  amendLongPositionLot,
  amendShortPositionLot,
} from "./position.utils.js";

/**
 * Handles a stock split by adjusting position quantities and costs.
 * @param pos - The position to modify
 * @param symbol - The asset symbol undergoing the split
 * @param ratio - The split ratio (e.g., 2 for a 2-for-1 split, 1.3 for a 13-for-10 split)
 * @param time - The transaction time (default: current date)
 * @param disableLot - If true, merges into single lot instead of tracking separate lots (default: false)
 * @group Position
 */
export function handleSplit(
  pos: Position,
  symbol: string,
  ratio: number,
  time?: Date,
  disableLot?: boolean
) {
  const actTime = time ?? new Date();
  const inc = ratio - 1;

  const long = pos.long?.get(symbol);
  if (long) {
    let split = long.quantity * inc;
    const newLot: LongPositionLot = {
      quantity: split,
      price: 0,
      totalCost: 0,
    };

    if (disableLot) {
      amendLongPositionLot(pos, symbol, newLot, actTime, false);
    } else {
      pushLongPositionLot(pos, symbol, newLot, actTime);
    }
  }

  const short = pos.short?.get(symbol);
  if (short) {
    let split = short.quantity * inc;
    const newLot: ShortPositionLot = {
      quantity: split,
      price: 0,
      totalProceeds: 0,
    };

    if (disableLot) {
      amendShortPositionLot(pos, symbol, newLot, actTime);
    } else {
      pushShortPositionLot(pos, symbol, newLot, actTime);
    }
  }

  if (long || short) {
    pos.modified = actTime;
  }
}

/**
 * Handles a bonus issue by adjusting position quantities and deducting applicable taxes.
 * @param pos - The position to modify
 * @param symbol - The asset symbol undergoing the bonus issue
 * @param bonusRatio - Taxable bonus issue ratio (e.g., 0.1 for 10%)
 * @param capitalRatio - Non-taxable capitalisation issue ratio (e.g., 0.2 for 20%)
 * @param fmvPerShare - Fair market value per share for taxable portion. For Chinese market stocks, use 1 per share as mandated by tax regulations.
 * @param taxRate - The tax rate applied to the bonus shares (default: 0)
 * @param time - The transaction time (default: current date)
 * @param disableLot - If true, merges into single lot instead of tracking separate lots (default: false)
 * @group Position
 */
export function handleBonusIssue(
  pos: Position,
  symbol: string,
  bonusRatio: number,
  capitalRatio: number,
  fmvPerShare: number,
  taxRate: number = 0,
  time?: Date,
  disableLot?: boolean
) {
  const actTime = time ?? new Date();

  let totalBonusShares = 0;

  const long = pos.long?.get(symbol);
  if (long) {
    const split = long.quantity * (bonusRatio + capitalRatio);
    const newLot: LongPositionLot = {
      quantity: split,
      price: 0,
      totalCost: 0,
    };
    if (disableLot) {
      amendLongPositionLot(pos, symbol, newLot, actTime, false);
    } else {
      pushLongPositionLot(pos, symbol, newLot, actTime);
    }

    totalBonusShares = long.quantity * bonusRatio;
  }

  const short = pos.short?.get(symbol);
  if (short) {
    const split = short.quantity * (bonusRatio + capitalRatio);
    const newLot: ShortPositionLot = {
      quantity: split,
      price: 0,
      totalProceeds: 0,
    };
    if (disableLot) {
      amendShortPositionLot(pos, symbol, newLot, actTime, false);
    } else {
      pushShortPositionLot(pos, symbol, newLot, actTime);
    }
  }

  // Handle tax payment for taxable bonus issue
  if (totalBonusShares > 0 && taxRate > 0 && fmvPerShare > 0) {
    const taxAmount = totalBonusShares * fmvPerShare * taxRate;
    pos.cash -= taxAmount;
  }

  if (long || short) {
    pos.modified = actTime;
  }
}

/**
 * Handles a rights issue by purchasing new shares at offer price.
 * For long positions, creates a new lot and deducts cash.
 * For short positions, increases liability with no proceeds.
 * @param pos - The position to modify
 * @param symbol - The asset symbol undergoing the rights issue
 * @param rightsRatio - Rights issue ratio (e.g., 0.2 for 20%)
 * @param rightsOfferPrice - Offer price per share for rights issue
 * @param time - The transaction time (default: current date)
 * @group Position
 */
export function handleRightsIssue(
  pos: Position,
  symbol: string,
  rightsRatio: number,
  rightsOfferPrice: number,
  time?: Date
) {
  const actTime = time ?? new Date();

  const long = pos.long?.get(symbol);
  if (long) {
    const additionalShares = long.quantity * rightsRatio;
    const totalCost = additionalShares * rightsOfferPrice;

    // Create new lot for rights issue purchase
    const newLot: LongPositionLot = {
      quantity: additionalShares,
      price: rightsOfferPrice,
      totalCost: totalCost,
    };

    // Add new lot to position
    pushLongPositionLot(pos, symbol, newLot, actTime);

    // Deduct cash for rights issue purchase
    pos.cash -= totalCost;
  }

  const short = pos.short?.get(symbol);
  if (short) {
    const additionalShorts = short.quantity * rightsRatio; // this is liability

    const newLot: ShortPositionLot = {
      quantity: additionalShorts,
      price: rightsOfferPrice,
      totalProceeds: 0, // no proceeds from rights issue short, borrowed amount just inflated due to exercising rights
    };

    // Add new lot to short position
    pushShortPositionLot(pos, symbol, newLot, actTime);
  }

  if (long || short) {
    pos.modified = actTime;
  }
}

/**
 * Handles a cash dividend payment by adjusting cost basis and cash balance.
 * @param pos - The position to modify
 * @param symbol - The asset symbol paying the dividend
 * @param amountPerShare - The dividend amount per share
 * @param taxRate - The tax rate applied to the dividend (default: 0)
 * @param time - The transaction time (default: current date)
 * @returns The net cash flow after tax (positive for long, negative for short)
 * @throws Error if the dividend amount is negative or tax rate is not between 0 and 1
 * @group Position
 */
export function handleCashDividend(
  pos: Position,
  symbol: string,
  amountPerShare: number,
  taxRate: number = 0,
  time?: Date
): number {
  const actTime = time ?? new Date();

  let cashFlow = 0;

  const long = pos.long?.get(symbol);
  if (long) {
    let totalPaid = 0;

    // Update each lot
    for (const lot of long.lots) {
      const divAmount = lot.quantity * amountPerShare;
      const afterTax = divAmount * (1 - taxRate);
      totalPaid += afterTax;
      lot.totalCost -= afterTax;
    }

    long.totalCost -= totalPaid;
    long.modified = actTime;

    cashFlow += totalPaid;
  }

  const short = pos.short?.get(symbol);
  if (short) {
    let totalOwed = 0;

    // Update each lot
    for (const lot of short.lots) {
      const divAmount = lot.quantity * amountPerShare;
      totalOwed += divAmount;
      lot.totalProceeds -= divAmount;
    }

    short.totalProceeds -= totalOwed;
    short.modified = actTime;

    cashFlow -= totalOwed;
  }

  if (long || short) {
    pos.cash += cashFlow;
    pos.modified = actTime;
  }

  return cashFlow;
}

/**
 * Handles a corporate spinoff by creating positions in the new company.
 * @param pos - The source position
 * @param symbol - The original asset symbol
 * @param newSymbol - The spun-off company symbol
 * @param ratio - The number of new shares per original share
 * @param time - The transaction time (default: current date)
 * @param disableLot - If true, merges into single lot instead of tracking separate lots (default: false)
 * @throws Error if the spinoff ratio is not positive
 * @group Position
 */
export function handleSpinoff(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number,
  time?: Date,
  disableLot?: boolean
) {
  const actTime = time ?? new Date();

  const long = pos.long?.get(symbol);
  if (long) {
    const newShares = long.quantity * ratio;

    // Create new position in spinoff company
    const newLot: LongPositionLot = {
      quantity: newShares,
      price: 0, // Spinoff shares have no cost basis
      totalCost: 0,
    };

    // Add to position
    if (disableLot) {
      amendLongPositionLot(pos, newSymbol, newLot, actTime);
    } else {
      pushLongPositionLot(pos, newSymbol, newLot, actTime);
    }
  }

  const short = pos.short?.get(symbol);
  if (short) {
    const newShares = short.quantity * ratio;

    const newLot: ShortPositionLot = {
      quantity: newShares,
      price: 0, // Spinoff shares have no proceeds
      totalProceeds: 0,
    };

    // Add to position
    if (disableLot) {
      amendShortPositionLot(pos, newSymbol, newLot, actTime);
    } else {
      pushShortPositionLot(pos, newSymbol, newLot, actTime);
    }
  }

  if (long || short) {
    pos.modified = actTime;
  }
}

/**
 * Handles a corporate merger by exchanging positions to the acquiring company.
 * @param pos - The source position
 * @param symbol - The asset symbol being acquired
 * @param newSymbol - The acquiring company symbol
 * @param ratio - The exchange ratio of new shares per old share
 * @param cashComponent - The cash amount per share (default: 0)
 * @param time - The transaction time (default: current date)
 * @param disableLot - If true, merges into single lot instead of tracking separate lots (default: false)
 * @returns The net cash flow from the merger
 * @throws Error if the merger ratio is not positive or cash component is negative
 * @group Position
 */
export function handleMerger(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number,
  cashComponent: number = 0,
  time?: Date,
  disableLot?: boolean
): number {
  const actTime = time ?? new Date();

  let cashFlow = 0;

  const long = pos.long?.get(symbol);
  if (long) {
    const newShares = long.quantity * ratio;
    const cashReceived = long.quantity * cashComponent;
    const newCost = long.totalCost - cashReceived;
    cashFlow += cashReceived;

    // Create new position in acquiring company
    const newLot: LongPositionLot = {
      quantity: newShares,
      price: 0, // new lot from merger we don't have a price basis here
      totalCost: newCost,
    };

    // Add to position
    if (disableLot) {
      amendLongPositionLot(pos, newSymbol, newLot, actTime);
    } else {
      pushLongPositionLot(pos, newSymbol, newLot, actTime);
    }

    // Remove old position
    pos.long!.delete(symbol);
  }

  const short = pos.short?.get(symbol);
  if (short) {
    const newShorts = short.quantity * ratio;
    const cashOwed = short.quantity * cashComponent;
    const newProceeds = short.totalProceeds - cashOwed;
    cashFlow -= cashOwed;

    const newLot: ShortPositionLot = {
      quantity: newShorts,
      price: newProceeds / newShorts, // for consistency only
      totalProceeds: newProceeds,
    };

    // Add to position
    if (disableLot) {
      amendShortPositionLot(pos, newSymbol, newLot, actTime);
    } else {
      pushShortPositionLot(pos, newSymbol, newLot, actTime);
    }

    // Remove old position
    pos.short!.delete(symbol);
  }

  // Adjust cash account
  if (long || short) {
    pos.cash += cashFlow;
    pos.modified = actTime;
  }

  return cashFlow;
}

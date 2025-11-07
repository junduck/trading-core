import type {
  Position,
  LongPositionLot,
  ShortPositionLot,
} from "../types/position.js";
import { pushLongPositionLot, pushShortPositionLot } from "./position.utils.js";

/**
 * Handles a stock split by adjusting position quantities and costs.
 * @param pos - The position to modify
 * @param symbol - The asset symbol undergoing the split
 * @param ratio - The split ratio (e.g., 2 for a 2-for-1 split)
 * @param time - The transaction time (default: current date)
 * @throws Error if the split ratio is not positive
 */
export function handleSplit(
  pos: Position,
  symbol: string,
  ratio: number,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid split ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = pos.long?.get(symbol);
  if (long) {
    // Update each lot
    for (const lot of long.lots) {
      lot.quantity *= ratio;
      // lot.totalCost remains unchanged (total investment value doesn't change)
    }

    long.quantity *= ratio;
    // totalCost remains unchanged (total investment value doesn't change)
    long.modified = actTime;
  }

  const short = pos.short?.get(symbol);
  if (short) {
    // Update each lot
    for (const lot of short.lots) {
      lot.quantity *= ratio;
      // lot.totalProceeds remains unchanged (total investment value doesn't change)
    }

    short.quantity *= ratio;
    // totalProceeds remains unchanged (total investment value doesn't change)
    short.modified = actTime;
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
 */
export function handleCashDividend(
  pos: Position,
  symbol: string,
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
 * @throws Error if the spinoff ratio is not positive
 */
export function handleSpinoff(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid spinoff ratio: ${ratio}. Must be positive.`);
  }

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
    pushLongPositionLot(pos, newSymbol, newLot, actTime);
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
    pushShortPositionLot(pos, newSymbol, newLot, actTime);
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
 * @returns The net cash flow from the merger
 * @throws Error if the merger ratio is not positive or cash component is negative
 */
export function handleMerger(
  pos: Position,
  symbol: string,
  newSymbol: string,
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
    pushLongPositionLot(pos, newSymbol, newLot, actTime);

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
    pushShortPositionLot(pos, newSymbol, newLot, actTime);

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

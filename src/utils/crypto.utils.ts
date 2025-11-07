import type {
  Position,
  LongPositionLot,
  ShortPositionLot,
} from "../types/position.js";

/**
 * Handles a hard fork by creating positions in the new cryptocurrency.
 * @param pos - The position to modify
 * @param symbol - The original cryptocurrency symbol
 * @param newSymbol - The forked cryptocurrency symbol
 * @param ratio - The number of new coins per original coin (default: 1)
 * @param time - The transaction time (default: current date)
 * @throws Error if the hard fork ratio is not positive
 */
export function handleHardFork(
  pos: Position,
  symbol: string,
  newSymbol: string,
  ratio: number = 1,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid hard fork ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = pos.long?.get(symbol);
  if (long) {
    const newCoins = long.quantity * ratio;

    // Create new position in forked cryptocurrency
    const newLot: LongPositionLot = {
      quantity: newCoins,
      price: 0, // Forked coins have no cost basis
      totalCost: 0,
    };

    // Add to position
    let newPos = pos.long!.get(newSymbol);
    if (!newPos) {
      newPos = {
        symbol: newSymbol,
        quantity: newCoins,
        totalCost: 0,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      pos.long!.set(newSymbol, newPos);
    } else {
      newPos.quantity += newCoins;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }
  }

  const short = pos.short?.get(symbol);
  if (short) {
    const newCoins = short.quantity * ratio;

    const newLot: ShortPositionLot = {
      quantity: newCoins,
      price: 0, // Forked coins have no proceeds
      totalProceeds: 0,
    };

    let newPos = pos.short!.get(newSymbol);
    if (!newPos) {
      newPos = {
        symbol: newSymbol,
        quantity: newCoins,
        totalProceeds: 0,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      pos.short!.set(newSymbol, newPos);
    } else {
      newPos.quantity += newCoins;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }
  }

  if (long || short) {
    pos.modified = actTime;
  }
}

/**
 * Handles an airdrop by creating positions in the airdropped token.
 * @param pos - The position to modify
 * @param holderSymbol - The asset symbol that qualifies for the airdrop (can be null for universal airdrops)
 * @param airdropSymbol - The airdropped token symbol
 * @param amountPerToken - The airdrop amount per token held (ignored if holderSymbol is null)
 * @param fixedAmount - Fixed airdrop amount (used if holderSymbol is null)
 * @param time - The transaction time (default: current date)
 * @throws Error if both holderSymbol and fixedAmount are null, or amountPerToken is negative
 */
export function handleAirdrop(
  pos: Position,
  holderSymbol: string | null,
  airdropSymbol: string,
  amountPerToken: number = 0,
  fixedAmount: number = 0,
  time?: Date
) {
  if (!holderSymbol && fixedAmount <= 0) {
    throw new Error(
      "Either holderSymbol with amountPerToken or fixedAmount must be specified"
    );
  }
  if (amountPerToken < 0) {
    throw new Error(
      `Invalid airdrop amount: ${amountPerToken}. Must be non-negative.`
    );
  }

  const actTime = time ?? new Date();

  let airdropQuantity = 0;

  if (holderSymbol) {
    // Proportional airdrop based on holdings
    const long = pos.long?.get(holderSymbol);
    if (long) {
      airdropQuantity = long.quantity * amountPerToken;
    }
  } else {
    // Fixed airdrop amount
    airdropQuantity = fixedAmount;
  }

  if (airdropQuantity <= 0) {
    return; // No airdrop to process
  }

  // Create new position in airdropped token
  const newLot: LongPositionLot = {
    quantity: airdropQuantity,
    price: 0, // Airdropped tokens have no cost basis
    totalCost: 0,
  };

  // Initialize if needed
  pos.long ??= new Map();

  let newPos = pos.long.get(airdropSymbol);
  if (!newPos) {
    newPos = {
      symbol: airdropSymbol,
      quantity: airdropQuantity,
      totalCost: 0,
      realisedPnL: 0,
      lots: [newLot],
      created: actTime,
      modified: actTime,
    };
    pos.long.set(airdropSymbol, newPos);
  } else {
    newPos.quantity += airdropQuantity;
    newPos.lots.push(newLot);
    newPos.modified = actTime;
  }

  pos.modified = actTime;
}

/**
 * Handles a token swap/migration by exchanging positions from old to new token.
 * @param pos - The position to modify
 * @param oldSymbol - The old token symbol
 * @param newSymbol - The new token symbol
 * @param ratio - The exchange ratio of new tokens per old token (default: 1)
 * @param time - The transaction time (default: current date)
 * @throws Error if the swap ratio is not positive
 */
export function handleTokenSwap(
  pos: Position,
  oldSymbol: string,
  newSymbol: string,
  ratio: number = 1,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid swap ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = pos.long?.get(oldSymbol);
  if (long) {
    const newTokens = long.quantity * ratio;

    // Create new position in new token with same cost basis
    const newLot: LongPositionLot = {
      quantity: newTokens,
      price: long.totalCost / newTokens, // Preserve cost basis
      totalCost: long.totalCost,
    };

    let newPos = pos.long!.get(newSymbol);
    if (!newPos) {
      newPos = {
        symbol: newSymbol,
        quantity: newLot.quantity,
        totalCost: newLot.totalCost,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      pos.long!.set(newSymbol, newPos);
    } else {
      newPos.quantity += newLot.quantity;
      newPos.totalCost += newLot.totalCost;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }

    // Remove old position
    pos.long!.delete(oldSymbol);
  }

  const short = pos.short?.get(oldSymbol);
  if (short) {
    const newTokens = short.quantity * ratio;

    const newLot: ShortPositionLot = {
      quantity: newTokens,
      price: short.totalProceeds / newTokens, // Preserve proceeds basis
      totalProceeds: short.totalProceeds,
    };

    let newPos = pos.short!.get(newSymbol);
    if (!newPos) {
      newPos = {
        symbol: newSymbol,
        quantity: newLot.quantity,
        totalProceeds: newLot.totalProceeds,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      pos.short!.set(newSymbol, newPos);
    } else {
      newPos.quantity += newLot.quantity;
      newPos.totalProceeds += newLot.totalProceeds;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }

    pos.short!.delete(oldSymbol);
  }

  if (long || short) {
    pos.modified = actTime;
  }
}

/**
 * Handles staking rewards by increasing position quantity.
 * @param pos - The position to modify
 * @param symbol - The staked asset symbol
 * @param rewardPerToken - The reward amount per staked token
 * @param time - The transaction time (default: current date)
 * @returns The total quantity of rewards received
 * @throws Error if the reward amount is negative
 */
export function handleStakingReward(
  pos: Position,
  symbol: string,
  rewardPerToken: number,
  time?: Date
): number {
  if (rewardPerToken < 0) {
    throw new Error(
      `Invalid reward amount: ${rewardPerToken}. Must be non-negative.`
    );
  }

  const actTime = time ?? new Date();

  let totalRewards = 0;

  const long = pos.long?.get(symbol);
  if (long) {
    const rewardQuantity = long.quantity * rewardPerToken;
    totalRewards = rewardQuantity;

    // Create new lot for rewards with zero cost basis
    const rewardLot: LongPositionLot = {
      quantity: rewardQuantity,
      price: 0,
      totalCost: 0,
    };

    long.quantity += rewardQuantity;
    // totalCost remains unchanged (rewards have no cost)
    long.lots.push(rewardLot);
    long.modified = actTime;
  }

  if (long) {
    pos.modified = actTime;
  }

  return totalRewards;
}

import type { Asset } from "../types/asset.js";
import type { Portfolio } from "../types/portfolio.js";
import type { LongPositionLot, ShortPositionLot } from "../types/position.js";

/**
 * Handles a hard fork by creating positions in the new cryptocurrency.
 * @param p - The portfolio to modify
 * @param asset - The original cryptocurrency asset
 * @param newAsset - The forked cryptocurrency asset
 * @param ratio - The number of new coins per original coin (default: 1)
 * @param time - The transaction time (default: current date)
 * @throws Error if the hard fork ratio is not positive
 */
export function handleHardFork(
  p: Portfolio,
  asset: Asset,
  newAsset: Asset,
  ratio: number = 1,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid hard fork ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = p.longPosition?.get(asset.symbol);
  if (long) {
    const newCoins = long.quantity * ratio;

    // Create new position in forked cryptocurrency
    const newLot: LongPositionLot = {
      quantity: newCoins,
      price: 0, // Forked coins have no cost basis
      totalCost: 0,
      created: actTime,
      modified: actTime,
    };

    // Initialize if needed
    p.longPosition ??= new Map();

    // Add to position
    let newPos = p.longPosition.get(newAsset.symbol);
    if (!newPos) {
      newPos = {
        symbol: newAsset.symbol,
        quantity: newCoins,
        totalCost: 0,
        averageCost: 0,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      p.longPosition.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newCoins;
      newPos.averageCost = newPos.totalCost / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }
  }

  const short = p.shortPosition?.get(asset.symbol);
  if (short) {
    const newCoins = short.quantity * ratio;

    const newLot: ShortPositionLot = {
      quantity: newCoins,
      price: 0, // Forked coins have no proceeds
      totalProceeds: 0,
      created: actTime,
      modified: actTime,
    };

    // Initialize if needed
    p.shortPosition ??= new Map();

    let newPos = p.shortPosition.get(newAsset.symbol);
    if (!newPos) {
      newPos = {
        symbol: newAsset.symbol,
        quantity: newCoins,
        totalProceeds: 0,
        averageProceeds: 0,
        realisedPnL: 0,
        lots: [newLot],
        created: actTime,
        modified: actTime,
      };
      p.shortPosition.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newCoins;
      newPos.averageProceeds = newPos.totalProceeds / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }
  }

  p.modified = actTime;
}

/**
 * Handles an airdrop by creating positions in the airdropped token.
 * @param p - The portfolio to modify
 * @param holderAsset - The asset holdings that qualify for the airdrop (can be null for universal airdrops)
 * @param airdropAsset - The airdropped token asset
 * @param amountPerToken - The airdrop amount per token held (ignored if holderAsset is null)
 * @param fixedAmount - Fixed airdrop amount (used if holderAsset is null)
 * @param time - The transaction time (default: current date)
 * @throws Error if both holderAsset and fixedAmount are null, or amountPerToken is negative
 */
export function handleAirdrop(
  p: Portfolio,
  holderAsset: Asset | null,
  airdropAsset: Asset,
  amountPerToken: number = 0,
  fixedAmount: number = 0,
  time?: Date
) {
  if (!holderAsset && fixedAmount <= 0) {
    throw new Error(
      "Either holderAsset with amountPerToken or fixedAmount must be specified"
    );
  }
  if (amountPerToken < 0) {
    throw new Error(
      `Invalid airdrop amount: ${amountPerToken}. Must be non-negative.`
    );
  }

  const actTime = time ?? new Date();

  let airdropQuantity = 0;

  if (holderAsset) {
    // Proportional airdrop based on holdings
    const long = p.longPosition?.get(holderAsset.symbol);
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
    created: actTime,
    modified: actTime,
  };

  // Initialize if needed
  p.longPosition ??= new Map();

  let newPos = p.longPosition.get(airdropAsset.symbol);
  if (!newPos) {
    newPos = {
      symbol: airdropAsset.symbol,
      quantity: airdropQuantity,
      totalCost: 0,
      averageCost: 0,
      realisedPnL: 0,
      lots: [newLot],
      created: actTime,
      modified: actTime,
    };
    p.longPosition.set(airdropAsset.symbol, newPos);
  } else {
    newPos.quantity += airdropQuantity;
    newPos.averageCost = newPos.totalCost / newPos.quantity;
    newPos.lots.push(newLot);
    newPos.modified = actTime;
  }

  p.modified = actTime;
}

/**
 * Handles a token swap/migration by exchanging positions from old to new token.
 * @param p - The portfolio to modify
 * @param oldAsset - The old token asset
 * @param newAsset - The new token asset
 * @param ratio - The exchange ratio of new tokens per old token (default: 1)
 * @param time - The transaction time (default: current date)
 * @throws Error if the swap ratio is not positive
 */
export function handleTokenSwap(
  p: Portfolio,
  oldAsset: Asset,
  newAsset: Asset,
  ratio: number = 1,
  time?: Date
) {
  if (ratio <= 0) {
    throw new Error(`Invalid swap ratio: ${ratio}. Must be positive.`);
  }

  const actTime = time ?? new Date();

  const long = p.longPosition?.get(oldAsset.symbol);
  if (long) {
    const newTokens = long.quantity * ratio;

    // Create new position in new token with same cost basis
    const newLot: LongPositionLot = {
      quantity: newTokens,
      price: long.totalCost / newTokens, // Preserve cost basis
      totalCost: long.totalCost,
      created: actTime,
      modified: actTime,
    };

    // Initialize if needed
    p.longPosition ??= new Map();

    let newPos = p.longPosition.get(newAsset.symbol);
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
      p.longPosition.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newLot.quantity;
      newPos.totalCost += newLot.totalCost;
      newPos.averageCost = newPos.totalCost / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }

    // Remove old position
    p.longPosition.delete(oldAsset.symbol);
  }

  const short = p.shortPosition?.get(oldAsset.symbol);
  if (short) {
    const newTokens = short.quantity * ratio;

    const newLot: ShortPositionLot = {
      quantity: newTokens,
      price: short.totalProceeds / newTokens, // Preserve proceeds basis
      totalProceeds: short.totalProceeds,
      created: actTime,
      modified: actTime,
    };

    // Initialize if needed
    p.shortPosition ??= new Map();

    let newPos = p.shortPosition.get(newAsset.symbol);
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
      p.shortPosition.set(newAsset.symbol, newPos);
    } else {
      newPos.quantity += newLot.quantity;
      newPos.totalProceeds += newLot.totalProceeds;
      newPos.averageProceeds = newPos.totalProceeds / newPos.quantity;
      newPos.lots.push(newLot);
      newPos.modified = actTime;
    }

    p.shortPosition.delete(oldAsset.symbol);
  }

  p.modified = actTime;
}

/**
 * Handles staking rewards by increasing position quantity.
 * @param p - The portfolio to modify
 * @param asset - The staked asset
 * @param rewardPerToken - The reward amount per staked token
 * @param time - The transaction time (default: current date)
 * @returns The total quantity of rewards received
 * @throws Error if the reward amount is negative
 */
export function handleStakingReward(
  p: Portfolio,
  asset: Asset,
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

  const long = p.longPosition?.get(asset.symbol);
  if (long) {
    const rewardQuantity = long.quantity * rewardPerToken;
    totalRewards = rewardQuantity;

    // Create new lot for rewards with zero cost basis
    const rewardLot: LongPositionLot = {
      quantity: rewardQuantity,
      price: 0,
      totalCost: 0,
      created: actTime,
      modified: actTime,
    };

    long.quantity += rewardQuantity;
    // totalCost remains unchanged (rewards have no cost)
    long.averageCost = long.totalCost / long.quantity;
    long.lots.push(rewardLot);
    long.modified = actTime;
  }

  p.modified = actTime;

  return totalRewards;
}

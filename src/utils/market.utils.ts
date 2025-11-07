import type { Portfolio } from "../types/portfolio.js";
import type { MarketSnapshot, Universe } from "../types/market.js";
import type { Asset } from "../types/asset.js";
import type { Position } from "../types/position.js";

/**
 * Creates a Universe implementation with filtering capabilities.
 *
 * @param assets - Map of symbol to Asset
 * @param timestamp - Optional timestamp when this universe is valid
 * @returns A Universe object with all filtering methods implemented
 */
export function createUniverse(
  assets: Map<string, Asset>,
  timestamp?: Date
): Universe {
  const universe: Universe = {
    assets,
    ...(timestamp && { timestamp }),

    getValidAssets(ts: Date): Map<string, Asset> {
      const valid = new Map<string, Asset>();
      for (const [symbol, asset] of assets) {
        if (isAssetValidAt(asset, ts)) {
          valid.set(symbol, asset);
        }
      }
      return valid;
    },

    isAssetValid(symbol: string, ts: Date): boolean {
      const asset = assets.get(symbol);
      return asset ? isAssetValidAt(asset, ts) : false;
    },

    getSymbols(): string[] {
      return Array.from(assets.keys());
    },

    getType(symbol: string): string {
      return assets.get(symbol)?.type ?? "";
    },

    getExchange(symbol: string): string {
      return assets.get(symbol)?.exchange ?? "";
    },

    getCurrency(symbol: string): string {
      return assets.get(symbol)?.currency ?? "";
    },

    filterByType(type: string): Asset[] {
      const assetList = timestamp
        ? Array.from(this.getValidAssets(timestamp).values())
        : Array.from(assets.values());
      return assetList.filter((a) => a.type === type);
    },

    filterByExchange(exchange: string): Asset[] {
      const assetList = timestamp
        ? Array.from(this.getValidAssets(timestamp).values())
        : Array.from(assets.values());
      return assetList.filter((a) => a.exchange === exchange);
    },

    filterByCurrency(currency: string): Asset[] {
      const assetList = timestamp
        ? Array.from(this.getValidAssets(timestamp).values())
        : Array.from(assets.values());
      return assetList.filter((a) => a.currency === currency);
    },
  };

  return universe;
}

/**
 * Appraises a single position by calculating its total value.
 * Sums cash + long positions - short positions.
 *
 * @param position - Position to appraise
 * @param snapshot - Market snapshot with current prices
 * @returns Total position value
 */
export function appraisePosition(
  position: Position,
  snapshot: MarketSnapshot
): number {
  let total = position.cash;

  // Add long position values
  if (position.long) {
    for (const [symbol, longPos] of position.long) {
      const price = snapshot.price.get(symbol) ?? 0;
      total += longPos.quantity * price;
    }
  }

  // Subtract short position liabilities
  if (position.short) {
    for (const [symbol, shortPos] of position.short) {
      const price = snapshot.price.get(symbol) ?? 0;
      total -= shortPos.quantity * price;
    }
  }

  return total;
}

/**
 * Appraises a portfolio by calculating its total value across currencies.
 * Sums cash + long positions - short positions per currency.
 *
 * @param portfolio - Portfolio to appraise
 * @param snapshot - Market snapshot with current prices
 * @returns Map of currency to total portfolio value
 */
export function appraisePortfolio(
  portfolio: Portfolio,
  snapshot: MarketSnapshot
): Map<string, number> {
  const result = new Map<string, number>();

  for (const [currency, pos] of portfolio.positions) {
    result.set(currency, appraisePosition(pos, snapshot));
  }

  return result;
}

/**
 * Calculates unrealized profit and loss for a position.
 * Long: (currentPrice - averageCost) × quantity
 * Short: (averageProceeds - currentPrice) × quantity
 *
 * @param position - Position to calculate unrealized P&L for
 * @param snapshot - Market snapshot with current prices
 * @returns Total unrealized P&L across all positions
 */
export function calculateUnrealizedPnL(
  position: Position,
  snapshot: MarketSnapshot
): number {
  let unrealizedPnL = 0;

  // Calculate unrealized P&L for long positions
  if (position.long) {
    for (const [symbol, longPos] of position.long) {
      const currentPrice = snapshot.price.get(symbol) ?? 0;
      unrealizedPnL += (currentPrice - longPos.averageCost) * longPos.quantity;
    }
  }

  // Calculate unrealized P&L for short positions
  if (position.short) {
    for (const [symbol, shortPos] of position.short) {
      const currentPrice = snapshot.price.get(symbol) ?? 0;
      unrealizedPnL +=
        (shortPos.averageProceeds - currentPrice) * shortPos.quantity;
    }
  }

  return unrealizedPnL;
}

/**
 * Checks if an asset is valid at a given timestamp.
 * An asset is valid if:
 * - validFrom is null/undefined OR timestamp >= validFrom
 * - validUntil is null/undefined OR timestamp <= validUntil
 *
 * @param asset - The asset to check
 * @param timestamp - The timestamp to check validity against
 * @returns true if the asset is valid at the given timestamp
 */
export function isAssetValidAt(asset: Asset, timestamp: Date): boolean {
  const validFromCheck = !asset.validFrom || timestamp >= asset.validFrom;
  const validUntilCheck = !asset.validUntil || timestamp <= asset.validUntil;
  return validFromCheck && validUntilCheck;
}

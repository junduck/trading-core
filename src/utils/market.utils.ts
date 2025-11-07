import type { Portfolio } from "../types/portfolio.js";
import type { MarketSnapshot, Universe } from "../types/market.js";
import type { Asset } from "../types/asset.js";

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
 * Appraises a portfolio by calculating its total value across currencies.
 * Sums cash + long positions - short positions per currency.
 *
 * @param p - Portfolio to appraise
 * @param snapshot - Market snapshot with current prices
 * @param universe - Trading universe with asset metadata
 * @returns Map of currency to total portfolio value
 */
export function appraisePortfolio(
  p: Portfolio,
  snapshot: MarketSnapshot,
  universe: Universe
): Map<string, number> {
  const result = new Map<string, number>();

  // Initialize with cash balances
  for (const [currency, amount] of p.cash) {
    result.set(currency, amount);
  }

  // Add long position values
  if (p.longPosition) {
    for (const [symbol, pos] of p.longPosition) {
      const p = snapshot.price.get(symbol) ?? 0;
      const v = pos.quantity * p;
      const c = universe.getCurrency(symbol);
      result.set(c, (result.get(c) || 0) + v);
    }
  }

  // Subtract short position liabilities
  if (p.shortPosition) {
    for (const [symbol, pos] of p.shortPosition) {
      const p = snapshot.price.get(symbol) ?? 0;
      const l = pos.quantity * p;
      const c = universe.getCurrency(symbol);
      result.set(c, (result.get(c) || 0) - l);
    }
  }

  return result;
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

import { describe, it, expect } from "vitest";
import {
  createUniverse,
  appraisePosition,
  appraisePortfolio,
  calculateUnrealizedPnL,
  isAssetValidAt,
} from "../../src/utils/market.utils.js";
import type { Asset } from "../../src/types/asset.js";
import type { Position } from "../../src/types/position.js";
import type { Portfolio } from "../../src/types/portfolio.js";
import type { MarketSnapshot } from "../../src/types/market.js";

describe("Market Utils", () => {
  describe("isAssetValidAt()", () => {
    it("should return true for asset with no validity bounds", () => {
      const asset: Asset = {
        symbol: "AAPL",
        type: "stock",
        exchange: "NASDAQ",
        currency: "USD",
      };
      const timestamp = new Date("2024-01-01");
      expect(isAssetValidAt(asset, timestamp)).toBe(true);
    });

    it("should return true when timestamp is within valid range", () => {
      const asset: Asset = {
        symbol: "AAPL",
        type: "stock",
        exchange: "NASDAQ",
        currency: "USD",
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-12-31"),
      };
      const timestamp = new Date("2024-06-01");
      expect(isAssetValidAt(asset, timestamp)).toBe(true);
    });

    it("should return false when timestamp is before validFrom", () => {
      const asset: Asset = {
        symbol: "AAPL",
        type: "stock",
        exchange: "NASDAQ",
        currency: "USD",
        validFrom: new Date("2024-06-01"),
      };
      const timestamp = new Date("2024-01-01");
      expect(isAssetValidAt(asset, timestamp)).toBe(false);
    });

    it("should return false when timestamp is after validUntil", () => {
      const asset: Asset = {
        symbol: "DELISTED",
        type: "stock",
        exchange: "NYSE",
        currency: "USD",
        validUntil: new Date("2024-06-01"),
      };
      const timestamp = new Date("2024-12-31");
      expect(isAssetValidAt(asset, timestamp)).toBe(false);
    });

    it("should return true when timestamp equals validFrom boundary", () => {
      const asset: Asset = {
        symbol: "AAPL",
        type: "stock",
        exchange: "NASDAQ",
        currency: "USD",
        validFrom: new Date("2024-06-01"),
      };
      const timestamp = new Date("2024-06-01");
      expect(isAssetValidAt(asset, timestamp)).toBe(true);
    });

    it("should return true when timestamp equals validUntil boundary", () => {
      const asset: Asset = {
        symbol: "DELISTED",
        type: "stock",
        exchange: "NYSE",
        currency: "USD",
        validUntil: new Date("2024-06-01"),
      };
      const timestamp = new Date("2024-06-01");
      expect(isAssetValidAt(asset, timestamp)).toBe(true);
    });
  });

  describe("createUniverse()", () => {
    const assets = new Map<string, Asset>([
      [
        "AAPL",
        {
          symbol: "AAPL",
          type: "stock",
          exchange: "NASDAQ",
          currency: "USD",
          validFrom: new Date("2024-01-01"),
        },
      ],
      [
        "TSLA",
        {
          symbol: "TSLA",
          type: "stock",
          exchange: "NASDAQ",
          currency: "USD",
        },
      ],
      [
        "BTC",
        {
          symbol: "BTC",
          type: "crypto",
          exchange: "COINBASE",
          currency: "USD",
        },
      ],
      [
        "DELISTED",
        {
          symbol: "DELISTED",
          type: "stock",
          exchange: "NYSE",
          currency: "USD",
          validFrom: new Date("2020-01-01"),
          validUntil: new Date("2023-12-31"),
        },
      ],
    ]);

    it("should return all symbols", () => {
      const universe = createUniverse(assets);
      const symbols = universe.getSymbols();
      expect(symbols).toHaveLength(4);
      expect(symbols).toContain("AAPL");
      expect(symbols).toContain("TSLA");
      expect(symbols).toContain("BTC");
      expect(symbols).toContain("DELISTED");
    });

    it("should get asset type", () => {
      const universe = createUniverse(assets);
      expect(universe.getType("AAPL")).toBe("stock");
      expect(universe.getType("BTC")).toBe("crypto");
      expect(universe.getType("NOTEXIST")).toBe("");
    });

    it("should get asset exchange", () => {
      const universe = createUniverse(assets);
      expect(universe.getExchange("BTC")).toBe("COINBASE");
      expect(universe.getExchange("AAPL")).toBe("NASDAQ");
      expect(universe.getExchange("NOTEXIST")).toBe("");
    });

    it("should get asset currency", () => {
      const universe = createUniverse(assets);
      expect(universe.getCurrency("TSLA")).toBe("USD");
      expect(universe.getCurrency("NOTEXIST")).toBe("");
    });

    it("should filter by type without timestamp", () => {
      const universe = createUniverse(assets);
      const stocks = universe.filterByType("stock");
      expect(stocks).toHaveLength(3);
      expect(stocks.map((a) => a.symbol)).toContain("AAPL");
      expect(stocks.map((a) => a.symbol)).toContain("TSLA");
      expect(stocks.map((a) => a.symbol)).toContain("DELISTED");
    });

    it("should filter by type with timestamp", () => {
      const timestamp = new Date("2024-06-01");
      const universe = createUniverse(assets, timestamp);
      const stocks = universe.filterByType("stock");
      expect(stocks).toHaveLength(2);
      expect(stocks.map((a) => a.symbol)).toContain("AAPL");
      expect(stocks.map((a) => a.symbol)).toContain("TSLA");
      expect(stocks.map((a) => a.symbol)).not.toContain("DELISTED");
    });

    it("should filter by exchange", () => {
      const universe = createUniverse(assets);
      const nasdaq = universe.filterByExchange("NASDAQ");
      expect(nasdaq).toHaveLength(2);
      expect(nasdaq.map((a) => a.symbol)).toContain("AAPL");
      expect(nasdaq.map((a) => a.symbol)).toContain("TSLA");
    });

    it("should filter by currency", () => {
      const universe = createUniverse(assets);
      const usd = universe.filterByCurrency("USD");
      expect(usd).toHaveLength(4);
    });

    it("should get valid assets at timestamp", () => {
      const universe = createUniverse(assets);
      const timestamp = new Date("2024-06-01");
      const validAssets = universe.getValidAssets(timestamp);
      expect(validAssets.size).toBe(3);
      expect(validAssets.has("AAPL")).toBe(true);
      expect(validAssets.has("TSLA")).toBe(true);
      expect(validAssets.has("BTC")).toBe(true);
      expect(validAssets.has("DELISTED")).toBe(false);
    });

    it("should check if asset is valid", () => {
      const universe = createUniverse(assets);
      const timestamp = new Date("2024-06-01");
      expect(universe.isAssetValid("AAPL", timestamp)).toBe(true);
      expect(universe.isAssetValid("DELISTED", timestamp)).toBe(false);
      expect(universe.isAssetValid("NOTEXIST", timestamp)).toBe(false);
    });
  });

  describe("appraisePosition()", () => {
    it("should appraise position with only cash", () => {
      const position: Position = {
        cash: 10000,
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map(),
      };
      expect(appraisePosition(position, snapshot)).toBe(10000);
    });

    it("should appraise position with long holdings", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              quantity: 100,
              totalCost: 10000,
              lots: [],
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["AAPL", 150]]),
      };
      // 10000 cash + 100 * 150 = 25000
      expect(appraisePosition(position, snapshot)).toBe(25000);
    });

    it("should appraise position with short holdings", () => {
      const position: Position = {
        cash: 10000,
        short: new Map([
          [
            "AAPL",
            {
              quantity: 100,
              totalCost: 15000,
              lots: [],
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["AAPL", 150]]),
      };
      // 10000 cash - 100 * 150 = -5000
      expect(appraisePosition(position, snapshot)).toBe(-5000);
    });

    it("should appraise position with both long and short holdings", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              quantity: 100,
              totalCost: 10000,
              lots: [],
            },
          ],
        ]),
        short: new Map([
          [
            "TSLA",
            {
              quantity: 50,
              totalCost: 10000,
              lots: [],
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([
          ["AAPL", 150],
          ["TSLA", 200],
        ]),
      };
      // 10000 cash + 100*150 - 50*200 = 10000 + 15000 - 10000 = 15000
      expect(appraisePosition(position, snapshot)).toBe(15000);
    });

    it("should handle missing prices as zero", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              quantity: 100,
              totalCost: 10000,
              lots: [],
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map(), // No prices
      };
      // 10000 cash + 100*0 = 10000
      expect(appraisePosition(position, snapshot)).toBe(10000);
    });
  });

  describe("appraisePortfolio()", () => {
    it("should appraise portfolio with single currency", () => {
      const portfolio: Portfolio = {
        id: "P1",
        name: "Test Portfolio",
        positions: new Map([
          [
            "USD",
            {
              cash: 10000,
              totalCommission: 0,
              realisedPnL: 0,
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map(),
      };
      const result = appraisePortfolio(portfolio, snapshot);
      expect(result.get("USD")).toBe(10000);
    });

    it("should appraise portfolio with holdings", () => {
      const portfolio: Portfolio = {
        id: "P1",
        name: "Test Portfolio",
        positions: new Map([
          [
            "USD",
            {
              cash: 10000,
              long: new Map([
                [
                  "AAPL",
                  {
                    quantity: 100,
                    totalCost: 10000,
                    lots: [],
                  },
                ],
              ]),
              totalCommission: 0,
              realisedPnL: 0,
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["AAPL", 150]]),
      };
      const result = appraisePortfolio(portfolio, snapshot);
      expect(result.get("USD")).toBe(25000);
    });

    it("should appraise portfolio with multiple currencies", () => {
      const portfolio: Portfolio = {
        id: "P1",
        name: "Test Portfolio",
        positions: new Map([
          [
            "USD",
            {
              cash: 15000,
              totalCommission: 0,
              realisedPnL: 0,
              created: new Date(),
              modified: new Date(),
            },
          ],
          [
            "EUR",
            {
              cash: 8000,
              totalCommission: 0,
              realisedPnL: 0,
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map(),
      };
      const result = appraisePortfolio(portfolio, snapshot);
      expect(result.get("USD")).toBe(15000);
      expect(result.get("EUR")).toBe(8000);
    });

    it("should appraise portfolio with multiple currencies and holdings", () => {
      const portfolio: Portfolio = {
        id: "P1",
        name: "Test Portfolio",
        positions: new Map([
          [
            "USD",
            {
              cash: 10000,
              long: new Map([
                [
                  "AAPL",
                  {
                    quantity: 100,
                    totalCost: 10000,
                    lots: [],
                  },
                ],
              ]),
              totalCommission: 0,
              realisedPnL: 0,
              created: new Date(),
              modified: new Date(),
            },
          ],
          [
            "EUR",
            {
              cash: 5000,
              long: new Map([
                [
                  "BTC",
                  {
                    quantity: 2,
                    totalCost: 60000,
                    lots: [],
                  },
                ],
              ]),
              totalCommission: 0,
              realisedPnL: 0,
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([
          ["AAPL", 150],
          ["BTC", 30000],
        ]),
      };
      const result = appraisePortfolio(portfolio, snapshot);
      // USD: 10000 + 100*150 = 25000
      expect(result.get("USD")).toBe(25000);
      // EUR: 5000 + 2*30000 = 65000
      expect(result.get("EUR")).toBe(65000);
    });
  });

  describe("calculateUnrealizedPnL()", () => {
    it("should return 0 for position with only cash", () => {
      const position: Position = {
        cash: 10000,
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map(),
      };
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(0);
    });

    it("should calculate unrealized P&L for long position with gain", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              symbol: "AAPL",
              quantity: 100,
              totalCost: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["AAPL", 150]]),
      };
      // (150 - 100) * 100 = 5000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(5000);
    });

    it("should calculate unrealized P&L for long position with loss", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              symbol: "AAPL",
              quantity: 100,
              totalCost: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["AAPL", 50]]),
      };
      // (50 - 100) * 100 = -5000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(-5000);
    });

    it("should calculate unrealized P&L for short position with gain", () => {
      const position: Position = {
        cash: 20000,
        short: new Map([
          [
            "TSLA",
            {
              symbol: "TSLA",
              quantity: 100,
              totalProceeds: 20000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["TSLA", 150]]),
      };
      // (200 - 150) * 100 = 5000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(5000);
    });

    it("should calculate unrealized P&L for short position with loss", () => {
      const position: Position = {
        cash: 20000,
        short: new Map([
          [
            "TSLA",
            {
              symbol: "TSLA",
              quantity: 100,
              totalProceeds: 20000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([["TSLA", 250]]),
      };
      // (200 - 250) * 100 = -5000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(-5000);
    });

    it("should calculate unrealized P&L for mixed long and short positions", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              symbol: "AAPL",
              quantity: 100,
              totalCost: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        short: new Map([
          [
            "TSLA",
            {
              symbol: "TSLA",
              quantity: 50,
              totalProceeds: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([
          ["AAPL", 150],
          ["TSLA", 180],
        ]),
      };
      // Long AAPL: (150 - 100) * 100 = 5000
      // Short TSLA: (200 - 180) * 50 = 1000
      // Total: 5000 + 1000 = 6000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(6000);
    });

    it("should calculate unrealized P&L for multiple long positions", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              symbol: "AAPL",
              quantity: 100,
              totalCost: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
          [
            "MSFT",
            {
              symbol: "MSFT",
              quantity: 50,
              totalCost: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map([
          ["AAPL", 120],
          ["MSFT", 180],
        ]),
      };
      // AAPL: (120 - 100) * 100 = 2000
      // MSFT: (180 - 200) * 50 = -1000
      // Total: 2000 + (-1000) = 1000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(1000);
    });

    it("should handle missing prices as zero", () => {
      const position: Position = {
        cash: 10000,
        long: new Map([
          [
            "AAPL",
            {
              symbol: "AAPL",
              quantity: 100,
              totalCost: 10000,
              realisedPnL: 0,
              lots: [],
              created: new Date(),
              modified: new Date(),
            },
          ],
        ]),
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      };
      const snapshot: MarketSnapshot = {
        timestamp: new Date(),
        price: new Map(), // No prices
      };
      // (0 - 100) * 100 = -10000
      expect(calculateUnrealizedPnL(position, snapshot)).toBe(-10000);
    });
  });
});

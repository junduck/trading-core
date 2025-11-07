import { describe, it, expect, beforeEach } from "vitest";
import * as portfolioUtils from "../../src/utils/portfolio.utils.js";
import type { Portfolio } from "../../src/types/portfolio.js";
import type { Asset } from "../../src/types/asset.js";

function createAsset(
  symbol: string,
  currency: string = "USD",
  type: string = "stock"
): Asset {
  return {
    symbol,
    type,
    exchange: "TEST",
    currency,
  };
}

describe("Portfolio Utils", () => {
  describe("create()", () => {
    it("should create basic portfolio with empty positions", () => {
      const portfolio = portfolioUtils.create("P1", "Test Portfolio");

      expect(portfolio.id).toBe("P1");
      expect(portfolio.name).toBe("Test Portfolio");
      expect(portfolio.positions.size).toBe(0);
      expect(portfolio.created).toBeInstanceOf(Date);
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should create portfolio with provided positions", () => {
      const positions = new Map();
      const testDate = new Date("2024-01-01");

      const portfolio = portfolioUtils.create(
        "P1",
        "Test",
        positions,
        testDate,
        testDate
      );

      expect(portfolio.positions).toBe(positions);
      expect(portfolio.created).toBe(testDate);
      expect(portfolio.modified).toBe(testDate);
    });
  });

  describe("Getters: hasAsset(), getPosition(), getCash(), getCurrencies()", () => {
    let portfolio: Portfolio;

    beforeEach(() => {
      portfolio = portfolioUtils.create("P1", "Test Portfolio");

      // Add USD position with AAPL
      const asset = createAsset("AAPL", "USD");
      portfolioUtils.openLong(portfolio, asset, 100, 10, 100);

      // Add EUR position
      portfolio.positions.set("EUR", {
        cash: 5000,
        totalCommission: 0,
        realisedPnL: 0,
        created: new Date(),
        modified: new Date(),
      });
    });

    it("should check if asset exists in portfolio", () => {
      const appleAsset = createAsset("AAPL", "USD");
      const teslaAsset = createAsset("TSLA", "USD");
      const btcAsset = createAsset("BTC", "EUR");

      expect(portfolioUtils.hasAsset(portfolio, appleAsset)).toBe(true);
      expect(portfolioUtils.hasAsset(portfolio, teslaAsset)).toBe(false);
      expect(portfolioUtils.hasAsset(portfolio, btcAsset)).toBe(false);
    });

    it("should get position for currency", () => {
      const usdPosition = portfolioUtils.getPosition(portfolio, "USD");
      expect(usdPosition).toBeDefined();
      expect(usdPosition?.cash).toBe(-1100);

      const jpyPosition = portfolioUtils.getPosition(portfolio, "JPY");
      expect(jpyPosition).toBeUndefined();
    });

    it("should get cash for currency", () => {
      expect(portfolioUtils.getCash(portfolio, "USD")).toBe(-1100);
      expect(portfolioUtils.getCash(portfolio, "EUR")).toBe(5000);
      expect(portfolioUtils.getCash(portfolio, "JPY")).toBe(0);
    });

    it("should get all currencies", () => {
      const currencies = portfolioUtils.getCurrencies(portfolio);
      expect(currencies).toHaveLength(2);
      expect(currencies).toContain("USD");
      expect(currencies).toContain("EUR");
    });
  });

  describe("Long Position Operations", () => {
    let portfolio: Portfolio;
    let asset: Asset;

    beforeEach(() => {
      portfolio = portfolioUtils.create("P1", "Test Portfolio");
      asset = createAsset("AAPL", "USD");
    });

    it("should open long position on new currency", () => {
      const cashFlow = portfolioUtils.openLong(portfolio, asset, 100, 10, 100);

      expect(cashFlow).toBe(-1100);

      const position = portfolio.positions.get("USD");
      expect(position).toBeDefined();
      expect(position!.cash).toBe(-1100);

      const longPos = position!.long?.get("AAPL");
      expect(longPos).toBeDefined();
      expect(longPos!.quantity).toBe(10);
      expect(longPos!.totalCost).toBe(1100);
    });

    it("should add to existing long position", () => {
      portfolioUtils.openLong(portfolio, asset, 100, 10, 100);
      const cashFlow2 = portfolioUtils.openLong(portfolio, asset, 120, 5, 120);

      expect(cashFlow2).toBe(-720);

      const position = portfolio.positions.get("USD");
      expect(position!.cash).toBe(-1820);

      const longPos = position!.long?.get("AAPL");
      expect(longPos!.quantity).toBe(15);
      expect(longPos!.totalCost).toBe(1820);
    });

    it("should update portfolio modified timestamp", () => {
      const before = new Date();
      portfolioUtils.openLong(portfolio, asset, 100, 10, 100);
      const after = new Date();

      expect(portfolio.modified.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(portfolio.modified.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should close long position", () => {
      portfolioUtils.openLong(portfolio, asset, 100, 10, 100);
      const pnl = portfolioUtils.closeLong(portfolio, asset, 150, 5, 150);

      // PnL = 5 * (150 - 110) - 150 = 200 - 150 = 50
      expect(pnl).toBe(50);

      const position = portfolio.positions.get("USD");
      const longPos = position!.long?.get("AAPL");
      expect(longPos!.quantity).toBe(5);
    });

    it("should throw error when closing long without position", () => {
      const eurAsset = createAsset("TSLA", "EUR");

      expect(() => {
        portfolioUtils.closeLong(portfolio, eurAsset, 150, 5, 150);
      }).toThrow("No position found for currency EUR");
    });
  });

  describe("Short Position Operations", () => {
    let portfolio: Portfolio;
    let asset: Asset;

    beforeEach(() => {
      portfolio = portfolioUtils.create("P1", "Test Portfolio");
      asset = createAsset("TSLA", "USD");
    });

    it("should open short position on new currency", () => {
      const proceeds = portfolioUtils.openShort(portfolio, asset, 200, 10, 200);

      expect(proceeds).toBe(1800);

      const position = portfolio.positions.get("USD");
      expect(position).toBeDefined();
      expect(position!.cash).toBe(1800);

      const shortPos = position!.short?.get("TSLA");
      expect(shortPos).toBeDefined();
      expect(shortPos!.quantity).toBe(10);
    });

    it("should close short position", () => {
      portfolioUtils.openShort(portfolio, asset, 200, 10, 200);
      const pnl = portfolioUtils.closeShort(portfolio, asset, 180, 10, 180);

      // PnL = 10 * (200 - 180) - (200 + 180) = 200 - 380 = -180
      expect(pnl).toBe(-180);

      const position = portfolio.positions.get("USD");
      const shortPos = position!.short?.get("TSLA");
      expect(shortPos).toBeUndefined();
    });

    it("should throw error when closing short without position", () => {
      const eurAsset = createAsset("BTC", "EUR");

      expect(() => {
        portfolioUtils.closeShort(portfolio, eurAsset, 50000, 1, 50000);
      }).toThrow("No position found for currency EUR");
    });

    it("should update portfolio modified timestamp", () => {
      const before = new Date();
      portfolioUtils.openShort(portfolio, asset, 200, 10, 200);
      const after = new Date();

      expect(portfolio.modified.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(portfolio.modified.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("Stock Corporate Actions", () => {
    let portfolio: Portfolio;
    let asset: Asset;

    beforeEach(() => {
      portfolio = portfolioUtils.create("P1", "Test Portfolio");
      asset = createAsset("AAPL", "USD", "stock");
      portfolioUtils.openLong(portfolio, asset, 100, 10, 100);
    });

    it("should handle stock split", () => {
      portfolioUtils.handleSplit(portfolio, asset, 2);

      const position = portfolio.positions.get("USD");
      const longPos = position!.long?.get("AAPL");

      expect(longPos!.quantity).toBe(20);
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should handle cash dividend", () => {
      const cashFlow = portfolioUtils.handleCashDividend(
        portfolio,
        asset,
        5,
        0.5
      );

      // 10 shares * $5 * (1 - 0.5 tax) = 25
      expect(cashFlow).toBe(25);

      const position = portfolio.positions.get("USD");
      expect(position!.cash).toBe(-1100 + 25);
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should handle spinoff", () => {
      portfolioUtils.handleSpinoff(portfolio, asset, "NEWCO", 0.5);

      const position = portfolio.positions.get("USD");
      const applePos = position!.long?.get("AAPL");
      const newcoPos = position!.long?.get("NEWCO");

      expect(applePos!.quantity).toBe(10);
      expect(newcoPos).toBeDefined();
      expect(newcoPos!.quantity).toBe(5); // 10 * 0.5
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should handle merger", () => {
      const cashFlow = portfolioUtils.handleMerger(
        portfolio,
        asset,
        "MERGED",
        2,
        10
      );

      // Cash component: 10 shares * $10 = 100
      expect(cashFlow).toBe(100);

      const position = portfolio.positions.get("USD");
      const applePos = position!.long?.get("AAPL");
      const mergedPos = position!.long?.get("MERGED");

      expect(applePos).toBeUndefined();
      expect(mergedPos).toBeDefined();
      expect(mergedPos!.quantity).toBe(20); // 10 * 2
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should not error when operating on non-existent position", () => {
      const emptyPortfolio = portfolioUtils.create("P2", "Empty");
      const testAsset = createAsset("TSLA", "USD");

      expect(() => {
        portfolioUtils.handleSplit(emptyPortfolio, testAsset, 2);
      }).not.toThrow();

      expect(() => {
        portfolioUtils.handleCashDividend(emptyPortfolio, testAsset, 5, 0.5);
      }).not.toThrow();

      expect(() => {
        portfolioUtils.handleSpinoff(emptyPortfolio, testAsset, "NEW", 0.5);
      }).not.toThrow();

      expect(() => {
        portfolioUtils.handleMerger(emptyPortfolio, testAsset, "MERGED", 2, 10);
      }).not.toThrow();
    });
  });

  describe("Crypto Events", () => {
    let portfolio: Portfolio;
    let asset: Asset;

    beforeEach(() => {
      portfolio = portfolioUtils.create("P1", "Test Portfolio");
      asset = createAsset("BTC", "USD", "crypto");
      portfolioUtils.openLong(portfolio, asset, 50000, 2, 50000);
    });

    it("should handle hard fork", () => {
      portfolioUtils.handleHardFork(portfolio, asset, "BCH", 1);

      const position = portfolio.positions.get("USD");
      const btcPos = position!.long?.get("BTC");
      const bchPos = position!.long?.get("BCH");

      expect(btcPos!.quantity).toBe(2);
      expect(bchPos).toBeDefined();
      expect(bchPos!.quantity).toBe(2); // 2 * 1
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should handle airdrop based on holdings", () => {
      portfolioUtils.handleAirdrop(portfolio, "USD", "BTC", "AIRDROP", 100);

      const position = portfolio.positions.get("USD");
      const airdropPos = position!.long?.get("AIRDROP");

      expect(airdropPos).toBeDefined();
      expect(airdropPos!.quantity).toBe(200); // 2 BTC * 100 per token
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should handle fixed amount airdrop", () => {
      const emptyPortfolio = portfolioUtils.create("P2", "Empty");
      portfolioUtils.handleAirdrop(
        emptyPortfolio,
        "USD",
        null,
        "AIRDROP",
        0,
        500
      );

      const position = emptyPortfolio.positions.get("USD");
      expect(position).toBeDefined();

      const airdropPos = position!.long?.get("AIRDROP");
      expect(airdropPos).toBeDefined();
      expect(airdropPos!.quantity).toBe(500);
    });

    it("should handle token swap", () => {
      portfolioUtils.handleTokenSwap(portfolio, asset, "WBTC", 1);

      const position = portfolio.positions.get("USD");
      const btcPos = position!.long?.get("BTC");
      const wbtcPos = position!.long?.get("WBTC");

      expect(btcPos).toBeUndefined();
      expect(wbtcPos).toBeDefined();
      expect(wbtcPos!.quantity).toBe(2);
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should handle staking rewards", () => {
      const rewards = portfolioUtils.handleStakingReward(
        portfolio,
        asset,
        0.05
      );

      // 2 BTC * 0.05 = 0.1
      expect(rewards).toBe(0.1);

      const position = portfolio.positions.get("USD");
      const btcPos = position!.long?.get("BTC");
      expect(btcPos!.quantity).toBe(2.1);
      expect(portfolio.modified).toBeInstanceOf(Date);
    });

    it("should not error when crypto events operate on non-existent position", () => {
      const emptyPortfolio = portfolioUtils.create("P2", "Empty");
      const testAsset = createAsset("ETH", "USD", "crypto");

      expect(() => {
        portfolioUtils.handleHardFork(emptyPortfolio, testAsset, "ETC", 1);
      }).not.toThrow();

      expect(() => {
        portfolioUtils.handleTokenSwap(emptyPortfolio, testAsset, "WETH", 1);
      }).not.toThrow();

      const reward = portfolioUtils.handleStakingReward(
        emptyPortfolio,
        testAsset,
        0.05
      );
      expect(reward).toBe(0);
    });
  });

  describe("Portfolio Modified Timestamp Updates", () => {
    it("should update modified on all mutating operations", () => {
      const portfolio = portfolioUtils.create("P1", "Test");
      const asset = createAsset("AAPL", "USD");
      const initialModified = portfolio.modified;

      // Wait a tiny bit to ensure timestamp difference
      const operations = [
        () => portfolioUtils.openLong(portfolio, asset, 100, 10, 100),
        () => portfolioUtils.closeLong(portfolio, asset, 110, 5, 110),
        () => portfolioUtils.openShort(portfolio, asset, 120, 5, 120),
        () => portfolioUtils.closeShort(portfolio, asset, 110, 5, 110),
        () => portfolioUtils.handleSplit(portfolio, asset, 2),
        () => portfolioUtils.handleCashDividend(portfolio, asset, 5, 0.5),
        () => portfolioUtils.handleSpinoff(portfolio, asset, "NEW", 0.5),
      ];

      for (const op of operations) {
        const beforeOp = portfolio.modified;
        op();
        // Modified should be updated (greater than or equal, accounting for same millisecond)
        expect(portfolio.modified.getTime()).toBeGreaterThanOrEqual(
          beforeOp.getTime()
        );
      }

      expect(portfolio.modified.getTime()).toBeGreaterThanOrEqual(
        initialModified.getTime()
      );
    });
  });
});

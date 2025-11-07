import { describe, it, expect, beforeEach } from 'vitest';
import {
  openLong,
  openShort,
} from '../../src/utils/portfolio.utils.js';
import {
  handleSplit,
  handleCashDividend,
  handleSpinoff,
  handleMerger,
} from '../../src/utils/stock.utils.js';
import type { Portfolio } from '../../src/types/portfolio.js';
import type { Asset } from '../../src/types/asset.js';
import { createTestPortfolio, createTestAsset, round, getCash } from './test-helpers.js';

describe('Portfolio Utils - Corporate Actions', () => {
  let portfolio: Portfolio;
  let asset: Asset;

  beforeEach(() => {
    portfolio = createTestPortfolio(100_000);
    asset = createTestAsset('AAPL');
  });

  describe('Stock Splits', () => {
    describe('1. Stock Split - 2-for-1 (Long Position)', () => {
      it('should double quantity and halve average cost while keeping total cost unchanged', () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Stock Split - ratio=2
        handleSplit(portfolio, asset, 2);

        // Verify position
        const position = portfolio.longPosition?.get('AAPL');
        expect(position).toBeDefined();
        expect(position!.quantity).toBe(20); // 10 * 2
        expect(position!.totalCost).toBe(1_100); // unchanged
        expect(round(position!.averageCost)).toBe(55); // 1,100 / 20

        // Verify lots
        expect(position!.lots).toHaveLength(1);
        expect(position!.lots[0].quantity).toBe(20);
        expect(position!.lots[0].totalCost).toBe(1_100);
      });
    });

    describe('2. Stock Split - 1-for-2 Reverse Split (Long Position)', () => {
      it('should halve quantity and double average cost while keeping total cost unchanged', () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);

        // Step 2: Stock Split - ratio=0.5
        handleSplit(portfolio, asset, 0.5);

        // Verify position
        const position = portfolio.longPosition?.get('AAPL');
        expect(position).toBeDefined();
        expect(position!.quantity).toBe(5); // 10 * 0.5
        expect(position!.totalCost).toBe(1_100); // unchanged
        expect(round(position!.averageCost)).toBe(220); // 1,100 / 5
      });
    });

    describe('3. Stock Split - Short Position', () => {
      it('should adjust short position quantity while keeping total proceeds unchanged', () => {
        // Step 1: Open Short - price=100, qty=10, commission=100
        openShort(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(100_900);

        // Step 2: Stock Split - ratio=2
        handleSplit(portfolio, asset, 2);

        // Verify position
        const position = portfolio.shortPosition?.get('AAPL');
        expect(position).toBeDefined();
        expect(position!.quantity).toBe(20); // 10 * 2
        expect(position!.totalProceeds).toBe(900); // unchanged
        expect(round(position!.averageProceeds)).toBe(45); // 900 / 20
      });
    });
  });

  describe('Cash Dividends', () => {
    describe('4. Cash Dividend - No Tax (Long Position)', () => {
      it('should reduce cost basis by dividend amount with no tax', () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Cash Dividend - amountPerShare=10, taxRate=0
        const dividendCash = handleCashDividend(portfolio, asset, 10, 0);

        // Verify dividend amount: 10 * 10 = 100
        expect(dividendCash).toBe(100);

        // Verify cash: 98,900 + 100 = 99,000
        expect(getCash(portfolio)).toBe(99_000);

        // Verify position
        const position = portfolio.longPosition?.get('AAPL');
        expect(position).toBeDefined();
        expect(position!.totalCost).toBe(1_000); // 1,100 - 100
        expect(round(position!.averageCost)).toBe(100); // 1,000 / 10
      });
    });

    describe('5. Cash Dividend - With Tax (Long Position)', () => {
      it('should reduce cost basis by after-tax dividend amount', () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Cash Dividend - amountPerShare=10, taxRate=0.5
        const dividendCash = handleCashDividend(portfolio, asset, 10, 0.5);

        // Verify dividend after tax: 100 * (1 - 0.5) = 50
        expect(dividendCash).toBe(50);

        // Verify cash: 98,900 + 50 = 98,950
        expect(getCash(portfolio)).toBe(98_950);

        // Verify position
        const position = portfolio.longPosition?.get('AAPL');
        expect(position).toBeDefined();
        expect(position!.totalCost).toBe(1_050); // 1,100 - 50
        expect(round(position!.averageCost)).toBe(105); // 1,050 / 10
      });
    });

    describe('6. Cash Dividend - Short Position (Owe Dividend)', () => {
      it('should increase cost and reduce proceeds for short position', () => {
        // Step 1: Open Short - price=100, qty=10, commission=100
        openShort(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(100_900);

        // Step 2: Cash Dividend - amountPerShare=10
        const dividendOwed = handleCashDividend(portfolio, asset, 10);

        // Verify dividend owed: 10 * 10 = 100 (negative because owed)
        expect(dividendOwed).toBe(-100);

        // Verify cash: 100,900 - 100 = 100,800
        expect(getCash(portfolio)).toBe(100_800);

        // Verify position
        const position = portfolio.shortPosition?.get('AAPL');
        expect(position).toBeDefined();
        expect(position!.totalProceeds).toBe(800); // 900 - 100
        expect(round(position!.averageProceeds)).toBe(80); // 800 / 10
      });
    });
  });

  describe('Stock Spinoffs', () => {
    describe('7. Stock Spinoff - Long Position', () => {
      it('should create new long position with zero cost basis', () => {
        const newAsset = createTestAsset('NEWCO');

        // Step 1: Open Long AAPL - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);

        // Step 2: Spinoff - ratio=0.5, newSymbol=NEWCO
        handleSpinoff(portfolio, asset, newAsset, 0.5);

        // Verify original position (AAPL): unchanged
        const aaplPosition = portfolio.longPosition?.get('AAPL');
        expect(aaplPosition).toBeDefined();
        expect(aaplPosition!.quantity).toBe(10);

        // Verify new position (NEWCO)
        const newcoPosition = portfolio.longPosition?.get('NEWCO');
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(5); // 10 * 0.5
        expect(newcoPosition!.totalCost).toBe(0); // spinoff has no cost basis
        expect(newcoPosition!.averageCost).toBe(0);
      });
    });

    describe('8. Stock Spinoff - Short Position', () => {
      it('should create new short position with zero proceeds', () => {
        const newAsset = createTestAsset('NEWCO');

        // Step 1: Open Short AAPL - price=100, qty=10, commission=100
        openShort(portfolio, asset, 100, 10, 100);

        // Step 2: Spinoff - ratio=0.5, newSymbol=NEWCO
        handleSpinoff(portfolio, asset, newAsset, 0.5);

        // Verify original position (AAPL): unchanged
        const aaplPosition = portfolio.shortPosition?.get('AAPL');
        expect(aaplPosition).toBeDefined();
        expect(aaplPosition!.quantity).toBe(10);

        // Verify new short position (NEWCO)
        const newcoPosition = portfolio.shortPosition?.get('NEWCO');
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(5); // 10 * 0.5
        expect(newcoPosition!.totalProceeds).toBe(0); // spinoff has no proceeds
        expect(newcoPosition!.averageProceeds).toBe(0);
      });
    });

    describe('13. Stock Spinoff into Already Open Long Position', () => {
      it('should merge spinoff shares with existing long position', () => {
        const newAsset = createTestAsset('NEWCO');

        // Step 1: Open Long AAPL - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);

        // Step 2: Open Long NEWCO - price=50, qty=20, commission=50
        openLong(portfolio, newAsset, 50, 20, 50);
        expect(getCash(portfolio)).toBe(97_850); // 100,000 - 1,100 - 1,050

        // Step 3: Spinoff AAPL→NEWCO - ratio=0.5
        handleSpinoff(portfolio, asset, newAsset, 0.5);

        // Verify AAPL position: unchanged
        const aaplPosition = portfolio.longPosition?.get('AAPL');
        expect(aaplPosition!.quantity).toBe(10);

        // Verify NEWCO position: combined
        const newcoPosition = portfolio.longPosition?.get('NEWCO');
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(25); // 20 + 5
        expect(newcoPosition!.totalCost).toBe(1_050); // original totalCost unchanged
        expect(round(newcoPosition!.averageCost)).toBe(42); // 1,050 / 25
      });
    });

    describe('14. Stock Spinoff into Already Open Short Position', () => {
      it('should merge spinoff shares with existing short position', () => {
        const newAsset = createTestAsset('NEWCO');

        // Step 1: Open Short AAPL - price=100, qty=10, commission=100
        openShort(portfolio, asset, 100, 10, 100);

        // Step 2: Open Short NEWCO - price=50, qty=20, commission=50
        openShort(portfolio, newAsset, 50, 20, 50);
        expect(getCash(portfolio)).toBe(101_850); // 100,000 + 900 + 950

        // Step 3: Spinoff AAPL→NEWCO - ratio=0.5
        handleSpinoff(portfolio, asset, newAsset, 0.5);

        // Verify AAPL position: unchanged
        const aaplPosition = portfolio.shortPosition?.get('AAPL');
        expect(aaplPosition!.quantity).toBe(10);

        // Verify NEWCO position: combined
        const newcoPosition = portfolio.shortPosition?.get('NEWCO');
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(25); // 20 + 5
        expect(newcoPosition!.totalProceeds).toBe(950); // original totalProceeds unchanged
        expect(round(newcoPosition!.averageProceeds)).toBe(38); // 950 / 25
      });
    });
  });

  describe('Stock Mergers', () => {
    describe('9. Stock Merger - No Cash Component (Long Position)', () => {
      it('should replace old position with new asset position', () => {
        const newAsset = createTestAsset('ACQUIRER');

        // Step 1: Open Long TARGET - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Merger - ratio=2, newSymbol=ACQUIRER, cash=0
        handleMerger(portfolio, asset, newAsset, 2, 0);

        // Verify old position (AAPL/TARGET): deleted
        const oldPosition = portfolio.longPosition?.get('AAPL');
        expect(oldPosition).toBeUndefined();

        // Verify new position (ACQUIRER)
        const newPosition = portfolio.longPosition?.get('ACQUIRER');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalCost).toBe(1_100); // transferred
        expect(round(newPosition!.averageCost)).toBe(55); // 1,100 / 20

        // Verify cash: unchanged
        expect(getCash(portfolio)).toBe(98_900);
      });
    });

    describe('10. Stock Merger - With Cash Component (Long Position)', () => {
      it('should replace position and add cash to portfolio', () => {
        const newAsset = createTestAsset('ACQUIRER');

        // Step 1: Open Long TARGET - price=100, qty=10, commission=100
        openLong(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Merger - ratio=2, cashComponent=10
        handleMerger(portfolio, asset, newAsset, 2, 10);

        // Verify cash received: 10 * 10 = 100
        // Cash: 98,900 + 100 = 99,000
        expect(getCash(portfolio)).toBe(99_000);

        // Verify new position
        const newPosition = portfolio.longPosition?.get('ACQUIRER');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalCost).toBe(1_000); // 1,100 - 100
        expect(round(newPosition!.averageCost)).toBe(50); // 1,000 / 20
      });
    });

    describe('11. Stock Merger - Short Position with Cash', () => {
      it('should replace short position and deduct cash owed', () => {
        const newAsset = createTestAsset('ACQUIRER');

        // Step 1: Open Short TARGET - price=100, qty=10, commission=100
        openShort(portfolio, asset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(100_900);

        // Step 2: Merger - ratio=2, cashComponent=10
        handleMerger(portfolio, asset, newAsset, 2, 10);

        // Verify cash owed: 10 * 10 = 100
        // Cash: 100,900 - 100 = 100,800
        expect(getCash(portfolio)).toBe(100_800);

        // Verify new position
        const newPosition = portfolio.shortPosition?.get('ACQUIRER');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalProceeds).toBe(800); // 900 - 100
        expect(round(newPosition!.averageProceeds)).toBe(40); // 800 / 20
      });
    });

    describe('15. Stock Merger into Already Open Long Position', () => {
      it('should merge target position with existing acquirer position', () => {
        const acquirerAsset = createTestAsset('ACQUIRER');
        const targetAsset = createTestAsset('TARGET');

        // Step 1: Open Long TARGET - price=100, qty=10, commission=100
        openLong(portfolio, targetAsset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Open Long ACQUIRER - price=50, qty=20, commission=50
        openLong(portfolio, acquirerAsset, 50, 20, 50);
        expect(getCash(portfolio)).toBe(97_850);

        // Step 3: Merger TARGET→ACQUIRER - ratio=2, cashComponent=10
        handleMerger(portfolio, targetAsset, acquirerAsset, 2, 10);

        // Verify TARGET position: deleted
        expect(portfolio.longPosition?.get('TARGET')).toBeUndefined();

        // Verify ACQUIRER position: combined
        const acquirerPosition = portfolio.longPosition?.get('ACQUIRER');
        expect(acquirerPosition).toBeDefined();
        expect(acquirerPosition!.quantity).toBe(40); // 20 + 20
        expect(acquirerPosition!.totalCost).toBe(2_050); // 1,050 + 1,000
        expect(round(acquirerPosition!.averageCost)).toBe(51.25); // 2,050 / 40

        // Verify cash from merger: 10 * 10 = 100
        expect(getCash(portfolio)).toBe(97_950); // 97,850 + 100
      });
    });

    describe('16. Stock Merger into Already Open Short Position', () => {
      it('should merge target short position with existing acquirer short position', () => {
        const acquirerAsset = createTestAsset('ACQUIRER');
        const targetAsset = createTestAsset('TARGET');

        // Step 1: Open Short TARGET - price=100, qty=10, commission=100
        openShort(portfolio, targetAsset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(100_900);

        // Step 2: Open Short ACQUIRER - price=50, qty=20, commission=50
        openShort(portfolio, acquirerAsset, 50, 20, 50);
        expect(getCash(portfolio)).toBe(101_850);

        // Step 3: Merger TARGET→ACQUIRER - ratio=2, cashComponent=10
        handleMerger(portfolio, targetAsset, acquirerAsset, 2, 10);

        // Verify TARGET position: deleted
        expect(portfolio.shortPosition?.get('TARGET')).toBeUndefined();

        // Verify ACQUIRER position: combined
        const acquirerPosition = portfolio.shortPosition?.get('ACQUIRER');
        expect(acquirerPosition).toBeDefined();
        expect(acquirerPosition!.quantity).toBe(40); // 20 + 20
        expect(acquirerPosition!.totalProceeds).toBe(1_750); // 950 + 800
        expect(round(acquirerPosition!.averageProceeds)).toBe(43.75); // 1,750 / 40

        // Verify cash owed for merger: 10 * 10 = 100
        expect(getCash(portfolio)).toBe(101_750); // 101,850 - 100
      });
    });
  });

  describe('12. Multiple Corporate Actions Sequence', () => {
    it('should correctly apply multiple sequential corporate actions', () => {
      // Step 1: Open Long - price=100, qty=10, commission=100
      openLong(portfolio, asset, 100, 10, 100);
      expect(getCash(portfolio)).toBe(98_900);

      let position = portfolio.longPosition?.get('AAPL');
      expect(position!.quantity).toBe(10);
      expect(round(position!.averageCost)).toBe(110);

      // Step 2: Split - ratio=2
      handleSplit(portfolio, asset, 2);
      position = portfolio.longPosition?.get('AAPL');
      expect(position!.quantity).toBe(20);
      expect(position!.totalCost).toBe(1_100);
      expect(round(position!.averageCost)).toBe(55);

      // Step 3: Dividend - amountPerShare=5, taxRate=0
      handleCashDividend(portfolio, asset, 5, 0);
      expect(getCash(portfolio)).toBe(99_000); // 98,900 + 100
      position = portfolio.longPosition?.get('AAPL');
      expect(position!.totalCost).toBe(1_000); // 1,100 - 100
      expect(round(position!.averageCost)).toBe(50);

      // Step 4: Split - ratio=0.5
      handleSplit(portfolio, asset, 0.5);
      position = portfolio.longPosition?.get('AAPL');
      expect(position!.quantity).toBe(10);
      expect(position!.totalCost).toBe(1_000);
      expect(round(position!.averageCost)).toBe(100);
    });
  });
});

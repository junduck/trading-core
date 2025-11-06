import { describe, it, expect, beforeEach } from 'vitest';
import { openShort, closeShort } from '../../src/utils/portfolio.utils.js';
import type { Portfolio } from '../../src/types/portfolio.js';
import type { Asset } from '../../src/types/asset.js';
import { createTestPortfolio, createTestAsset, round, getCash } from './test-helpers.js';

describe('Portfolio Utils - Short Position Operations', () => {
  let portfolio: Portfolio;
  let asset: Asset;

  beforeEach(() => {
    portfolio = createTestPortfolio(100_000);
    asset = createTestAsset('AAPL');
  });

  describe('1. Open Short - Single Lot', () => {
    it('should open a short position with correct cash, quantity, proceeds, and average proceeds', () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(portfolio, asset, 100, 10, 100);

      // Verify cash: 100,000 + (100 * 10 - 100) = 100,900
      expect(getCash(portfolio)).toBe(100_900);

      // Verify position
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeDefined();
      expect(position!.quantity).toBe(10);
      expect(position!.totalProceeds).toBe(900);
      expect(round(position!.averageProceeds)).toBe(90);

      // Verify lots
      expect(position!.lots).toHaveLength(1);
      expect(position!.lots[0].quantity).toBe(10);
      expect(position!.lots[0].price).toBe(100);
      expect(position!.lots[0].totalProceeds).toBe(900);
    });
  });

  describe('2. Open Short - Multiple Lots', () => {
    it('should correctly accumulate multiple lots with weighted average proceeds', () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(portfolio, asset, 100, 10, 100);
      expect(getCash(portfolio)).toBe(100_900);

      // Step 2: Open Short - price=120, qty=5, commission=120
      openShort(portfolio, asset, 120, 5, 120);

      // Verify cash: 100,900 + (120 * 5 - 120) = 101,380
      expect(getCash(portfolio)).toBe(101_380);

      // Verify position
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeDefined();
      expect(position!.quantity).toBe(15);
      expect(position!.totalProceeds).toBe(1_380); // 900 + 480
      expect(round(position!.averageProceeds)).toBe(92); // 1,380 / 15

      // Verify lots
      expect(position!.lots).toHaveLength(2);
      expect(position!.lots[0].totalProceeds).toBe(900);
      expect(position!.lots[1].totalProceeds).toBe(480);
    });
  });

  describe('3. Close Short - FIFO Strategy - Partial Close (Profit)', () => {
    it('should close from the first lot using FIFO strategy with profit', () => {
      // Setup: Open two lots
      openShort(portfolio, asset, 100, 10, 100); // Lot 1: price=100, totalProceeds=900
      openShort(portfolio, asset, 120, 10, 120); // Lot 2: price=120, totalProceeds=1,080
      expect(getCash(portfolio)).toBe(101_980); // 100,000 + 900 + 1,080

      // Step 3: Close Short (FIFO) - price=80, qty=5, commission=80
      const pnl = closeShort(portfolio, asset, 80, 5, 80, 'FIFO');

      // Verify PnL:
      // - Proceeds basis for 5 shares from first lot: 900 / 10 * 5 = 450
      // - Cost to buy back: 80 * 5 + 80 = 480
      // - Realized PnL: 450 - 480 = -30
      expect(round(pnl)).toBe(-30);

      // Verify cash: 101,980 - 480 = 101,500
      expect(getCash(portfolio)).toBe(101_500);

      // Verify position
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeDefined();
      expect(position!.quantity).toBe(15);

      // Verify lots
      expect(position!.lots).toHaveLength(2);
      expect(position!.lots[0].quantity).toBe(5); // Remaining from first lot
      expect(position!.lots[0].totalProceeds).toBe(450);
      expect(position!.lots[1].quantity).toBe(10); // Second lot unchanged
      expect(position!.lots[1].totalProceeds).toBe(1_080);
    });
  });

  describe('4. Close Short - LIFO Strategy - Partial Close (Loss)', () => {
    it('should close from the last lot using LIFO strategy with profit', () => {
      // Setup: Open two lots
      openShort(portfolio, asset, 100, 10, 100); // Lot 1: price=100, totalProceeds=900
      openShort(portfolio, asset, 120, 10, 120); // Lot 2: price=120, totalProceeds=1,080
      expect(getCash(portfolio)).toBe(101_980); // 100,000 + 900 + 1,080

      // Step 3: Close Short (LIFO) - price=80, qty=5, commission=80
      const pnl = closeShort(portfolio, asset, 80, 5, 80, 'LIFO');

      // Verify PnL:
      // - Proceeds basis for 5 shares from second lot: 1,080 / 10 * 5 = 540
      // - Cost to buy back: 80 * 5 + 80 = 480
      // - Realized PnL: 540 - 480 = 60
      expect(round(pnl)).toBe(60);

      // Verify cash: 101,980 - 480 = 101,500
      expect(getCash(portfolio)).toBe(101_500);

      // Verify position
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeDefined();
      expect(position!.quantity).toBe(15);

      // Verify lots
      expect(position!.lots).toHaveLength(2);
      expect(position!.lots[0].quantity).toBe(10); // First lot unchanged
      expect(position!.lots[0].totalProceeds).toBe(900);
      expect(position!.lots[1].quantity).toBe(5); // Remaining from second lot
      expect(position!.lots[1].totalProceeds).toBe(540);
    });
  });

  describe('5. Close Short - Complete Position Close (Profit)', () => {
    it('should close entire position and remove it from portfolio with profit', () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(portfolio, asset, 100, 10, 100);
      expect(getCash(portfolio)).toBe(100_900);

      // Step 2: Close Short - price=80, qty=10, commission=80
      const pnl = closeShort(portfolio, asset, 80, 10, 80);

      // Verify PnL:
      // - Proceeds basis: 900 (entire lot)
      // - Cost to buy back: 80 * 10 + 80 = 880
      // - Realized PnL: 900 - 880 = 20
      expect(round(pnl)).toBe(20);

      // Verify cash: 100,900 - 880 = 100,020
      expect(getCash(portfolio)).toBe(100_020);

      // Verify position is deleted (no lots remain)
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeUndefined();
    });
  });

  describe('6. Close Short - Multiple Lots FIFO', () => {
    it('should close across multiple lots using FIFO strategy', () => {
      // Setup: Open two lots
      openShort(portfolio, asset, 100, 10, 100); // Lot 1: price=100, totalProceeds=900
      openShort(portfolio, asset, 120, 10, 120); // Lot 2: price=120, totalProceeds=1,080
      expect(getCash(portfolio)).toBe(101_980); // 100,000 + 900 + 1,080

      // Step 3: Close Short (FIFO) - price=80, qty=15, commission=80
      const pnl = closeShort(portfolio, asset, 80, 15, 80, 'FIFO');

      // Verify PnL:
      // - Closes entire first lot (10 shares): proceeds basis = 900
      // - Closes 5 from second lot: proceeds basis = 1,080 / 10 * 5 = 540
      // - Total proceeds basis: 900 + 540 = 1,440
      // - Cost: 80 * 15 + 80 = 1,280
      // - Realized PnL: 1,440 - 1,280 = 160
      expect(round(pnl)).toBe(160);

      // Verify cash: 101,980 - 1,280 = 100,700
      expect(getCash(portfolio)).toBe(100_700);

      // Verify position
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeDefined();
      expect(position!.quantity).toBe(5);

      // Verify lots - only second lot remains
      expect(position!.lots).toHaveLength(1);
      expect(position!.lots[0].quantity).toBe(5);
      expect(position!.lots[0].totalProceeds).toBe(540);
    });
  });

  describe('7. Close Short - Loss Scenario', () => {
    it('should correctly calculate negative PnL when closing at a loss', () => {
      // Step 1: Open Short - price=100, qty=10, commission=100
      openShort(portfolio, asset, 100, 10, 100);
      expect(getCash(portfolio)).toBe(100_900);

      // Step 2: Close Short at higher price - price=130, qty=10, commission=130
      const pnl = closeShort(portfolio, asset, 130, 10, 130);

      // Verify PnL:
      // - Proceeds basis: 900
      // - Cost to buy back: 130 * 10 + 130 = 1,430
      // - Realized PnL: 900 - 1,430 = -530
      expect(round(pnl)).toBe(-530);

      // Verify cash: 100,900 - 1,430 = 99,470
      expect(getCash(portfolio)).toBe(99_470);

      // Verify position is deleted
      const position = portfolio.shortPosition?.get('AAPL');
      expect(position).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should throw error when trying to close non-existent position', () => {
      expect(() => {
        closeShort(portfolio, asset, 100, 10, 100);
      }).toThrow();
    });

    it('should use LIFO as default close strategy', () => {
      openShort(portfolio, asset, 100, 10, 100);
      openShort(portfolio, asset, 120, 10, 120);

      // Close without specifying strategy (should default to LIFO)
      const pnl = closeShort(portfolio, asset, 80, 5, 80);

      // Should close from second lot (LIFO)
      expect(round(pnl)).toBe(60); // Same as LIFO test
    });
  });
});

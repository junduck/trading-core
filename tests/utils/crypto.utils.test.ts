import { describe, it, expect, beforeEach } from 'vitest';
import {
  openLong,
  openShort,
} from '../../src/utils/portfolio.utils.js';
import {
  handleHardFork,
  handleAirdrop,
  handleTokenSwap,
  handleStakingReward,
} from '../../src/utils/crypto.utils.js';
import type { Portfolio } from '../../src/types/portfolio.js';
import type { Asset } from '../../src/types/asset.js';
import { createTestPortfolio, createTestAsset, round, getCash } from './test-helpers.js';

describe('Crypto Utils', () => {
  let portfolio: Portfolio;
  let btcAsset: Asset;
  let ethAsset: Asset;

  beforeEach(() => {
    portfolio = createTestPortfolio(100_000);
    btcAsset = createTestAsset('BTC', { type: 'crypto' });
    ethAsset = createTestAsset('ETH', { type: 'crypto' });
  });

  describe('Hard Forks', () => {
    describe('1. Hard Fork - 1-for-1 Ratio (Long Position)', () => {
      it('should create new position with zero cost basis at 1:1 ratio', () => {
        const bchAsset = createTestAsset('BCH', { type: 'crypto' });

        // Step 1: Open Long BTC - price=100, qty=10, commission=100
        openLong(portfolio, btcAsset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Hard Fork - ratio=1, newAsset=BCH
        handleHardFork(portfolio, btcAsset, bchAsset, 1);

        // Verify original BTC position: unchanged
        const btcPosition = portfolio.longPosition?.get('BTC');
        expect(btcPosition).toBeDefined();
        expect(btcPosition!.quantity).toBe(10);
        expect(btcPosition!.totalCost).toBe(1_100);

        // Verify new BCH position
        const bchPosition = portfolio.longPosition?.get('BCH');
        expect(bchPosition).toBeDefined();
        expect(bchPosition!.quantity).toBe(10); // 10 * 1
        expect(bchPosition!.totalCost).toBe(0); // forked coins have no cost basis
        expect(bchPosition!.averageCost).toBe(0);

        // Verify cash unchanged
        expect(getCash(portfolio)).toBe(98_900);
      });
    });

    describe('2. Hard Fork - 2-for-1 Ratio (Long Position)', () => {
      it('should create new position with double quantity at 2:1 ratio', () => {
        const bchAsset = createTestAsset('BCH', { type: 'crypto' });

        // Step 1: Open Long BTC - price=100, qty=10, commission=100
        openLong(portfolio, btcAsset, 100, 10, 100);

        // Step 2: Hard Fork - ratio=2, newAsset=BCH
        handleHardFork(portfolio, btcAsset, bchAsset, 2);

        // Verify original BTC position: unchanged
        const btcPosition = portfolio.longPosition?.get('BTC');
        expect(btcPosition!.quantity).toBe(10);

        // Verify new BCH position
        const bchPosition = portfolio.longPosition?.get('BCH');
        expect(bchPosition).toBeDefined();
        expect(bchPosition!.quantity).toBe(20); // 10 * 2
        expect(bchPosition!.totalCost).toBe(0);
        expect(bchPosition!.averageCost).toBe(0);
      });
    });

    describe('3. Hard Fork - Short Position', () => {
      it('should create new short position with zero proceeds', () => {
        const bchAsset = createTestAsset('BCH', { type: 'crypto' });

        // Step 1: Open Short BTC - price=100, qty=10, commission=100
        openShort(portfolio, btcAsset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(100_900);

        // Step 2: Hard Fork - ratio=2, newAsset=BCH
        handleHardFork(portfolio, btcAsset, bchAsset, 2);

        // Verify original BTC short: unchanged
        const btcPosition = portfolio.shortPosition?.get('BTC');
        expect(btcPosition).toBeDefined();
        expect(btcPosition!.quantity).toBe(10);

        // Verify new BCH short
        const bchPosition = portfolio.shortPosition?.get('BCH');
        expect(bchPosition).toBeDefined();
        expect(bchPosition!.quantity).toBe(20); // 10 * 2
        expect(bchPosition!.totalProceeds).toBe(0);
        expect(bchPosition!.averageProceeds).toBe(0);
      });
    });
  });

  describe('Airdrops', () => {
    describe('4. Airdrop - Proportional to Holdings (Long Position)', () => {
      it('should create airdrop position proportional to holdings', () => {
        const airdropAsset = createTestAsset('AIRDROP', { type: 'crypto' });

        // Step 1: Open Long ETH - price=100, qty=10, commission=100
        openLong(portfolio, ethAsset, 100, 10, 100);
        expect(getCash(portfolio)).toBe(98_900);

        // Step 2: Airdrop - amountPerToken=2
        handleAirdrop(portfolio, ethAsset, airdropAsset, 2);

        // Verify original ETH position: unchanged
        const ethPosition = portfolio.longPosition?.get('ETH');
        expect(ethPosition!.quantity).toBe(10);

        // Verify airdrop position
        const airdropPosition = portfolio.longPosition?.get('AIRDROP');
        expect(airdropPosition).toBeDefined();
        expect(airdropPosition!.quantity).toBe(20); // 10 * 2
        expect(airdropPosition!.totalCost).toBe(0);
        expect(airdropPosition!.averageCost).toBe(0);
      });
    });

    describe('5. Airdrop - Fixed Amount (No Holder Asset)', () => {
      it('should create airdrop position with fixed amount', () => {
        const airdropAsset = createTestAsset('AIRDROP', { type: 'crypto' });

        // Step 1: Airdrop - fixedAmount=100
        handleAirdrop(portfolio, null, airdropAsset, 0, 100);

        // Verify airdrop position
        const airdropPosition = portfolio.longPosition?.get('AIRDROP');
        expect(airdropPosition).toBeDefined();
        expect(airdropPosition!.quantity).toBe(100);
        expect(airdropPosition!.totalCost).toBe(0);
        expect(airdropPosition!.averageCost).toBe(0);
      });
    });

    describe('6. Airdrop - No Holdings (Should Do Nothing)', () => {
      it('should not create position when holder asset is not held', () => {
        const airdropAsset = createTestAsset('AIRDROP', { type: 'crypto' });

        // Step 1: Airdrop on ETH we don't hold
        handleAirdrop(portfolio, ethAsset, airdropAsset, 2);

        // Verify no airdrop position created
        const airdropPosition = portfolio.longPosition?.get('AIRDROP');
        expect(airdropPosition).toBeUndefined();
      });
    });

    describe('7. Airdrop - Into Existing Position', () => {
      it('should merge airdrop with existing position', () => {
        const airdropAsset = createTestAsset('AIRDROP', { type: 'crypto' });

        // Step 1: Open Long ETH - price=100, qty=10, commission=100
        openLong(portfolio, ethAsset, 100, 10, 100);

        // Step 2: Open Long AIRDROP - price=50, qty=20, commission=50
        openLong(portfolio, airdropAsset, 50, 20, 50);
        expect(getCash(portfolio)).toBe(97_850); // 100,000 - 1,100 - 1,050

        // Step 3: Airdrop - amountPerToken=2
        handleAirdrop(portfolio, ethAsset, airdropAsset, 2);

        // Verify ETH position: unchanged
        const ethPosition = portfolio.longPosition?.get('ETH');
        expect(ethPosition!.quantity).toBe(10);

        // Verify AIRDROP position: combined
        const airdropPosition = portfolio.longPosition?.get('AIRDROP');
        expect(airdropPosition).toBeDefined();
        expect(airdropPosition!.quantity).toBe(40); // 20 + 20
        expect(airdropPosition!.totalCost).toBe(1_050); // original totalCost unchanged
        expect(round(airdropPosition!.averageCost)).toBe(26.25); // 1,050 / 40
      });
    });
  });

  describe('Token Swaps', () => {
    describe('8. Token Swap - 1-for-1 (Long Position)', () => {
      it('should swap tokens at 1:1 ratio preserving cost basis', () => {
        const oldAsset = createTestAsset('OLD', { type: 'crypto' });
        const newAsset = createTestAsset('NEW', { type: 'crypto' });

        // Step 1: Open Long OLD - price=100, qty=10, commission=100
        openLong(portfolio, oldAsset, 100, 10, 100);

        // Step 2: Token Swap - ratio=1
        handleTokenSwap(portfolio, oldAsset, newAsset, 1);

        // Verify OLD position: deleted
        expect(portfolio.longPosition?.get('OLD')).toBeUndefined();

        // Verify NEW position
        const newPosition = portfolio.longPosition?.get('NEW');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(10); // 10 * 1
        expect(newPosition!.totalCost).toBe(1_100); // transferred
        expect(round(newPosition!.averageCost)).toBe(110); // 1,100 / 10
      });
    });

    describe('9. Token Swap - 2-for-1 (Long Position)', () => {
      it('should swap tokens at 2:1 ratio preserving cost basis', () => {
        const oldAsset = createTestAsset('OLD', { type: 'crypto' });
        const newAsset = createTestAsset('NEW', { type: 'crypto' });

        // Step 1: Open Long OLD - price=100, qty=10, commission=100
        openLong(portfolio, oldAsset, 100, 10, 100);

        // Step 2: Token Swap - ratio=2
        handleTokenSwap(portfolio, oldAsset, newAsset, 2);

        // Verify OLD position: deleted
        expect(portfolio.longPosition?.get('OLD')).toBeUndefined();

        // Verify NEW position
        const newPosition = portfolio.longPosition?.get('NEW');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalCost).toBe(1_100); // transferred
        expect(round(newPosition!.averageCost)).toBe(55); // 1,100 / 20
      });
    });

    describe('10. Token Swap - Short Position', () => {
      it('should swap short position preserving proceeds', () => {
        const oldAsset = createTestAsset('OLD', { type: 'crypto' });
        const newAsset = createTestAsset('NEW', { type: 'crypto' });

        // Step 1: Open Short OLD - price=100, qty=10, commission=100
        openShort(portfolio, oldAsset, 100, 10, 100);

        // Step 2: Token Swap - ratio=2
        handleTokenSwap(portfolio, oldAsset, newAsset, 2);

        // Verify OLD position: deleted
        expect(portfolio.shortPosition?.get('OLD')).toBeUndefined();

        // Verify NEW position
        const newPosition = portfolio.shortPosition?.get('NEW');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalProceeds).toBe(900); // transferred
        expect(round(newPosition!.averageProceeds)).toBe(45); // 900 / 20
      });
    });

    describe('11. Token Swap - Into Existing Position (Long)', () => {
      it('should merge swapped tokens with existing long position', () => {
        const oldAsset = createTestAsset('OLD', { type: 'crypto' });
        const newAsset = createTestAsset('NEW', { type: 'crypto' });

        // Step 1: Open Long OLD - price=100, qty=10, commission=100
        openLong(portfolio, oldAsset, 100, 10, 100);

        // Step 2: Open Long NEW - price=50, qty=20, commission=50
        openLong(portfolio, newAsset, 50, 20, 50);

        // Step 3: Token Swap - ratio=2
        handleTokenSwap(portfolio, oldAsset, newAsset, 2);

        // Verify OLD position: deleted
        expect(portfolio.longPosition?.get('OLD')).toBeUndefined();

        // Verify NEW position: combined
        const newPosition = portfolio.longPosition?.get('NEW');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(40); // 20 + 20
        expect(newPosition!.totalCost).toBe(2_150); // 1,050 + 1,100
        expect(round(newPosition!.averageCost)).toBe(53.75); // 2,150 / 40
      });
    });

    describe('12. Token Swap - Into Existing Position (Short)', () => {
      it('should merge swapped tokens with existing short position', () => {
        const oldAsset = createTestAsset('OLD', { type: 'crypto' });
        const newAsset = createTestAsset('NEW', { type: 'crypto' });

        // Step 1: Open Short OLD - price=100, qty=10, commission=100
        openShort(portfolio, oldAsset, 100, 10, 100);

        // Step 2: Open Short NEW - price=50, qty=20, commission=50
        openShort(portfolio, newAsset, 50, 20, 50);

        // Step 3: Token Swap - ratio=2
        handleTokenSwap(portfolio, oldAsset, newAsset, 2);

        // Verify OLD position: deleted
        expect(portfolio.shortPosition?.get('OLD')).toBeUndefined();

        // Verify NEW position: combined
        const newPosition = portfolio.shortPosition?.get('NEW');
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(40); // 20 + 20
        expect(newPosition!.totalProceeds).toBe(1_850); // 950 + 900
        expect(round(newPosition!.averageProceeds)).toBe(46.25); // 1,850 / 40
      });
    });
  });

  describe('Staking Rewards', () => {
    describe('13. Staking Reward - Long Position', () => {
      it('should add staking rewards with zero cost basis', () => {
        // Step 1: Open Long ETH - price=100, qty=10, commission=100
        openLong(portfolio, ethAsset, 100, 10, 100);

        // Step 2: Staking Reward - rewardPerToken=0.5
        const rewardsReceived = handleStakingReward(portfolio, ethAsset, 0.5);

        // Verify rewards received: 10 * 0.5 = 5
        expect(rewardsReceived).toBe(5);

        // Verify position
        const position = portfolio.longPosition?.get('ETH');
        expect(position).toBeDefined();
        expect(position!.quantity).toBe(15); // 10 + 5
        expect(position!.totalCost).toBe(1_100); // unchanged (rewards have no cost)
        expect(round(position!.averageCost)).toBe(73.33); // 1,100 / 15
      });
    });

    describe('14. Staking Reward - No Position (Should Return 0)', () => {
      it('should return 0 rewards when asset is not held', () => {
        // Step 1: Staking Reward on ETH we don't hold
        const rewardsReceived = handleStakingReward(portfolio, ethAsset, 0.5);

        // Verify no rewards received
        expect(rewardsReceived).toBe(0);

        // Verify no position created
        expect(portfolio.longPosition?.get('ETH')).toBeUndefined();
      });
    });
  });

  describe('15. Multiple Crypto Actions Sequence', () => {
    it('should correctly apply multiple sequential crypto actions', () => {
      const bchAsset = createTestAsset('BCH', { type: 'crypto' });

      // Step 1: Open Long BTC - price=100, qty=10, commission=100
      openLong(portfolio, btcAsset, 100, 10, 100);
      expect(getCash(portfolio)).toBe(98_900);

      let btcPosition = portfolio.longPosition?.get('BTC');
      expect(btcPosition!.quantity).toBe(10);
      expect(round(btcPosition!.averageCost)).toBe(110);

      // Step 2: Hard Fork BTC→BCH - ratio=1
      handleHardFork(portfolio, btcAsset, bchAsset, 1);

      btcPosition = portfolio.longPosition?.get('BTC');
      expect(btcPosition!.quantity).toBe(10);

      let bchPosition = portfolio.longPosition?.get('BCH');
      expect(bchPosition!.quantity).toBe(10);
      expect(bchPosition!.totalCost).toBe(0);

      expect(getCash(portfolio)).toBe(98_900);

      // Step 3: Staking Reward BTC - rewardPerToken=0.5
      const rewards = handleStakingReward(portfolio, btcAsset, 0.5);
      expect(rewards).toBe(5); // 10 * 0.5

      btcPosition = portfolio.longPosition?.get('BTC');
      expect(btcPosition!.quantity).toBe(15); // 10 + 5
      expect(btcPosition!.totalCost).toBe(1_100); // unchanged
      expect(round(btcPosition!.averageCost)).toBe(73.33); // 1,100 / 15

      expect(getCash(portfolio)).toBe(98_900);

      // Step 4: Token Swap BCH→ETH - ratio=2
      handleTokenSwap(portfolio, bchAsset, ethAsset, 2);

      // BCH deleted
      expect(portfolio.longPosition?.get('BCH')).toBeUndefined();

      // ETH created
      const ethPosition = portfolio.longPosition?.get('ETH');
      expect(ethPosition).toBeDefined();
      expect(ethPosition!.quantity).toBe(20); // 10 * 2
      expect(ethPosition!.totalCost).toBe(0); // BCH had 0 cost
      expect(ethPosition!.averageCost).toBe(0);

      expect(getCash(portfolio)).toBe(98_900);
    });
  });

  describe('Error Cases', () => {
    it('should throw error for invalid hard fork ratio', () => {
      const bchAsset = createTestAsset('BCH', { type: 'crypto' });
      openLong(portfolio, btcAsset, 100, 10, 100);

      expect(() => {
        handleHardFork(portfolio, btcAsset, bchAsset, 0);
      }).toThrow('Invalid hard fork ratio');

      expect(() => {
        handleHardFork(portfolio, btcAsset, bchAsset, -1);
      }).toThrow('Invalid hard fork ratio');
    });

    it('should throw error for invalid airdrop parameters', () => {
      const airdropAsset = createTestAsset('AIRDROP', { type: 'crypto' });

      expect(() => {
        handleAirdrop(portfolio, null, airdropAsset, 0, 0);
      }).toThrow('Either holderAsset with amountPerToken or fixedAmount must be specified');

      expect(() => {
        handleAirdrop(portfolio, ethAsset, airdropAsset, -1);
      }).toThrow('Invalid airdrop amount');
    });

    it('should throw error for invalid swap ratio', () => {
      const oldAsset = createTestAsset('OLD', { type: 'crypto' });
      const newAsset = createTestAsset('NEW', { type: 'crypto' });
      openLong(portfolio, oldAsset, 100, 10, 100);

      expect(() => {
        handleTokenSwap(portfolio, oldAsset, newAsset, 0);
      }).toThrow('Invalid swap ratio');

      expect(() => {
        handleTokenSwap(portfolio, oldAsset, newAsset, -1);
      }).toThrow('Invalid swap ratio');
    });

    it('should throw error for invalid staking reward amount', () => {
      openLong(portfolio, ethAsset, 100, 10, 100);

      expect(() => {
        handleStakingReward(portfolio, ethAsset, -1);
      }).toThrow('Invalid reward amount');
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import type { Position } from "../../src/types/position.js";
import {
  createTestPosition,
  round,
  openLong,
  openShort,
  handleHardFork,
  handleAirdrop,
  handleTokenSwap,
  handleStakingReward,
} from "./position-test-helper.js";

describe("Crypto Utils", () => {
  let position: Position;
  let btcSymbol: string;
  let ethSymbol: string;

  beforeEach(() => {
    position = createTestPosition(100_000);
    btcSymbol = "BTC";
    ethSymbol = "ETH";
  });

  describe("Hard Forks", () => {
    describe("1. Hard Fork - 1-for-1 Ratio (Long Position)", () => {
      it("should create new position with zero cost basis at 1:1 ratio", () => {
        const bchSymbol = "BCH";

        // Step 1: Open Long BTC - price=100, qty=10, commission=100
        openLong(position, btcSymbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Hard Fork - ratio=1, newAsset=BCH
        handleHardFork(position, btcSymbol, bchSymbol, 1);

        // Verify original BTC position: unchanged
        const btcPosition = position.long?.get("BTC");
        expect(btcPosition).toBeDefined();
        expect(btcPosition!.quantity).toBe(10);
        expect(btcPosition!.totalCost).toBe(1_100);

        // Verify new BCH position
        const bchPosition = position.long?.get("BCH");
        expect(bchPosition).toBeDefined();
        expect(bchPosition!.quantity).toBe(10); // 10 * 1
        expect(bchPosition!.totalCost).toBe(0); // forked coins have no cost basis

        // Verify cash unchanged
        expect(position.cash).toBe(98_900);
      });
    });

    describe("2. Hard Fork - 2-for-1 Ratio (Long Position)", () => {
      it("should create new position with double quantity at 2:1 ratio", () => {
        const bchSymbol = "BCH";

        // Step 1: Open Long BTC - price=100, qty=10, commission=100
        openLong(position, btcSymbol, 100, 10, 100);

        // Step 2: Hard Fork - ratio=2, newAsset=BCH
        handleHardFork(position, btcSymbol, bchSymbol, 2);

        // Verify original BTC position: unchanged
        const btcPosition = position.long?.get("BTC");
        expect(btcPosition!.quantity).toBe(10);

        // Verify new BCH position
        const bchPosition = position.long?.get("BCH");
        expect(bchPosition).toBeDefined();
        expect(bchPosition!.quantity).toBe(20); // 10 * 2
        expect(bchPosition!.totalCost).toBe(0);
      });
    });

    describe("3. Hard Fork - Short Position", () => {
      it("should create new short position with zero proceeds", () => {
        const bchSymbol = "BCH";

        // Step 1: Open Short BTC - price=100, qty=10, commission=100
        openShort(position, btcSymbol, 100, 10, 100);
        expect(position.cash).toBe(100_900);

        // Step 2: Hard Fork - ratio=2, newAsset=BCH
        handleHardFork(position, btcSymbol, bchSymbol, 2);

        // Verify original BTC short: unchanged
        const btcPosition = position.short?.get("BTC");
        expect(btcPosition).toBeDefined();
        expect(btcPosition!.quantity).toBe(10);

        // Verify new BCH short
        const bchPosition = position.short?.get("BCH");
        expect(bchPosition).toBeDefined();
        expect(bchPosition!.quantity).toBe(20); // 10 * 2
        expect(bchPosition!.totalProceeds).toBe(0);
      });
    });
  });

  describe("Airdrops", () => {
    describe("4. Airdrop - Proportional to Holdings (Long Position)", () => {
      it("should create airdrop position proportional to holdings", () => {
        const airdropSymbol = "AIRDROP";

        // Step 1: Open Long ETH - price=100, qty=10, commission=100
        openLong(position, ethSymbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Airdrop - amountPerToken=2
        handleAirdrop(position, ethSymbol, airdropSymbol, 2);

        // Verify original ETH position: unchanged
        const ethPosition = position.long?.get("ETH");
        expect(ethPosition!.quantity).toBe(10);

        // Verify airdrop position
        const airdropPosition = position.long?.get("AIRDROP");
        expect(airdropPosition).toBeDefined();
        expect(airdropPosition!.quantity).toBe(20); // 10 * 2
        expect(airdropPosition!.totalCost).toBe(0);
      });
    });

    describe("5. Airdrop - Fixed Amount (No Holder Asset)", () => {
      it("should create airdrop position with fixed amount", () => {
        const airdropSymbol = "AIRDROP";

        // Step 1: Airdrop - fixedAmount=100
        handleAirdrop(position, null, airdropSymbol, 0, 100);

        // Verify airdrop position
        const airdropPosition = position.long?.get("AIRDROP");
        expect(airdropPosition).toBeDefined();
        expect(airdropPosition!.quantity).toBe(100);
        expect(airdropPosition!.totalCost).toBe(0);
      });
    });

    describe("6. Airdrop - No Holdings (Should Do Nothing)", () => {
      it("should not create position when holder asset is not held", () => {
        const airdropSymbol = "AIRDROP";

        // Step 1: Airdrop on ETH we don't hold
        handleAirdrop(position, ethSymbol, airdropSymbol, 2);

        // Verify no airdrop position created
        const airdropPosition = position.long?.get("AIRDROP");
        expect(airdropPosition).toBeUndefined();
      });
    });

    describe("7. Airdrop - Into Existing Position", () => {
      it("should merge airdrop with existing position", () => {
        const airdropSymbol = "AIRDROP";

        // Step 1: Open Long ETH - price=100, qty=10, commission=100
        openLong(position, ethSymbol, 100, 10, 100);

        // Step 2: Open Long AIRDROP - price=50, qty=20, commission=50
        openLong(position, airdropSymbol, 50, 20, 50);
        expect(position.cash).toBe(97_850); // 100,000 - 1,100 - 1,050

        // Step 3: Airdrop - amountPerToken=2
        handleAirdrop(position, ethSymbol, airdropSymbol, 2);

        // Verify ETH position: unchanged
        const ethPosition = position.long?.get("ETH");
        expect(ethPosition!.quantity).toBe(10);

        // Verify AIRDROP position: combined
        const airdropPosition = position.long?.get("AIRDROP");
        expect(airdropPosition).toBeDefined();
        expect(airdropPosition!.quantity).toBe(40); // 20 + 20
        expect(airdropPosition!.totalCost).toBe(1_050); // original totalCost unchanged
      });
    });
  });

  describe("Token Swaps", () => {
    describe("8. Token Swap - 1-for-1 (Long Position)", () => {
      it("should swap tokens at 1:1 ratio preserving cost basis", () => {
        const oldSymbol = "OLD";
        const newSymbol = "NEW";

        // Step 1: Open Long OLD - price=100, qty=10, commission=100
        openLong(position, oldSymbol, 100, 10, 100);

        // Step 2: Token Swap - ratio=1
        handleTokenSwap(position, oldSymbol, newSymbol, 1);

        // Verify OLD position: deleted
        expect(position.long?.get("OLD")).toBeUndefined();

        // Verify NEW position
        const newPosition = position.long?.get("NEW");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(10); // 10 * 1
        expect(newPosition!.totalCost).toBe(1_100); // transferred
      });
    });

    describe("9. Token Swap - 2-for-1 (Long Position)", () => {
      it("should swap tokens at 2:1 ratio preserving cost basis", () => {
        const oldSymbol = "OLD";
        const newSymbol = "NEW";

        // Step 1: Open Long OLD - price=100, qty=10, commission=100
        openLong(position, oldSymbol, 100, 10, 100);

        // Step 2: Token Swap - ratio=2
        handleTokenSwap(position, oldSymbol, newSymbol, 2);

        // Verify OLD position: deleted
        expect(position.long?.get("OLD")).toBeUndefined();

        // Verify NEW position
        const newPosition = position.long?.get("NEW");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalCost).toBe(1_100); // transferred
      });
    });

    describe("10. Token Swap - Short Position", () => {
      it("should swap short position preserving proceeds", () => {
        const oldSymbol = "OLD";
        const newSymbol = "NEW";

        // Step 1: Open Short OLD - price=100, qty=10, commission=100
        openShort(position, oldSymbol, 100, 10, 100);

        // Step 2: Token Swap - ratio=2
        handleTokenSwap(position, oldSymbol, newSymbol, 2);

        // Verify OLD position: deleted
        expect(position.short?.get("OLD")).toBeUndefined();

        // Verify NEW position
        const newPosition = position.short?.get("NEW");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalProceeds).toBe(900); // transferred
      });
    });

    describe("11. Token Swap - Into Existing Position (Long)", () => {
      it("should merge swapped tokens with existing long position", () => {
        const oldSymbol = "OLD";
        const newSymbol = "NEW";

        // Step 1: Open Long OLD - price=100, qty=10, commission=100
        openLong(position, oldSymbol, 100, 10, 100);

        // Step 2: Open Long NEW - price=50, qty=20, commission=50
        openLong(position, newSymbol, 50, 20, 50);

        // Step 3: Token Swap - ratio=2
        handleTokenSwap(position, oldSymbol, newSymbol, 2);

        // Verify OLD position: deleted
        expect(position.long?.get("OLD")).toBeUndefined();

        // Verify NEW position: combined
        const newPosition = position.long?.get("NEW");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(40); // 20 + 20
        expect(newPosition!.totalCost).toBe(2_150); // 1,050 + 1,100
      });
    });

    describe("12. Token Swap - Into Existing Position (Short)", () => {
      it("should merge swapped tokens with existing short position", () => {
        const oldSymbol = "OLD";
        const newSymbol = "NEW";

        // Step 1: Open Short OLD - price=100, qty=10, commission=100
        openShort(position, oldSymbol, 100, 10, 100);

        // Step 2: Open Short NEW - price=50, qty=20, commission=50
        openShort(position, newSymbol, 50, 20, 50);

        // Step 3: Token Swap - ratio=2
        handleTokenSwap(position, oldSymbol, newSymbol, 2);

        // Verify OLD position: deleted
        expect(position.short?.get("OLD")).toBeUndefined();

        // Verify NEW position: combined
        const newPosition = position.short?.get("NEW");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(40); // 20 + 20
        expect(newPosition!.totalProceeds).toBe(1_850); // 950 + 900
      });
    });
  });

  describe("Staking Rewards", () => {
    describe("13. Staking Reward - Long Position", () => {
      it("should add staking rewards with zero cost basis", () => {
        // Step 1: Open Long ETH - price=100, qty=10, commission=100
        openLong(position, ethSymbol, 100, 10, 100);

        // Step 2: Staking Reward - rewardPerToken=0.5
        const rewardsReceived = handleStakingReward(position, ethSymbol, 0.5);

        // Verify rewards received: 10 * 0.5 = 5
        expect(rewardsReceived).toBe(5);

        // Verify position
        const longPos = position.long?.get("ETH");
        expect(longPos).toBeDefined();
        expect(longPos!.quantity).toBe(15); // 10 + 5
        expect(longPos!.totalCost).toBe(1_100); // unchanged (rewards have no cost)
      });
    });

    describe("14. Staking Reward - No Position (Should Return 0)", () => {
      it("should return 0 rewards when asset is not held", () => {
        // Step 1: Staking Reward on ETH we don't hold
        const rewardsReceived = handleStakingReward(position, ethSymbol, 0.5);

        // Verify no rewards received
        expect(rewardsReceived).toBe(0);

        // Verify no position created
        expect(position.long?.get("ETH")).toBeUndefined();
      });
    });
  });

  describe("15. Multiple Crypto Actions Sequence", () => {
    it("should correctly apply multiple sequential crypto actions", () => {
      const bchSymbol = "BCH";

      // Step 1: Open Long BTC - price=100, qty=10, commission=100
      openLong(position, btcSymbol, 100, 10, 100);
      expect(position.cash).toBe(98_900);

      let btcPosition = position.long?.get("BTC");
      expect(btcPosition!.quantity).toBe(10);

      // Step 2: Hard Fork BTC→BCH - ratio=1
      handleHardFork(position, btcSymbol, bchSymbol, 1);

      btcPosition = position.long?.get("BTC");
      expect(btcPosition!.quantity).toBe(10);

      let bchPosition = position.long?.get("BCH");
      expect(bchPosition!.quantity).toBe(10);
      expect(bchPosition!.totalCost).toBe(0);

      expect(position.cash).toBe(98_900);

      // Step 3: Staking Reward BTC - rewardPerToken=0.5
      const rewards = handleStakingReward(position, btcSymbol, 0.5);
      expect(rewards).toBe(5); // 10 * 0.5

      btcPosition = position.long?.get("BTC");
      expect(btcPosition!.quantity).toBe(15); // 10 + 5
      expect(btcPosition!.totalCost).toBe(1_100); // unchanged

      expect(position.cash).toBe(98_900);

      // Step 4: Token Swap BCH→ETH - ratio=2
      handleTokenSwap(position, bchSymbol, ethSymbol, 2);

      // BCH deleted
      expect(position.long?.get("BCH")).toBeUndefined();

      // ETH created
      const ethPosition = position.long?.get("ETH");
      expect(ethPosition).toBeDefined();
      expect(ethPosition!.quantity).toBe(20); // 10 * 2
      expect(ethPosition!.totalCost).toBe(0); // BCH had 0 cost

      expect(position.cash).toBe(98_900);
    });
  });

  describe("Error Cases", () => {
    it("should throw error for invalid hard fork ratio", () => {
      const bchSymbol = "BCH";
      openLong(position, btcSymbol, 100, 10, 100);

      expect(() => {
        handleHardFork(position, btcSymbol, bchSymbol, 0);
      }).toThrow("Invalid hard fork ratio");

      expect(() => {
        handleHardFork(position, btcSymbol, bchSymbol, -1);
      }).toThrow("Invalid hard fork ratio");
    });

    it("should throw error for invalid airdrop parameters", () => {
      const airdropSymbol = "AIRDROP";

      expect(() => {
        handleAirdrop(position, null, airdropSymbol, 0, 0);
      }).toThrow(
        "Either holderSymbol with amountPerToken or fixedAmount must be specified"
      );

      expect(() => {
        handleAirdrop(position, ethSymbol, airdropSymbol, -1);
      }).toThrow("Invalid airdrop amount");
    });

    it("should throw error for invalid swap ratio", () => {
      const oldSymbol = "OLD";
      const newSymbol = "NEW";
      openLong(position, oldSymbol, 100, 10, 100);

      expect(() => {
        handleTokenSwap(position, oldSymbol, newSymbol, 0);
      }).toThrow("Invalid swap ratio");

      expect(() => {
        handleTokenSwap(position, oldSymbol, newSymbol, -1);
      }).toThrow("Invalid swap ratio");
    });

    it("should throw error for invalid staking reward amount", () => {
      openLong(position, ethSymbol, 100, 10, 100);

      expect(() => {
        handleStakingReward(position, ethSymbol, -1);
      }).toThrow("Invalid reward amount");
    });
  });
});

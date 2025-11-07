import { describe, it, expect, beforeEach } from "vitest";
import type { Position } from "../../src/types/position.js";
import {
  createTestPosition,
  round,
  openLong,
  openShort,
  handleSplit,
  handleCashDividend,
  handleSpinoff,
  handleMerger,
} from "./position-test-helper.js";

describe("Stock Utils - Corporate Actions", () => {
  let position: Position;
  let symbol: string;

  beforeEach(() => {
    position = createTestPosition(100_000);
    symbol = "AAPL";
  });

  describe("Stock Splits", () => {
    describe("1. Stock Split - 2-for-1 (Long Position)", () => {
      it("should double quantity while keeping total cost unchanged", () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Stock Split - ratio=2
        handleSplit(position, symbol, 2);

        // Verify position
        const longPos = position.long?.get("AAPL");
        expect(longPos).toBeDefined();
        expect(longPos!.quantity).toBe(20); // 10 * 2
        expect(longPos!.totalCost).toBe(1_100); // unchanged

        // Verify lots
        expect(longPos!.lots).toHaveLength(1);
        expect(longPos!.lots[0].quantity).toBe(20);
        expect(longPos!.lots[0].totalCost).toBe(1_100);
      });
    });

    describe("2. Stock Split - 1-for-2 Reverse Split (Long Position)", () => {
      it("should halve quantity while keeping total cost unchanged", () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);

        // Step 2: Stock Split - ratio=0.5
        handleSplit(position, symbol, 0.5);

        // Verify position
        const longPos = position.long?.get("AAPL");
        expect(longPos).toBeDefined();
        expect(longPos!.quantity).toBe(5); // 10 * 0.5
        expect(longPos!.totalCost).toBe(1_100); // unchanged
      });
    });

    describe("3. Stock Split - Short Position", () => {
      it("should adjust short position quantity while keeping total proceeds unchanged", () => {
        // Step 1: Open Short - price=100, qty=10, commission=100
        openShort(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(100_900);

        // Step 2: Stock Split - ratio=2
        handleSplit(position, symbol, 2);

        // Verify position
        const shortPos = position.short?.get("AAPL");
        expect(shortPos).toBeDefined();
        expect(shortPos!.quantity).toBe(20); // 10 * 2
        expect(shortPos!.totalProceeds).toBe(900); // unchanged
      });
    });
  });

  describe("Cash Dividends", () => {
    describe("4. Cash Dividend - No Tax (Long Position)", () => {
      it("should reduce cost basis by dividend amount with no tax", () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Cash Dividend - amountPerShare=10, taxRate=0
        const dividendCash = handleCashDividend(position, symbol, 10, 0);

        // Verify dividend amount: 10 * 10 = 100
        expect(dividendCash).toBe(100);

        // Verify cash: 98,900 + 100 = 99,000
        expect(position.cash).toBe(99_000);

        // Verify position
        const longPos = position.long?.get("AAPL");
        expect(longPos).toBeDefined();
        expect(longPos!.totalCost).toBe(1_000); // 1,100 - 100
      });
    });

    describe("5. Cash Dividend - With Tax (Long Position)", () => {
      it("should reduce cost basis by after-tax dividend amount", () => {
        // Step 1: Open Long - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Cash Dividend - amountPerShare=10, taxRate=0.5
        const dividendCash = handleCashDividend(position, symbol, 10, 0.5);

        // Verify dividend after tax: 100 * (1 - 0.5) = 50
        expect(dividendCash).toBe(50);

        // Verify cash: 98,900 + 50 = 98,950
        expect(position.cash).toBe(98_950);

        // Verify position
        const longPos = position.long?.get("AAPL");
        expect(longPos).toBeDefined();
        expect(longPos!.totalCost).toBe(1_050); // 1,100 - 50
      });
    });

    describe("6. Cash Dividend - Short Position (Owe Dividend)", () => {
      it("should increase cost and reduce proceeds for short position", () => {
        // Step 1: Open Short - price=100, qty=10, commission=100
        openShort(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(100_900);

        // Step 2: Cash Dividend - amountPerShare=10
        const dividendOwed = handleCashDividend(position, symbol, 10);

        // Verify dividend owed: 10 * 10 = 100 (negative because owed)
        expect(dividendOwed).toBe(-100);

        // Verify cash: 100,900 - 100 = 100,800
        expect(position.cash).toBe(100_800);

        // Verify position
        const shortPos = position.short?.get("AAPL");
        expect(shortPos).toBeDefined();
        expect(shortPos!.totalProceeds).toBe(800); // 900 - 100
      });
    });
  });

  describe("Stock Spinoffs", () => {
    describe("7. Stock Spinoff - Long Position", () => {
      it("should create new long position with zero cost basis", () => {
        const newSymbol = "NEWCO";

        // Step 1: Open Long AAPL - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);

        // Step 2: Spinoff - ratio=0.5, newSymbol=NEWCO
        handleSpinoff(position, symbol, newSymbol, 0.5);

        // Verify original position (AAPL): unchanged
        const aaplPosition = position.long?.get("AAPL");
        expect(aaplPosition).toBeDefined();
        expect(aaplPosition!.quantity).toBe(10);

        // Verify new position (NEWCO)
        const newcoPosition = position.long?.get("NEWCO");
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(5); // 10 * 0.5
        expect(newcoPosition!.totalCost).toBe(0); // spinoff has no cost basis
      });
    });

    describe("8. Stock Spinoff - Short Position", () => {
      it("should create new short position with zero proceeds", () => {
        const newSymbol = "NEWCO";

        // Step 1: Open Short AAPL - price=100, qty=10, commission=100
        openShort(position, symbol, 100, 10, 100);

        // Step 2: Spinoff - ratio=0.5, newSymbol=NEWCO
        handleSpinoff(position, symbol, newSymbol, 0.5);

        // Verify original position (AAPL): unchanged
        const aaplPosition = position.short?.get("AAPL");
        expect(aaplPosition).toBeDefined();
        expect(aaplPosition!.quantity).toBe(10);

        // Verify new short position (NEWCO)
        const newcoPosition = position.short?.get("NEWCO");
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(5); // 10 * 0.5
        expect(newcoPosition!.totalProceeds).toBe(0); // spinoff has no proceeds
      });
    });

    describe("13. Stock Spinoff into Already Open Long Position", () => {
      it("should merge spinoff shares with existing long position", () => {
        const newSymbol = "NEWCO";

        // Step 1: Open Long AAPL - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);

        // Step 2: Open Long NEWCO - price=50, qty=20, commission=50
        openLong(position, newSymbol, 50, 20, 50);
        expect(position.cash).toBe(97_850); // 100,000 - 1,100 - 1,050

        // Step 3: Spinoff AAPL→NEWCO - ratio=0.5
        handleSpinoff(position, symbol, newSymbol, 0.5);

        // Verify AAPL position: unchanged
        const aaplPosition = position.long?.get("AAPL");
        expect(aaplPosition!.quantity).toBe(10);

        // Verify NEWCO position: combined
        const newcoPosition = position.long?.get("NEWCO");
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(25); // 20 + 5
        expect(newcoPosition!.totalCost).toBe(1_050); // original totalCost unchanged
      });
    });

    describe("14. Stock Spinoff into Already Open Short Position", () => {
      it("should merge spinoff shares with existing short position", () => {
        const newSymbol = "NEWCO";

        // Step 1: Open Short AAPL - price=100, qty=10, commission=100
        openShort(position, symbol, 100, 10, 100);

        // Step 2: Open Short NEWCO - price=50, qty=20, commission=50
        openShort(position, newSymbol, 50, 20, 50);
        expect(position.cash).toBe(101_850); // 100,000 + 900 + 950

        // Step 3: Spinoff AAPL→NEWCO - ratio=0.5
        handleSpinoff(position, symbol, newSymbol, 0.5);

        // Verify AAPL position: unchanged
        const aaplPosition = position.short?.get("AAPL");
        expect(aaplPosition!.quantity).toBe(10);

        // Verify NEWCO position: combined
        const newcoPosition = position.short?.get("NEWCO");
        expect(newcoPosition).toBeDefined();
        expect(newcoPosition!.quantity).toBe(25); // 20 + 5
        expect(newcoPosition!.totalProceeds).toBe(950); // original totalProceeds unchanged
      });
    });
  });

  describe("Stock Mergers", () => {
    describe("9. Stock Merger - No Cash Component (Long Position)", () => {
      it("should replace old position with new asset position", () => {
        const newSymbol = "ACQUIRER";

        // Step 1: Open Long TARGET - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Merger - ratio=2, newSymbol=ACQUIRER, cash=0
        handleMerger(position, symbol, newSymbol, 2, 0);

        // Verify old position (AAPL/TARGET): deleted
        const oldPosition = position.long?.get("AAPL");
        expect(oldPosition).toBeUndefined();

        // Verify new position (ACQUIRER)
        const newPosition = position.long?.get("ACQUIRER");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalCost).toBe(1_100); // transferred

        // Verify cash: unchanged
        expect(position.cash).toBe(98_900);
      });
    });

    describe("10. Stock Merger - With Cash Component (Long Position)", () => {
      it("should replace position and add cash to portfolio", () => {
        const newSymbol = "ACQUIRER";

        // Step 1: Open Long TARGET - price=100, qty=10, commission=100
        openLong(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Merger - ratio=2, cashComponent=10
        handleMerger(position, symbol, newSymbol, 2, 10);

        // Verify cash received: 10 * 10 = 100
        // Cash: 98,900 + 100 = 99,000
        expect(position.cash).toBe(99_000);

        // Verify new position
        const newPosition = position.long?.get("ACQUIRER");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalCost).toBe(1_000); // 1,100 - 100
      });
    });

    describe("11. Stock Merger - Short Position with Cash", () => {
      it("should replace short position and deduct cash owed", () => {
        const newSymbol = "ACQUIRER";

        // Step 1: Open Short TARGET - price=100, qty=10, commission=100
        openShort(position, symbol, 100, 10, 100);
        expect(position.cash).toBe(100_900);

        // Step 2: Merger - ratio=2, cashComponent=10
        handleMerger(position, symbol, newSymbol, 2, 10);

        // Verify cash owed: 10 * 10 = 100
        // Cash: 100,900 - 100 = 100,800
        expect(position.cash).toBe(100_800);

        // Verify new position
        const newPosition = position.short?.get("ACQUIRER");
        expect(newPosition).toBeDefined();
        expect(newPosition!.quantity).toBe(20); // 10 * 2
        expect(newPosition!.totalProceeds).toBe(800); // 900 - 100
      });
    });

    describe("15. Stock Merger into Already Open Long Position", () => {
      it("should merge target position with existing acquirer position", () => {
        const acquirerSymbol = "ACQUIRER";
        const targetSymbol = "TARGET";

        // Step 1: Open Long TARGET - price=100, qty=10, commission=100
        openLong(position, targetSymbol, 100, 10, 100);
        expect(position.cash).toBe(98_900);

        // Step 2: Open Long ACQUIRER - price=50, qty=20, commission=50
        openLong(position, acquirerSymbol, 50, 20, 50);
        expect(position.cash).toBe(97_850);

        // Step 3: Merger TARGET→ACQUIRER - ratio=2, cashComponent=10
        handleMerger(position, targetSymbol, acquirerSymbol, 2, 10);

        // Verify TARGET position: deleted
        expect(position.long?.get("TARGET")).toBeUndefined();

        // Verify ACQUIRER position: combined
        const acquirerPosition = position.long?.get("ACQUIRER");
        expect(acquirerPosition).toBeDefined();
        expect(acquirerPosition!.quantity).toBe(40); // 20 + 20
        expect(acquirerPosition!.totalCost).toBe(2_050); // 1,050 + 1,000

        // Verify cash from merger: 10 * 10 = 100
        expect(position.cash).toBe(97_950); // 97,850 + 100
      });
    });

    describe("16. Stock Merger into Already Open Short Position", () => {
      it("should merge target short position with existing acquirer short position", () => {
        const acquirerSymbol = "ACQUIRER";
        const targetSymbol = "TARGET";

        // Step 1: Open Short TARGET - price=100, qty=10, commission=100
        openShort(position, targetSymbol, 100, 10, 100);
        expect(position.cash).toBe(100_900);

        // Step 2: Open Short ACQUIRER - price=50, qty=20, commission=50
        openShort(position, acquirerSymbol, 50, 20, 50);
        expect(position.cash).toBe(101_850);

        // Step 3: Merger TARGET→ACQUIRER - ratio=2, cashComponent=10
        handleMerger(position, targetSymbol, acquirerSymbol, 2, 10);

        // Verify TARGET position: deleted
        expect(position.short?.get("TARGET")).toBeUndefined();

        // Verify ACQUIRER position: combined
        const acquirerPosition = position.short?.get("ACQUIRER");
        expect(acquirerPosition).toBeDefined();
        expect(acquirerPosition!.quantity).toBe(40); // 20 + 20
        expect(acquirerPosition!.totalProceeds).toBe(1_750); // 950 + 800

        // Verify cash owed for merger: 10 * 10 = 100
        expect(position.cash).toBe(101_750); // 101,850 - 100
      });
    });
  });

  describe("12. Multiple Corporate Actions Sequence", () => {
    it("should correctly apply multiple sequential corporate actions", () => {
      // Step 1: Open Long - price=100, qty=10, commission=100
      openLong(position, symbol, 100, 10, 100);
      expect(position.cash).toBe(98_900);

      let longPos = position.long?.get("AAPL");
      expect(longPos!.quantity).toBe(10);

      // Step 2: Split - ratio=2
      handleSplit(position, symbol, 2);
      longPos = position.long?.get("AAPL");
      expect(longPos!.quantity).toBe(20);
      expect(longPos!.totalCost).toBe(1_100);

      // Step 3: Dividend - amountPerShare=5, taxRate=0
      handleCashDividend(position, symbol, 5, 0);
      expect(position.cash).toBe(99_000); // 98,900 + 100
      longPos = position.long?.get("AAPL");
      expect(longPos!.totalCost).toBe(1_000); // 1,100 - 100

      // Step 4: Split - ratio=0.5
      handleSplit(position, symbol, 0.5);
      longPos = position.long?.get("AAPL");
      expect(longPos!.quantity).toBe(10);
      expect(longPos!.totalCost).toBe(1_000);
    });
  });
});

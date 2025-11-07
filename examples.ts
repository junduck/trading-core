/**
 * README Examples - Validation File
 *
 * This file contains all code examples from README.md to ensure they compile and run correctly.
 * Run with: npx tsx examples.ts
 */

import {
  pu,
  appraisePortfolio,
  calculateUnrealizedPnL,
  validateOrder
} from "./src/index.js";
import type { Asset, Order, MarketSnapshot } from "./src/index.js";

console.log("=== Running README Examples ===\n");

// ============================================================================
// Example 1: Create a Portfolio
// ============================================================================
console.log("Example 1: Create a Portfolio");

const portfolio = pu.create("my-portfolio", "My Trading Portfolio");
portfolio.positions.set("USD", pu.createPosition(100000));

console.log(`✓ Created portfolio with $${pu.getCash(portfolio, "USD")} USD\n`);

// ============================================================================
// Example 2: Open a Long Position
// ============================================================================
console.log("Example 2: Open a Long Position");

const asset: Asset = {
  symbol: "AAPL",
  currency: "USD"
};

pu.openLong(portfolio, asset, 150, 100, 1);

const position = portfolio.positions.get("USD")!;
console.log(`✓ Opened long position: ${position.long.get("AAPL")?.lots.length} lots\n`);

// ============================================================================
// Example 3: Close a Position
// ============================================================================
console.log("Example 3: Close a Position");

pu.closeLong(portfolio, asset, 160, 50, 1, "FIFO");

console.log(`✓ Closed 50 shares, remaining: ${position.long.get("AAPL")?.quantity || 0} shares\n`);

// ============================================================================
// Example 4: Calculate Portfolio Value
// ============================================================================
console.log("Example 4: Calculate Portfolio Value");

const snapshot: MarketSnapshot = {
  timestamp: new Date(),
  price: new Map([
    ["AAPL", 155],
    ["TSLA", 200]
  ])
};

const values = appraisePortfolio(portfolio, snapshot);
console.log(`✓ USD Portfolio Value: $${values.get("USD")?.toFixed(2)}\n`);

// ============================================================================
// Example 5: Calculate Unrealized P&L
// ============================================================================
console.log("Example 5: Calculate Unrealized P&L");

const unrealizedPnL = calculateUnrealizedPnL(position, snapshot);
console.log(`✓ Unrealized P&L: $${unrealizedPnL.toFixed(2)}\n`);

// ============================================================================
// Example 6: Validate an Order
// ============================================================================
console.log("Example 6: Validate an Order");

const order: Order = {
  id: "order-1",
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN_LONG",
  type: "MARKET",
  quantity: 100,
  created: new Date()
};

const result = validateOrder(order, position, snapshot);
if (!result.valid) {
  console.log(`Order validation result: ${result.error?.type}`);
} else {
  console.log(`✓ Order is valid\n`);
}

// ============================================================================
// Example 7: Complete Trading Flow
// ============================================================================
console.log("Example 7: Complete Trading Flow");

// 1. Create portfolio with initial cash
const portfolio2 = pu.create("backtest-1", "Momentum Strategy");
portfolio2.positions.set("USD", pu.createPosition(100000));

// 2. Define asset and market data
const aapl: Asset = { symbol: "AAPL", currency: "USD" };

const snapshot1: MarketSnapshot = {
  timestamp: new Date("2024-01-01"),
  price: new Map([["AAPL", 150]])
};

// 3. Validate and execute buy order
const buyOrder: Order = {
  id: "order-1",
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN_LONG",
  type: "MARKET",
  quantity: 100,
  created: new Date("2024-01-01")
};

const usdPos = portfolio2.positions.get("USD")!;
const validation = validateOrder(buyOrder, usdPos, snapshot1);
if (validation.valid) {
  pu.openLong(portfolio2, aapl, 150, 100, 1);
  console.log("✓ Buy order validated and executed");
}

// 4. Check portfolio value after some time
const snapshot2: MarketSnapshot = {
  timestamp: new Date("2024-02-01"),
  price: new Map([["AAPL", 160]])
};

const position2 = portfolio2.positions.get("USD")!;
const unrealizedPnL2 = calculateUnrealizedPnL(position2, snapshot2);
const totalValue = appraisePortfolio(portfolio2, snapshot2).get("USD")!;

console.log(`✓ Unrealized P&L: $${unrealizedPnL2.toFixed(2)}`);
console.log(`✓ Total Value: $${totalValue.toFixed(2)}`);

// 5. Close position
pu.closeLong(portfolio2, aapl, 160, 100, 1, "FIFO");

console.log(`✓ Realized P&L: $${position2.realisedPnL.toFixed(2)}`);

console.log("\n=== All Examples Completed Successfully! ===");

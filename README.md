# trading-core

Foundation data structures and utilities for spot market trading bookkeeping and backtesting.

## What It Does

This library provides the building blocks for tracking trading positions and calculating portfolio values. It handles:

- **Position tracking** - Keep track of long and short positions with lot-level accounting (FIFO/LIFO)
- **Portfolio management** - Manage positions across multiple currencies
- **Order validation** - Check if orders are valid before execution
- **Portfolio valuation** - Calculate current portfolio value and unrealized P&L
- **Market data** - Represent market prices, quotes, and bars
- **Corporate actions** - Handle stock splits, dividends, and spinoffs

## What It Does NOT Do

This library focuses only on bookkeeping. It does NOT include:

- Strategy engines or signal generation
- Matching engines or broker simulators
- Backtesting frameworks or event loops
- Data fetching or storage

## Installation

```bash
npm install @junduck/trading-core
```

## Quick Start

### Create a Portfolio

```typescript
import { pu } from "@junduck/trading-core";

// Create portfolio
const portfolio = pu.create("my-portfolio", "My Trading Portfolio");

// Initialize USD position with cash
portfolio.positions.set("USD", pu.createPosition(100000));
```

### Open a Long Position

```typescript
import { pu } from "@junduck/trading-core";
import type { Asset } from "@junduck/trading-core";

const asset: Asset = {
  symbol: "AAPL",
  currency: "USD"
};

pu.openLong(portfolio, asset, 150, 100, 1);
```

### Close a Position

```typescript
import { pu } from "@junduck/trading-core";

pu.closeLong(portfolio, asset, 160, 50, 1, "FIFO");
```

### Calculate Portfolio Value

```typescript
import { appraisePortfolio } from "@junduck/trading-core";
import type { MarketSnapshot } from "@junduck/trading-core";

const snapshot: MarketSnapshot = {
  timestamp: new Date(),
  price: new Map([
    ["AAPL", 155],
    ["TSLA", 200]
  ])
};

const values = appraisePortfolio(portfolio, snapshot);
console.log(`USD Portfolio Value: $${values.get("USD")}`);
```

### Calculate Unrealized P&L

```typescript
import { calculateUnrealizedPnL } from "@junduck/trading-core";

const position = portfolio.positions.get("USD")!;
const unrealizedPnL = calculateUnrealizedPnL(position, snapshot);
console.log(`Unrealized P&L: $${unrealizedPnL}`);
```

### Validate an Order

```typescript
import { validateOrder } from "@junduck/trading-core";
import type { Order } from "@junduck/trading-core";

const order: Order = {
  id: "order-1",
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN_LONG",
  type: "MARKET",
  quantity: 100,
  created: new Date()
};

const position = portfolio.positions.get("USD")!;
const result = validateOrder(order, position, snapshot);
if (!result.valid) {
  console.error(`Order invalid: ${result.error?.type}`);
}
```

## Core Data Structures

### Position

Represents a currency account with:
- Cash balance
- Long positions (Map of symbol → LongPosition)
- Short positions (Map of symbol → ShortPosition)
- Realized P&L and commission tracking

### Portfolio

Multi-currency portfolio containing:
- Map of currency → Position
- Portfolio metadata (id, name, timestamps)

### Order & Fill

- **Order**: Trading intent (BUY/SELL with OPEN/CLOSE effect)
- **Fill**: Actual execution record (price, quantity, commission)

### Market Data

- **MarketSnapshot**: Point-in-time market prices
- **MarketQuote**: Bid/ask quotes
- **MarketBar**: OHLCV bars
- **Universe**: Collection of tradable assets

## API Reference

### Portfolio Utils

All portfolio utilities are under the `pu` namespace to avoid naming conflicts with position-level utilities (both have `openLong`, `closeLong`, `openShort`, `closeShort` functions).

**Portfolio Management:**

- `pu.create(id, name)` - Create a new portfolio
- `pu.createPosition(initialCash?, time?)` - Create a new position with initial cash
- `pu.getPosition(portfolio, currency)` - Get position for currency
- `pu.getCash(portfolio, currency)` - Get cash balance for currency
- `pu.getCurrencies(portfolio)` - Get all currency codes in portfolio
- `pu.hasAsset(portfolio, asset)` - Check if asset exists in portfolio

**Trading (Portfolio-level):**

- `pu.openLong(portfolio, asset, price, quantity, commission?, time?)` - Open or add to long position
- `pu.closeLong(portfolio, asset, price, quantity, commission?, strategy?, time?)` - Close long position
- `pu.openShort(portfolio, asset, price, quantity, commission?, time?)` - Open or add to short position
- `pu.closeShort(portfolio, asset, price, quantity, commission?, strategy?, time?)` - Close short position

**Corporate Actions (Portfolio-level):**

- `pu.handleSplit(portfolio, asset, ratio, time?)` - Handle stock split
- `pu.handleCashDividend(portfolio, asset, amountPerShare, taxRate?, time?)` - Handle cash dividend
- `pu.handleSpinoff(portfolio, asset, newSymbol, ratio, time?)` - Handle spinoff
- `pu.handleMerger(portfolio, asset, newSymbol, ratio, cashComponent?, time?)` - Handle merger

**Crypto Actions (Portfolio-level):**

- `pu.handleHardFork(portfolio, asset, newSymbol, ratio?, time?)` - Handle hard fork
- `pu.handleAirdrop(portfolio, currency, holderSymbol, airdropSymbol, amountPerToken?, fixedAmount?, time?)` - Handle airdrop
- `pu.handleTokenSwap(portfolio, asset, newSymbol, ratio?, time?)` - Handle token swap
- `pu.handleStakingReward(portfolio, asset, rewardPerToken, time?)` - Handle staking rewards

### Position Utils

Position-level trading functions (exported directly):

- `openLong(pos, symbol, price, quantity, commission?, time?)` - Open or add to long position
- `closeLong(pos, symbol, price, quantity, commission?, strategy?, time?)` - Close long position
- `openShort(pos, symbol, price, quantity, commission?, time?)` - Open or add to short position
- `closeShort(pos, symbol, price, quantity, commission?, strategy?, time?)` - Close short position
- `validatePosition(pos)` - Validate position integrity

### Market Utils

- `createUniverse(assets, timestamp?)` - Create a Universe with filtering capabilities
- `appraisePosition(position, snapshot)` - Calculate total position value
- `appraisePortfolio(portfolio, snapshot)` - Calculate portfolio value across currencies
- `calculateUnrealizedPnL(position, snapshot)` - Calculate unrealized profit/loss
- `isAssetValidAt(asset, timestamp)` - Check if asset is valid at timestamp

### Fill Utils

- `applyFill(position, fill, closeStrategy?)` - Apply a single fill to position
- `applyFills(position, fills, closeStrategy?)` - Apply multiple fills sequentially

### Order Validation

- `validateOrder(order, position, snapshot)` - Validate order against position and market state

## Example: Complete Trading Flow

```typescript
import {
  pu,
  appraisePortfolio,
  calculateUnrealizedPnL,
  validateOrder
} from "@junduck/trading-core";
import type { Asset, Order, MarketSnapshot } from "@junduck/trading-core";

// 1. Create portfolio with initial cash
const portfolio = pu.create("backtest-1", "Momentum Strategy");
portfolio.positions.set("USD", pu.createPosition(100000));

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

const validation = validateOrder(buyOrder, usdPos, snapshot1);
if (validation.valid) {
  pu.openLong(portfolio, aapl, 150, 100, 1);
}

// 4. Check portfolio value after some time
const snapshot2: MarketSnapshot = {
  timestamp: new Date("2024-02-01"),
  price: new Map([["AAPL", 160]])
};

const position = portfolio.positions.get("USD")!;
const unrealizedPnL = calculateUnrealizedPnL(position, snapshot2);
const totalValue = appraisePortfolio(portfolio, snapshot2).get("USD")!;

console.log(`Unrealized P&L: $${unrealizedPnL}`);
console.log(`Total Value: $${totalValue}`);

// 5. Close position
pu.closeLong(portfolio, aapl, 160, 100, 1, "FIFO");

console.log(`Realized P&L: $${position.realisedPnL}`);
```

## Testing

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:ui         # UI mode
npm run test:coverage   # Coverage report
```

## Building

```bash
npm run build           # Build to dist/
npm run dev             # Watch mode
npm run typecheck       # Type checking only
```

## License

MIT

## Credits

Documentation and core implementation assistance by Claude (Anthropic).

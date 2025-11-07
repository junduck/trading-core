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
import { createPortfolio } from "@junduck/trading-core";

const portfolio = createPortfolio({
  id: "my-portfolio",
  name: "My Trading Portfolio",
  initialCash: { USD: 100000 }
});
```

### Open a Long Position

```typescript
import { openLongPosition } from "@junduck/trading-core";
import type { Fill } from "@junduck/trading-core";

const fill: Fill = {
  symbol: "AAPL",
  quantity: 100,
  price: 150,
  commission: 1,
  timestamp: new Date()
};

openLongPosition(portfolio, "USD", fill);
```

### Close a Position

```typescript
import { closeLongPosition } from "@junduck/trading-core";

const closeFill: Fill = {
  symbol: "AAPL",
  quantity: 50,
  price: 160,
  commission: 1,
  timestamp: new Date()
};

closeLongPosition(portfolio, "USD", closeFill, "FIFO");
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
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN",
  type: "MARKET",
  quantity: 100,
  timestamp: new Date()
};

const result = validateOrder(order, portfolio, "USD", snapshot);
if (!result.valid) {
  console.error(`Order invalid: ${result.reason}`);
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

### Position Utils

- `openLongPosition()` - Open or add to a long position
- `closeLongPosition()` - Reduce or close a long position
- `openShortPosition()` - Open or add to a short position
- `closeShortPosition()` - Reduce or close a short position

### Portfolio Utils

- `createPortfolio()` - Create a new portfolio
- `getOrCreatePosition()` - Get or create a currency position
- `depositCash()` - Add cash to portfolio
- `withdrawCash()` - Remove cash from portfolio

### Market Utils

- `appraisePosition()` - Calculate position value
- `appraisePortfolio()` - Calculate portfolio value across currencies
- `calculateUnrealizedPnL()` - Calculate unrealized profit/loss
- `createUniverse()` - Create a tradable asset universe

### Order Validation

- `validateOrder()` - Validate order before execution
- `canOpenPosition()` - Check if position can be opened
- `canClosePosition()` - Check if position can be closed

### Corporate Actions

- `applyStockSplit()` - Apply stock split to positions
- `applyCashDividend()` - Apply cash dividend
- `applySpinoff()` - Apply spinoff action

## Example: Complete Trading Flow

```typescript
import {
  createPortfolio,
  openLongPosition,
  closeLongPosition,
  appraisePortfolio,
  calculateUnrealizedPnL,
  validateOrder
} from "@junduck/trading-core";

// 1. Create portfolio with initial cash
const portfolio = createPortfolio({
  id: "backtest-1",
  name: "Momentum Strategy",
  initialCash: { USD: 100000 }
});

// 2. Validate and execute buy order
const buyOrder = {
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN",
  type: "MARKET",
  quantity: 100,
  timestamp: new Date("2024-01-01")
};

const snapshot1 = {
  timestamp: new Date("2024-01-01"),
  price: new Map([["AAPL", 150]])
};

const validation = validateOrder(buyOrder, portfolio, "USD", snapshot1);
if (validation.valid) {
  const buyFill = {
    symbol: "AAPL",
    quantity: 100,
    price: 150,
    commission: 1,
    timestamp: new Date("2024-01-01")
  };
  openLongPosition(portfolio, "USD", buyFill);
}

// 3. Check portfolio value after some time
const snapshot2 = {
  timestamp: new Date("2024-02-01"),
  price: new Map([["AAPL", 160]])
};

const position = portfolio.positions.get("USD")!;
const unrealizedPnL = calculateUnrealizedPnL(position, snapshot2);
const totalValue = appraisePortfolio(portfolio, snapshot2).get("USD")!;

console.log(`Unrealized P&L: $${unrealizedPnL}`);
console.log(`Total Value: $${totalValue}`);

// 4. Close position
const sellFill = {
  symbol: "AAPL",
  quantity: 100,
  price: 160,
  commission: 1,
  timestamp: new Date("2024-02-01")
};
closeLongPosition(portfolio, "USD", sellFill, "FIFO");

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

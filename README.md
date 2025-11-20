# trading-core

Foundation data structures and utilities for spot market trading bookkeeping, backtesting, and algorithmic trading.

## What It Does

This library provides comprehensive building blocks for trading systems in two main areas:

### 1. Trading Bookkeeping

- **Position tracking** - Long and short positions with lot-level accounting (FIFO/LIFO)
- **Portfolio management** - Multi-currency positions with corporate actions support
- **Order validation** - Pre-execution order checking
- **Portfolio valuation** - Real-time value and P&L calculations
- **Market data** - Price snapshots, quotes, and bars
- **Corporate actions** - Stock splits, dividends, spinoffs, mergers, hard forks, airdrops

### 2. Algorithm Foundations

- **Data structures** - CircularBuffer, Deque, PriorityQueue, RBTree
- **Online statistics** - O(1) cumulative mean, variance, covariance, correlation, beta, skewness, kurtosis
- **Rolling statistics** - Sliding window SMA, EMA, EWMA, variance, z-scores (O(1)), min/max (O(1)), median/quantile (O(n))
- **Numeric utilities** - Array-based stats (mean, variance, correlation), series transforms (returns, lag/lead, winsorize), ranking (argsort, spearman)
- **Probabilistic structures** - CountMinSketch, BloomFilter
- **Performance metrics** - Drawdown/drawup calculations with Kahan summation for numerical stability

## What It Does NOT Do

This library provides primitives, not complete systems. It does NOT include:

- Strategy engines or signal generation
- Matching engines or broker simulators
- Backtesting frameworks or event loops
- Data fetching or storage
- Charting or visualization

## Installation

```bash
npm install @junduck/trading-core
```

## Quick Start

### Bookkeeping: Create a Portfolio

```typescript
import { pu } from "@junduck/trading-core";

// Create portfolio
const portfolio = pu.create("my-portfolio", "My Trading Portfolio");

// Initialize USD position with cash
pu.createPosition(portfolio, "USD", 100000);
```

### Bookkeeping: Open a Long Position

```typescript
import { pu } from "@junduck/trading-core";
import type { Asset } from "@junduck/trading-core";

const asset: Asset = {
  symbol: "AAPL",
  currency: "USD"
};

pu.openLong(portfolio, asset, 150, 100, 1);
```

### Bookkeeping: Close a Position

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

### Bookkeeping: Validate an Order

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

### Algorithms: Rolling Window Statistics

```typescript
import { SMA, EMA, RollingStddev } from "@junduck/trading-core";

// Simple Moving Average
const sma = new SMA({ period: 20 });
sma.update(100); // returns 100
sma.update(102); // returns 101

// Exponential Moving Average
const ema = new EMA({ period: 12 });
ema.update(100);
ema.update(105);

// Rolling Standard Deviation
const std = new RollingStddev({ period: 20 });
const { mean, stddev } = std.update(100);
```

### Algorithms: Online Statistics

```typescript
import { CMA, CuVar, CuCorr } from "@junduck/trading-core";

// Cumulative Moving Average
const cma = new CMA();
cma.update(100); // returns 100
cma.update(200); // returns 150

// Cumulative Variance
const variance = new CuVar({ ddof: 1 });
const { mean, variance: v } = variance.update(100);

// Cumulative Correlation
const corr = new CuCorr();
const { corr: correlation } = corr.update(100, 200);
```

### Algorithms: Performance Metrics

```typescript
import { CircularBuffer, maxDrawDown, maxRelDrawDown } from "@junduck/trading-core";

const equity = new CircularBuffer<number>(1000);
equity.push(100000);
equity.push(105000);
equity.push(102000);
equity.push(108000);

const mdd = maxDrawDown(equity);        // Absolute drawdown
const relMdd = maxRelDrawDown(equity);  // Percentage drawdown
```

### Algorithms: Numeric Utilities

```typescript
import {
  mean, stddev, corr, spearman,
  returns, logReturns, winsorize,
  argsort, rank
} from "@junduck/trading-core";

// Basic statistics
const prices = [100, 102, 98, 105, 103];
const avg = mean(prices);           // 101.6
const std = stddev(prices, 1);      // sample stddev

// Returns
const rets = returns(prices);       // [0.02, -0.039, 0.071, -0.019]
const logRets = logReturns(prices); // log returns

// Correlation
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 5, 4, 5];
const pearson = corr(x, y);         // Pearson correlation
const spear = spearman(x, y);       // Spearman rank correlation

// Ranking
const ranks = rank(prices);         // [0, 0.5, 0, 1, 0.75]
const sorted = argsort(prices);     // [2, 0, 1, 4, 3]

// Data preparation
const clean = winsorize(prices, { lower: 0.05, upper: 0.95 });
```

## Core Data Structures

### Algorithm Foundations

**Containers:**

- `CircularBuffer<T>` - Fixed-size circular buffer with O(1) push/pop
- `Deque<T>` - Double-ended queue
- `PriorityQueue<T>` - Min-heap based priority queue
- `RBTree<T>` - Red-Black Tree for sorted operations

**Online Statistics (Cumulative):**

- `CMA` - Cumulative moving average
- `CuVar`, `CuStddev` - Variance and standard deviation
- `CuCov`, `CuCorr`, `CuBeta` - Covariance, correlation, beta
- `CuSkew`, `CuKurt` - Skewness and kurtosis
- `CuHistogram` - Dynamic histogram

**Rolling Window Statistics:**

- `SMA`, `EMA`, `EWMA` - Moving averages
- `RollingVar`, `RollingStddev` - Variance and standard deviation
- `RollingVarEW`, `RollingStddevEW` - Exponentially weighted variants
- `RollingZScore`, `RollingZScoreEW` - Standardized scores
- `RollingCov`, `RollingCorr`, `RollingBeta` - Covariance, correlation, beta
- `RollingMin`, `RollingMax`, `RollingMinMax` - Extrema tracking
- `RollingArgMin`, `RollingArgMax` - Extrema with indices
- `RollingMedian`, `RollingQuantile` - Order statistics (O(n) using QuickSelect)
- `RollingSkew`, `RollingKurt` - Higher moments
- `RollingHistogram` - Rolling histogram

**Probabilistic Structures:**

- `CountMinSketch` - Space-efficient frequency estimation
- `BloomFilter` - Probabilistic set membership

**Utilities:**

- `Kahan` - Numerically stable summation
- `SmoothedAccum` - Exponential smoothing
- `maxDrawDown()`, `maxRelDrawDown()` - Drawdown metrics
- `maxDrawUp()`, `maxRelDrawUp()` - Drawup metrics
- `exp_factor()`, `wilders_factor()` - Smoothing factors

**Numeric Utilities (Array-based):**

- `sum`, `min`, `max`, `argmin`, `argmax` - Array aggregations
- `mean`, `variance`, `stddev`, `skew`, `kurt` - Descriptive statistics
- `cov`, `corr`, `spearman` - Correlation measures
- `median`, `quantile` - Order statistics
- `cumsum`, `diff`, `pctChange`, `returns`, `logReturns` - Series transforms
- `norm`, `lag`, `lead`, `coalesce`, `locf`, `winsorize` - Data preparation
- `argsort`, `rank` - Ranking utilities
- `gcd`, `lcm`, `lerp`, `clamp` - Math utilities

### Bookkeeping Structures

**Position** - Represents a currency account with:

- Cash balance
- Long positions (Map of symbol → LongPosition)
- Short positions (Map of symbol → ShortPosition)
- Realized P&L and commission tracking

**Portfolio** - Multi-currency portfolio containing:

- Map of currency → Position
- Portfolio metadata (id, name, timestamps)

**Order & Fill:**

- **Order**: Trading intent (BUY/SELL with OPEN/CLOSE effect)
- **Fill**: Actual execution record (price, quantity, commission)

**Market Data:**

- **MarketSnapshot**: Point-in-time market prices
- **MarketQuote**: Bid/ask quotes
- **MarketBar**: OHLCV bars
- **Universe**: Collection of tradable assets

## API Reference

### Portfolio Utils

All portfolio utilities are under the `pu` namespace to avoid naming conflicts with position-level utilities (both have `openLong`, `closeLong`, `openShort`, `closeShort` functions).

**Portfolio Management:**

- `pu.create(id, name)` - Create a new portfolio
- `pu.createPosition(portfolio, currency, initialCash?, time?)` - Create a position in portfolio
- `pu.getPosition(portfolio, currency)` - Get position for currency
- `pu.getCash(portfolio, currency)` - Get cash balance for currency
- `pu.getCurrencies(portfolio)` - Get all currency codes in portfolio
- `pu.getAllSymbols(portfolio)` - Get all symbols organized by currency
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

Position-level functions (exported directly):

- `createPosition(initialCash?, time?)` - Create a Position object
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
pu.createPosition(portfolio, "USD", 100000);

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

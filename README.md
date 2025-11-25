# trading-core

Foundation data structures and utilities for spot market trading bookkeeping, backtesting, and algorithmic trading.

## What It Does

This library provides comprehensive building blocks for trading systems in two main areas:

### 1. Trading Bookkeeping

- **Position tracking** - Long and short positions with lot-level accounting (FIFO/LIFO)
- **Portfolio management** - Multi-currency positions with corporate actions support
- **Order management** - Full order lifecycle tracking
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

This library supports two approaches for managing positions, depending on your needs:

### Bookkeeping Style 1: Direct Position Manipulation

For simpler workflows where you already have execution prices and quantities. Ideal for backtesting, importing trades, and simple portfolio tracking.

```text
createPosition() → Position(initial cash)
   |
   |-- openLong/closeLong/openShort/closeShort() → Position updated
   |
   |-- market conditions update
   |
   |-- appraisePosition/appraisePortfolio() → Portfolio value
```

```typescript
import { createPosition, openLong, closeLong, appraisePosition } from "@junduck/trading-core";

const position = createPosition(100_000);
openLong(position, "BTC", 50_000, 10, 10);
closeLong(position, "BTC", 55_000, 5, 10, "FIFO");

// Market update
const snapshot = { price: new Map([["BTC", 52_000]]), timestamp: new Date() };
const value = appraisePosition(position, snapshot);
```

### Bookkeeping Style 2: Order Abstraction

For realistic trading with order lifecycle management. Ideal for order book simulation, partial fills, and order state tracking.

```text
Order (intent)
   |
   |-- validateOrder() --> invalid → rejectOrder() → OrderState(REJECT)
   |
   |-- validateOrder() --> valid → acceptOrder() → OrderState(OPEN)
                                         |
                                         |-- fillOrder() → Fill + OrderState(PARTIAL/FILLED)
                                         |        |
                                         |        v
                                         |   processFill() → Position updated
                                         |
                                         |-- cancelOrder() → OrderState(CANCELLED)
```

```typescript
import { buyOrder, acceptOrder, fillOrder, processFill } from "@junduck/trading-core";

const order = buyOrder({ symbol: "BTC", quant: 10, price: 50_000 });
const orderState = acceptOrder(order);

const fill = fillOrder({ state: orderState, quant: 5, price: 50_000, commission: 10 });
const effect = processFill(position, fill);  // Updates position

// Partial fill: orderState.status === "PARTIAL"
cancelOrder(orderState);  // Cancel remaining
```

**When to use each:**

- **Direct manipulation**: Backtesting with complete data, importing historical trades, simple scenarios
- **Order abstraction**: Order book simulation, partial fills, realistic order lifecycle, complex systems

Both styles update the same `Position` structure and can be mixed as needed.

### Online Statistics: O(1) Real-Time Calculations

For streaming data scenarios, use online statistics that update incrementally with O(1) complexity:

```text
Create instance → new data arrives → update(x) → returns new value + internal state updated
```

```typescript
import { CMA, CuVar, RollingMax, EWMA } from "@junduck/trading-core";

// Create statistics trackers
const priceAvg = new CMA();
const priceVar = new CuVar();
const rolling5High = new RollingMax(5);
const ewma = new EWMA(0.1);

// WebSocket example: update on each tick
websocket.on('message', (data) => {
  const price = data.price;

  const mean = priceAvg.update(price);        // Cumulative mean
  const variance = priceVar.update(price);    // Cumulative variance
  const high5 = rolling5High.update(price);   // 5-period high
  const smoothed = ewma.update(price);        // Exponentially weighted MA

  console.log({ mean, variance, high5, smoothed });
});
```

**Use cases:**

- **Real-time monitoring**: Track live market statistics without storing historical data
- **Memory efficiency**: O(1) space complexity regardless of data volume
- **Stream processing**: Calculate metrics on continuous data feeds
- **High-frequency**: Fast updates suitable for tick-by-tick processing

### CircularBuffer: Fixed-Size Sliding Windows

Fixed-size buffer that automatically overwrites old data - perfect for sliding windows without manual cleanup:

```typescript
import { CircularBuffer } from "@junduck/trading-core";

const lastPrices = new CircularBuffer<number>(3);

lastPrices.push(100);  // [100]
lastPrices.push(102);  // [100, 102]
lastPrices.push(101);  // [100, 102, 101]
lastPrices.push(103);  // [102, 101, 103] - overwrites oldest (100)

console.log(lastPrices.toArray());  // [102, 101, 103]
console.log(lastPrices.size());     // 3
```

**Overwriting behavior is intentional and useful:**

- No need to manually remove old elements
- Constant memory usage for sliding windows
- Perfect for last-N-ticks scenarios
- Ideal for maintaining recent history in streaming contexts

### PriorityQueue: Bid/Ask Order Book

Min-heap implementation for efficient order matching in a limit order book:

```typescript
import { PriorityQueue } from "@junduck/trading-core";

type Order = { price: number; size: number; id: string };

// Bid queue: buyers (highest price has priority)
const bids = new PriorityQueue<Order>((a, b) => b.price - a.price);

// Ask queue: sellers (lowest price has priority)
const asks = new PriorityQueue<Order>((a, b) => a.price - b.price);

// Market makers place orders
bids.push({ price: 50000, size: 2, id: "B1" });
bids.push({ price: 50100, size: 1, id: "B2" });  // Better bid
bids.push({ price: 49900, size: 5, id: "B3" });

asks.push({ price: 50200, size: 1, id: "A1" });
asks.push({ price: 50150, size: 2, id: "A2" });  // Better ask
asks.push({ price: 50300, size: 3, id: "A3" });

// Check best bid/ask (top of book)
console.log(bids.peek());  // { price: 50100, size: 1, id: "B2" } - highest bid
console.log(asks.peek());  // { price: 50150, size: 2, id: "A2" } - lowest ask

// Market order arrives: match best prices
const bestBid = bids.pop();
const bestAsk = asks.pop();

console.log(`Spread: ${bestAsk.price - bestBid.price}`);  // 50
```

**Use cases:**

- Limit order book implementation
- Best bid/ask tracking
- Order matching engines
- Event scheduling by timestamp

## Core Data Structures

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

### Order Utils

**Order Creation:**

- `buyOrder(opts)` - Create BUY order to open long position
- `sellOrder(opts)` - Create SELL order to close long position
- `shortOrder(opts)` - Create SELL order to open short position
- `coverOrder(opts)` - Create BUY order to close short position (cover)

**Order Lifecycle:**

- `acceptOrder(order, time?)` - Accept order and create OrderState with status "OPEN"
- `rejectOrder(order, time?)` - Reject order and create OrderState with status "REJECT"
- `cancelOrder(state, time?)` - Cancel active order by updating state to "CANCELLED"

**Order Validation:**

- `validateOrder(order, position, snapshot)` - Validate order against position and market state

### Fill Utils

- `fillOrder(opts)` - Fill an order and create Fill receipt, updates OrderState
- `processFill(position, fill, closeStrategy?)` - Process a fill to update position
- `applyFill(position, fill, closeStrategy?)` - (deprecated) Apply a single fill to position
- `applyFills(position, fills, closeStrategy?)` - (deprecated) Apply multiple fills sequentially

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

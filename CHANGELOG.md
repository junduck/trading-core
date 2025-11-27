# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2025-11-27

### Added

- Added `value` readonly property to all stateful operators
  - Provides direct access to the current computed value without calling methods
  - Available on both online (cumulative) and rolling window statistics
  - Enables more ergonomic API usage for accessing current state
- Added running performance metrics for trading strategy evaluation
  - `RunningSharpe` - Tracks Sharpe ratio (mean_return - riskfree) / stddev_return
  - `RunningSortino` - Tracks Sortino ratio using downside volatility only
  - `DownStats` - Tracks downside mean and standard deviation (semi-deviation)
  - `RunningWinRate` - Tracks percentage of positive returns (hit ratio)
  - `RunningGainLoss` - Tracks average gain/loss ratio
  - `RunningExpectancy` - Tracks expectancy: (win_rate × avg_gain) - (loss_rate × avg_loss)
  - `RunningProfitFactor` - Tracks sum_of_gains / sum_of_losses
- Added running drawdown and drawup tracking utilities
  - `RunningDrawdown` - Tracks absolute drawdown as peak - value
  - `RunningDrawup` - Tracks absolute drawup as value - trough
  - `RunningRelDrawdown` - Tracks relative drawdown as (peak - value) / peak
  - `RunningRelDrawup` - Tracks relative drawup as (value - trough) / trough
  - `RunningLongestDrawdown` - Tracks longest drawdown duration
  - `RunningLongestDrawup` - Tracks longest drawup duration
  - All drawdown utilities support generic time types with Date as default

### Fixed

- Fixed potential issue from returning reference to internal state array from stateful operators in `CuHistogram` and `RollingHistogram`
  - Both histogram classes now return copies of internal arrays instead of direct references
  - Prevents accidental mutation of internal state by external code
  - Affects `update()` method which now returns `[...this.counts]` instead of direct reference

## [2.4.1] - 2025-11-25

### Added

- `@junduck/trading-core/algorithm` and `@junduck/trading-core/trading` deep import. No actual change to codebase.

## [2.4.0] - 2025-11-25

### Added

**Order Lifecycle Management:**

- `acceptOrder()` - Accept a submitted order and update its state
- `rejectOrder()` - Reject a submitted order with reason and update its state
- `fillOrder()` - Process order fills and update order state with fill tracking
  - Full order lifecycle now completed: submit → accept/reject → fill
  - Proper state transitions with timestamp tracking
  - Comprehensive fill tracking in order state

### Documentation

- Simplified and reorganized README with cleaner structure

## [2.3.0] - 2025-11-25

### Added

**Order Constructors:**

- `buyOrder()` - Convenient constructor for BUY orders to open long positions
- `sellOrder()` - Convenient constructor for SELL orders to close long positions
- `shortOrder()` - Convenient constructor for SELL orders to open short positions
- `coverOrder()` - Convenient constructor for BUY orders to close short positions (cover)
  - Order type automatically determined by price parameters:
    - No price/stopPrice → MARKET order
    - `price` only → LIMIT order
    - `stopPrice` only → STOP order
  - Simplifies order creation with clear intent-based naming

**Fill Processing:**

- `processFill()` - New function to process a single fill and return its effect
- `FillEffect` interface - Simplified interface for fill effects
  - Contains `fill`, `cashFlow`, and `realisedPnL` fields
  - Cleaner alternative to `ApplyFillResult`

### Documentation

**Position Utilities:**

- Enhanced JSDoc for `openLong()`, `closeLong()`, `openShort()`, `closeShort()` to clarify permissive behavior
  - Documents that these are low-level primitives that operate permissively on position state
  - Clarifies that validation and business logic enforcement is the caller's responsibility
  - Examples: won't prevent opening short while holding long, won't validate cash/margin availability
- Enhanced JSDoc for `processFill()` to document permissive delegation to position primitives

### Deprecated

- `applyFill()` - Use `processFill()` instead (will be removed in v3.0)
- `applyFills()` - Use `processFill()` with map/reduce instead (will be removed in v3.0)
- `ApplyFillResult` interface - Use `FillEffect` instead (will be removed in v3.0)

## [2.2.0] - 2025-11-22

### Added

**Position Query Utilities:**

- `q` - Opinionated query helpers for convenient position access
  - `q.qty(pos, symbol)`, `q.cost(pos, symbol)` - Shortcuts for long position queries
  - `q.longQty()`, `q.shortQty()` - Get position quantities with 0 default
  - `q.longCost()`, `q.shortProceeds()` - Get cost/proceeds with 0 default
  - `q.longPnL()`, `q.shortPnL()` - Get realised PnL with 0 default
  - `q.hasLong()`, `q.hasShort()` - Check position existence with false default
  - Provides simplified accessors that flatten nested structure and return sensible defaults
  - Eliminates need for verbose optional chaining: `q.longQty(pos, "AAPL")` vs `pos.long?.get("AAPL")?.quantity ?? 0`

**Testing:**

- Tests for position query helpers
- Tests for position lot actions

### Changed

- `handleAirdrop()`: Removed unnecessary branch check for cleaner code

## [2.1.2] - 2025-11-21

### Changed

- **Position Utilities:** Moved position map initialization (`long`/`short`) from `openLong()`/`openShort()` to individual lot operation functions (`pushLongPositionLot`, `amendLongPositionLot`, `pushShortPositionLot`, `amendShortPositionLot`) for safer API usage when calling lot operations directly
- Updated JSDoc with group annotations for better documentation organization

### Fixed

- Corrected `CuCov` test case to use `ddof: 1` for proper covariance calculation validation

## [2.1.1] - 2025-11-20

### Added

- TypeDoc documentation generation

### Changed

- Updated JSDoc with group annotations for better documentation organization

## [2.1.0] - 2025-11-20

### Added

**Numeric Utilities (`src/numeric`):**

Array-based numeric and statistical operations for batch processing.

*Array Operations:*

- `sum`, `min`, `max` - Basic aggregations
- `argmin`, `argmax` - Index of extrema

*Statistical Functions:*

- `mean`, `variance`, `stddev` - Central tendency and dispersion
- `skew`, `kurt` - Higher moments
- `cov`, `corr` - Covariance and Pearson correlation
- `median`, `quantile` - Order statistics using QuickSelect

*Series Transformations:*

- `norm` - Z-score normalization
- `sign` - Element-wise sign
- `cumsum`, `diff` - Cumulative sum and first differences
- `pctChange`, `returns`, `logReturns` - Price returns
- `lag`, `lead` - Series shifting
- `coalesce`, `locf` - NaN handling
- `winsorize` - Extreme value clamping

*Ranking:*

- `argsort` - Stable sort indices
- `rank` - Fractional ranks in [0, 1]
- `spearman` - Spearman rank correlation

*Math Utilities:*

- `gcd`, `lcm` - Greatest common divisor and least common multiple
- `midpoint`, `lerp`, `invLerp`, `remap`, `clamp` - Interpolation utilities
- `NumericBuffer` - Interface for indexed numeric access

### Technical Notes

- Welford's algorithm for numerically stable variance
- Kahan summation for cumsum, skew, kurt
- QuickSelect O(n) algorithm for median/quantile
- Consistent `ddof=0` default across all functions
- All functions work on `number[]` arrays

## [2.0.0] - 2025-11-19

### Breaking Changes

**Position Creation API:**

- **`pu.createPosition()` signature changed** - Function moved from portfolio utilities to position utilities with new behavior
  - **Old API (removed):** `portfolio.positions.set("USD", pu.createPosition(100000))`
  - **New API:** `pu.createPosition(portfolio, "USD", 100000)` - directly modifies portfolio
  - **Migration:** Use new signature `pu.createPosition(portfolio, currency, initialCash, time?)`
  - **Alternative:** Import `createPosition` from top-level to get Position factory: `import { createPosition } from "@junduck/trading-core"` then `portfolio.positions.set("USD", createPosition(100000))`

This change aligns the API design where `pu` namespace functions operate on portfolios rather than return intermediate objects.

### Added

**Data Structures:**

- `CircularBuffer<T>` - Fixed-size circular buffer with Boost-like interface
- `Deque<T>` - Double-ended queue with O(1) push/pop at both ends
- `PriorityQueue<T>` - Min-heap based priority queue
- `RBTree<T>` - Red-Black Tree for sorted container operations

**Online Statistics (Cumulative):**

- `CMA` - O(1) cumulative moving average with Kahan summation
- `CuVar`, `CuStddev` - O(1) cumulative variance/stddev using Welford's algorithm
- `CuCov`, `CuCorr`, `CuBeta` - O(1) cumulative covariance/correlation/beta
- `CuSkew`, `CuKurt` - O(1) cumulative skewness and kurtosis
- `CuHistogram` - Dynamic histogram with automatic bin management

**Rolling Window Statistics:**

- `RollingSum`, `SMA` - O(1) rolling sum and simple moving average
- `EMA` - Exponential moving average with infinite window
- `EWMA` - O(1) exponential weighted moving average with fixed window
- `RollingVar`, `RollingStddev` - O(1) rolling variance/stddev
- `RollingVarEW`, `RollingStddevEW` - Exponentially weighted variants
- `RollingZScore`, `RollingZScoreEW` - Standardized scores
- `RollingCov`, `RollingCorr`, `RollingBeta` - Rolling covariance/correlation/beta
- `RollingCovEW`, `RollingCorrEW`, `RollingBetaEW` - Exponentially weighted variants
- `RollingMin`, `RollingMax`, `RollingMinMax` - O(1) extrema tracking
- `RollingArgMin`, `RollingArgMax`, `RollingArgMinMax` - Extrema with indices
- `RollingMedian`, `RollingQuantile` - Order statistics
- `RollingSkew`, `RollingKurt` - Rolling skewness and kurtosis
- `RollingHistogram` - Rolling histogram with fixed bins

**Probabilistic Structures:**

- `CountMinSketch` - Space-efficient frequency estimation
- `BloomFilter` - Probabilistic set membership testing

**Utility Functions:**

- `maxDrawDown()`, `maxRelDrawDown()` - Maximum absolute/relative drawdown
- `maxDrawUp()`, `maxRelDrawUp()` - Maximum absolute/relative drawup
- `Kahan` - Kahan summation for numerical stability
- `SmoothedAccum` - Exponential smoothing accumulator
- `exp_factor()` - EMA-style smoothing factor (2/(n+1))
- `wilders_factor()` - Wilder's smoothing factor (1/n)

### Changed

- Test suite expanded from 163 to 409 tests
- All statistical functions use Kahan summation for numerical accuracy
- Consistent API design across online and rolling statistics

### Technical Notes

- Most rolling statistics maintain O(1) time complexity per update
- Rank-based statistics (median, quantile) use O(n) QuickSelect algorithm
- Circular buffer used for efficient fixed-window operations
- Welford's online algorithm for numerically stable variance calculations
- Support for both observation-based and exponentially-weighted statistics
- Configurable degrees of freedom (ddof) for variance calculations

## [1.1.1] - 2025-11-14

### Changed

- Updated exports in `src/index.ts` to use explicit named exports
  - Improves agent lookup and IDE auto-completion experience
  - No functional changes to the API

## [1.1.0] - 2025-11-10

### Changed

**Order Types:**

- Updated `Order.created` field to be optional (`created?: Date`)
  - Clarifies that this represents intent time, not audit time
  - Actual effective timing for audit purposes comes from `OrderState.modified`
  - Users can choose whether to record the intent creation time or not

**Portfolio Utilities:**

- Exported `getOrSetPosition()` function
  - Previously internal utility now available for external use
  - Gets existing position or creates new one if not found
  - Added JSDoc documentation for clarity
- Added `getAllSymbols()` function
  - Returns all symbols in portfolio organized by currency
  - Efficiently collects symbols from both long and short positions
  - Avoids duplicates when same symbol exists in both directions
  - Returns Map<currency, string[]> following TypeScript conventions

### Added

**Order Types:**

- `REJECT` status to `OrderStatus` type
  - Represents orders rejected by the system or exchange
  - Non-breaking change to existing order status union type

**Position Management:**

- `disableLot` parameter for providers without lot-level accounting support
  - Added to `openLong()` and `openShort()` functions
  - When enabled, maintains single merged lot instead of tracking separate lots
  - Fully backward-compatible (default: `false`)

**Market Data:**

- `preClose` property to `MarketQuote` interface
  - Represents the previous closing price for comparison with current price
  - Optional field to support price change calculations
  - Non-breaking change to existing interface
- `totalVolume` property to `MarketQuote` interface
  - Represents total traded volume for the session (cumulative)
  - Distinguishes from `volume` which represents last trade volume
  - Supports data providers with different volume reporting semantics
  - Non-breaking change to existing interface

**Market Utilities:**

- `updateSnapshotQuote()` - Updates MarketSnapshot with new MarketQuote using LOCF
  - Updates price for the symbol and ensures timestamp reflects most recent data
- `updateSnapshotBar()` - Updates MarketSnapshot with new MarketBar using close price
  - Updates price with bar's close price and ensures timestamp reflects most recent data
- `calculateUnrealisedPnL()` - Alias for `calculateUnrealizedPnL()` using British/AU spelling
  - Provides API consistency with interface field naming (`realisedPnL`)
  - Both spellings now available for user preference

**Documentation:**

- `amendLongPositionLot()` - JSDoc for merging long position lots
- `amendShortPositionLot()` - JSDoc for merging short position lots

**Corporate Actions:**

- `disableLot` support for all corporate action functions:
  - `handleHardFork()`, `handleAirdrop()`, `handleTokenSwap()`, `handleStakingReward()`
  - `handleSpinoff()`, `handleMerger()`

**Testing:**

- 8 new tests for `disableLot` functionality
- 8 new tests for `getAllSymbols()` functionality
- 163 total tests with comprehensive coverage

## [1.0.0] - 2025-11-08

### Added

**Core Data Structures:**

- `Order`, `OrderState`, `Fill` - Trading intent and execution records
- `Position` - Lot-based position tracking with FIFO/LIFO accounting
- `LongPosition`, `ShortPosition` - Support for both long and short positions
- `Portfolio` - Multi-currency portfolio management
- `Asset` - Asset metadata with validity periods
- `Universe` - Collection of tradable assets with filtering capabilities
- `MarketSnapshot`, `MarketQuote`, `MarketBar` - Market data representations

**Position Utilities:**

- `openLong()`, `closeLong()` - Long position management with lot-level tracking
- `openShort()`, `closeShort()` - Short position management
- `validatePosition()` - Position integrity validation
- `getAverageCost()`, `getAverageProceeds()` - Average price calculations

**Portfolio Utilities:**

- Portfolio creation and management (`pu.create()`, `pu.createPosition()`)
- Portfolio-level trading operations
- Position and cash queries
- Multi-currency support

**Market Utilities:**

- `createUniverse()` - Universe creation with filtering
- `appraisePosition()`, `appraisePortfolio()` - Portfolio valuation
- `calculateUnrealizedPnL()` - Unrealized profit/loss calculation
- `isAssetValidAt()` - Asset validity checks

**Order Validation:**

- `validateOrder()` - Comprehensive order validation
- Cash availability checks
- Position existence validation
- Price direction validation for stop orders
- Structured error reporting

**Fill Processing:**

- `applyFill()`, `applyFills()` - Fill application to positions
- Support for partial fills
- Realized P&L calculation

**Corporate Actions:**

- Stock splits, cash dividends, spinoffs, mergers
- Crypto hard forks, airdrops, token swaps, staking rewards

**Testing:**

- 147 tests with 90.98% code coverage
- Comprehensive test suite for all major utilities

**Documentation:**

- Complete README with quick start guide
- API reference documentation
- JSDoc comments throughout codebase

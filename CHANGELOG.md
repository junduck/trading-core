# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

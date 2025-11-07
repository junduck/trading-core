# Test Plan: portfolio.utils.ts

## Functions to Test

1. `create()` - Create portfolio
2. `hasAsset()` - Check if asset exists
3. `getPosition()`, `getCash()`, `getCurrencies()` - Getters
4. `openLong()`, `closeLong()` - Long position operations
5. `openShort()`, `closeShort()` - Short position operations
6. Stock corporate actions: `handleSplit()`, `handleCashDividend()`, `handleSpinoff()`, `handleMerger()`
7. Crypto events: `handleHardFork()`, `handleAirdrop()`, `handleTokenSwap()`, `handleStakingReward()`

---

## 1. create()

| Test Case | Parameters | Expected Result |
|-----------|------------|-----------------|
| Create basic portfolio | id="P1", name="Test" | Portfolio with empty positions, modified=now |
| Create with positions | id="P1", name="Test", positions map | Portfolio with provided positions |
| Create with timestamps | All params including dates | Portfolio with provided dates |

---

## 2. hasAsset() and Getters

### Setup
- Portfolio with USD position: cash=10000, AAPL long 100
- Portfolio with EUR position: cash=5000

| Function | Parameters | Expected Result |
|----------|------------|-----------------|
| hasAsset() | Asset(AAPL, USD) | true |
| hasAsset() | Asset(TSLA, USD) | false |
| hasAsset() | Asset(BTC, EUR) | false |
| getPosition() | "USD" | Position object with cash=10000 |
| getPosition() | "JPY" | undefined |
| getCash() | "USD" | 10000 |
| getCash() | "JPY" | 0 |
| getCurrencies() | - | ["USD", "EUR"] |

---

## 3. openLong() - Initialize and Mutate

| Action | Asset | Price | Qty | Commission | Expected Cash | Expected Position | Notes |
|--------|-------|-------|-----|------------|---------------|-------------------|-------|
| Open on new currency | AAPL (USD) | 100 | 10 | 100 | -1100 | long qty=10, cost=1100, avg=110 | Creates USD position |
| Open on existing | AAPL (USD) | 120 | 5 | 120 | -1100-720=-1820 | long qty=15, cost=1820, avg=121.33 | Adds to position |

**Verify**: portfolio.modified is updated

---

## 4. closeLong()

### Setup
- Portfolio with USD position: cash=10000
- Open AAPL: price=100, qty=10, commission=100

| Action | Price | Qty | Commission | Strategy | Expected Cash | Expected PnL | Notes |
|--------|-------|-----|------------|----------|---------------|--------------|-------|
| Close partial | 150 | 5 | 150 | FIFO | 10000-1100+750-150=9500 | Realized gain | 5 shares remain |
| Close error | 150 | 5 | 150 | FIFO | Error | - | No EUR position exists |

**Verify**: portfolio.modified is updated, throws error for missing position

---

## 5. openShort() and closeShort()

| Action | Asset | Price | Qty | Commission | Expected Proceeds/Cost | Notes |
|--------|-------|-------|-----|------------|----------------------|-------|
| Open short (new) | TSLA (USD) | 200 | 10 | 200 | +1800 proceeds | Creates position if needed |
| Close short | TSLA (USD) | 180 | 10 | 180 | -1980 cost to cover | Closes position |

**Verify**: portfolio.modified is updated

---

## 6. Stock Corporate Actions

### Setup for each test
- Portfolio with USD position: cash=10000
- Open AAPL long: price=100, qty=10, commission=100

| Function | Parameters | Expected Outcome | Verify |
|----------|------------|------------------|--------|
| handleSplit() | AAPL, ratio=2 | qty=20, avgCost=55 | Split 2-for-1, modified updated |
| handleCashDividend() | AAPL, $5/share, tax=0.5 | cash += 10*5*0.5 = +25 | Returns cashFlow=25, modified updated |
| handleSpinoff() | AAPL, "NEWCO", ratio=0.5 | AAPL qty=10, NEWCO qty=5 created | Creates new position, modified updated |
| handleMerger() | AAPL, "MERGED", ratio=2, cash=10 | AAPL removed, MERGED qty=20, cash+=100 | Converts position, modified updated |

**No-op test**: Call on portfolio without the asset position - should return early without error

---

## 7. Crypto Events

### Setup for each test
- Portfolio with USD position: cash=1000
- Open BTC long: price=50000, qty=2, commission=50000

| Function | Parameters | Expected Outcome | Verify |
|----------|------------|------------------|--------|
| handleHardFork() | BTC, "BCH", ratio=1 | BTC qty=2, BCH qty=2 created | Fork creates new asset, modified updated |
| handleAirdrop() (holder-based) | USD, "BTC", "AIRDROP", 100/token | BTC qty=2, AIRDROP qty=200 | Based on BTC holdings, modified updated |
| handleAirdrop() (fixed) | USD, null, "AIRDROP", 0, 500 | AIRDROP qty=500 | Fixed airdrop, creates position if needed |
| handleTokenSwap() | BTC, "WBTC", ratio=1 | BTC removed, WBTC qty=2 created | Token migration, modified updated |
| handleStakingReward() | BTC, 0.05/token | BTC qty increases by 0.1 | Returns 0.1, modified updated |

**No-op test**: Call on portfolio without the asset position - should return early without error (except airdrop with fixed amount)

---

## Notes

- Commission values: Use lot price as commission (e.g., if price=100, commission=100)
- Ratios: Use 0.5, 1, or 2 for easier manual review
- Tax rates: Use 0.5 for easier calculation
- Verify portfolio.modified timestamp is updated for all mutating operations
- Test position initialization when operating on new currency

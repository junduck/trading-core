# Test Plan: market.utils.ts

## Functions to Test

1. `isAssetValidAt()` - Check asset validity at timestamp
2. `createUniverse()` - Create universe with filtering capabilities
3. `appraisePosition()` - Calculate position value
4. `appraisePortfolio()` - Calculate portfolio value across currencies

---

## 1. isAssetValidAt()

| Test Case | Asset validFrom | Asset validUntil | Check Timestamp | Expected |
|-----------|----------------|------------------|-----------------|----------|
| Valid asset (no bounds) | null | null | 2024-01-01 | true |
| Valid in range | 2024-01-01 | 2024-12-31 | 2024-06-01 | true |
| Before validFrom | 2024-06-01 | null | 2024-01-01 | false |
| After validUntil | null | 2024-06-01 | 2024-12-31 | false |
| On validFrom boundary | 2024-06-01 | null | 2024-06-01 | true |
| On validUntil boundary | null | 2024-06-01 | 2024-06-01 | true |

---

## 2. createUniverse()

### Setup
- Asset 1: AAPL, type=stock, exchange=NASDAQ, currency=USD, validFrom=2024-01-01, validUntil=null
- Asset 2: TSLA, type=stock, exchange=NASDAQ, currency=USD, validFrom=null, validUntil=null
- Asset 3: BTC, type=crypto, exchange=COINBASE, currency=USD, validFrom=null, validUntil=null
- Asset 4: DELISTED, type=stock, exchange=NYSE, currency=USD, validFrom=2020-01-01, validUntil=2023-12-31

### Test Cases

| Method | Parameters | Expected Result |
|--------|------------|-----------------|
| getSymbols() | - | ["AAPL", "TSLA", "BTC", "DELISTED"] |
| getType() | "AAPL" | "stock" |
| getType() | "NOTEXIST" | "" |
| getExchange() | "BTC" | "COINBASE" |
| getCurrency() | "TSLA" | "USD" |
| filterByType() | "stock" | [AAPL, TSLA, DELISTED] or [AAPL, TSLA] if universe has timestamp |
| filterByExchange() | "NASDAQ" | [AAPL, TSLA] or [AAPL] if universe has timestamp |
| filterByCurrency() | "USD" | [AAPL, TSLA, BTC, DELISTED] or valid subset |
| getValidAssets() | 2024-06-01 | Map with AAPL, TSLA, BTC (not DELISTED) |
| isAssetValid() | "AAPL", 2024-06-01 | true |
| isAssetValid() | "DELISTED", 2024-06-01 | false |

---

## 3. appraisePosition()

### Test Cases

| Position State | Snapshot Prices | Expected Value |
|----------------|-----------------|----------------|
| Cash: 10000, no holdings | - | 10000 |
| Cash: 10000, AAPL long 100 | AAPL=150 | 10000 + 100*150 = 25000 |
| Cash: 10000, AAPL short 100 | AAPL=150 | 10000 - 100*150 = -5000 |
| Cash: 10000, AAPL long 100, TSLA short 50 | AAPL=150, TSLA=200 | 10000 + 15000 - 10000 = 15000 |
| Position with missing price | AAPL long 100, no price | cash only (price=0) |

---

## 4. appraisePortfolio()

### Test Cases

| Portfolio Positions | Snapshot Prices | Expected Result |
|---------------------|-----------------|-----------------|
| USD: cash=10000 | - | Map { "USD" => 10000 } |
| USD: cash=10000, AAPL long 100 | AAPL=150 | Map { "USD" => 25000 } |
| USD: 15000, EUR: 8000 | - | Map { "USD" => 15000, "EUR" => 8000 } |
| USD: cash=10000 + AAPL long 100, EUR: cash=5000 + BTC long 2 | AAPL=150, BTC=30000 | Map { "USD" => 25000, "EUR" => 65000 } |

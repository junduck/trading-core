[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / MarketBar

# Interface: MarketBar

Defined in: [types/market.ts:140](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L140)

OHLCV (Open-High-Low-Close-Volume) bar data for a specific time interval.
Represents aggregated trading data over a period.

## Properties

### close

> **close**: `number`

Defined in: [types/market.ts:154](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L154)

Closing price at the end of the interval

***

### high

> **high**: `number`

Defined in: [types/market.ts:148](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L148)

Highest price during the interval

***

### interval

> **interval**: [`MarketBarInterval`](../type-aliases/MarketBarInterval.md)

Defined in: [types/market.ts:163](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L163)

Time interval this bar represents

***

### low

> **low**: `number`

Defined in: [types/market.ts:151](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L151)

Lowest price during the interval

***

### open

> **open**: `number`

Defined in: [types/market.ts:145](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L145)

Opening price at the start of the interval

***

### symbol

> **symbol**: `string`

Defined in: [types/market.ts:142](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L142)

Symbol of the asset

***

### timestamp

> **timestamp**: `Date`

Defined in: [types/market.ts:160](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L160)

Timestamp marking the end of the interval

***

### volume

> **volume**: `number`

Defined in: [types/market.ts:157](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L157)

Total trading volume during the interval

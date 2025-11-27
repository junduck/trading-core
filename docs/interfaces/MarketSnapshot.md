[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / MarketSnapshot

# Interface: MarketSnapshot

Defined in: [types/market.ts:75](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L75)

Represents a snapshot of market prices at a specific point in time.
Used for portfolio valuation and backtesting.

## Properties

### price

> **price**: `Map`\<`string`, `number`\>

Defined in: [types/market.ts:77](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L77)

Map of asset symbols to their current prices

***

### timestamp

> **timestamp**: `Date`

Defined in: [types/market.ts:80](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L80)

Timestamp when this snapshot was captured

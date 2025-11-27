[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / MarketQuote

# Interface: MarketQuote

Defined in: [types/market.ts:87](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L87)

Represent a market quote data for a specific time.

## Properties

### ask?

> `optional` **ask**: `number`

Defined in: [types/market.ts:110](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L110)

Best ask price (lowest sell order)

***

### askVol?

> `optional` **askVol**: `number`

Defined in: [types/market.ts:113](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L113)

Volume available at the ask price

***

### bid?

> `optional` **bid**: `number`

Defined in: [types/market.ts:104](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L104)

Best bid price (highest buy order)

***

### bidVol?

> `optional` **bidVol**: `number`

Defined in: [types/market.ts:107](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L107)

Volume available at the bid price

***

### preClose?

> `optional` **preClose**: `number`

Defined in: [types/market.ts:116](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L116)

Previous close price

***

### price

> **price**: `number`

Defined in: [types/market.ts:92](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L92)

Last traded price

***

### symbol

> **symbol**: `string`

Defined in: [types/market.ts:89](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L89)

Symbol of the asset this quote refers to

***

### timestamp

> **timestamp**: `Date`

Defined in: [types/market.ts:101](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L101)

Timestamp when this quote was generated

***

### totalVolume?

> `optional` **totalVolume**: `number`

Defined in: [types/market.ts:98](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L98)

Total traded volume

***

### volume?

> `optional` **volume**: `number`

Defined in: [types/market.ts:95](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/market.ts#L95)

Last traded volume

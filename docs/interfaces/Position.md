[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / Position

# Interface: Position

Defined in: [types/position.ts:82](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L82)

Represents a currency account within a portfolio.
Groups all assets, cash, and P&L for a specific currency.

## Properties

### cash

> **cash**: `number`

Defined in: [types/position.ts:84](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L84)

Cash balance in this currency

***

### long?

> `optional` **long**: `Map`\<`string`, [`LongPosition`](LongPosition.md)\>

Defined in: [types/position.ts:87](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L87)

Long positions in assets denominated in this currency

***

### modified

> **modified**: `Date`

Defined in: [types/position.ts:99](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L99)

Timestamp when this position was last modified

***

### realisedPnL

> **realisedPnL**: `number`

Defined in: [types/position.ts:96](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L96)

Total realised profit and loss in this currency

***

### short?

> `optional` **short**: `Map`\<`string`, [`ShortPosition`](ShortPosition.md)\>

Defined in: [types/position.ts:90](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L90)

Short positions in assets denominated in this currency

***

### totalCommission

> **totalCommission**: `number`

Defined in: [types/position.ts:93](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L93)

Total commission paid in this currency

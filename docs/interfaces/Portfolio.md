[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / Portfolio

# Interface: Portfolio

Defined in: [types/portfolio.ts:8](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/portfolio.ts#L8)

Represents a trading portfolio for tracking assets and positions in SPOT markets.
Pure data structure containing cash balances, positions, and profit/loss tracking.

## Properties

### id

> `readonly` **id**: `string`

Defined in: [types/portfolio.ts:10](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/portfolio.ts#L10)

Unique identifier for the portfolio

***

### modified

> **modified**: `Date`

Defined in: [types/portfolio.ts:19](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/portfolio.ts#L19)

Timestamp when the portfolio was last modified

***

### name

> `readonly` **name**: `string`

Defined in: [types/portfolio.ts:13](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/portfolio.ts#L13)

Human-readable name for the portfolio

***

### positions

> **positions**: `Map`\<`string`, [`Position`](Position.md)\>

Defined in: [types/portfolio.ts:16](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/portfolio.ts#L16)

Map of currency code to Position (e.g., "USD" -> Position)

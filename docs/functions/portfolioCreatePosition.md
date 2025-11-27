[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / portfolioCreatePosition

# Function: portfolioCreatePosition()

> **portfolioCreatePosition**(`portfolio`, `currency`, `initialCash`, `time?`): `void`

Defined in: [utils/portfolio.utils.ts:129](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/portfolio.utils.ts#L129)

Creates a new position in the portfolio with initial cash.

## Parameters

### portfolio

[`Portfolio`](../interfaces/Portfolio.md)

The portfolio to modify

### currency

`string`

The currency code for the new position

### initialCash

`number` = `0`

Initial cash balance (default: 0)

### time?

`Date`

Optional creation timestamp (defaults to current date)

## Returns

`void`

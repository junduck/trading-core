[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / create

# Function: create()

> **create**(`id`, `name`, `positions?`, `modified?`): [`Portfolio`](../interfaces/Portfolio.md)

Defined in: [utils/portfolio.utils.ts:18](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/portfolio.utils.ts#L18)

Creates a new Portfolio data structure.

## Parameters

### id

`string`

Unique identifier for the portfolio

### name

`string`

Human-readable name for the portfolio

### positions?

`Map`\<`string`, [`Position`](../interfaces/Position.md)\>

Optional initial positions map

### modified?

`Date`

Optional modification timestamp (defaults to current date)

## Returns

[`Portfolio`](../interfaces/Portfolio.md)

A new Portfolio instance

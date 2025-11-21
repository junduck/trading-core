[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / create

# Function: create()

> **create**(`id`, `name`, `positions?`, `modified?`): [`Portfolio`](../interfaces/Portfolio.md)

Defined in: [utils/portfolio.utils.ts:18](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/portfolio.utils.ts#L18)

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

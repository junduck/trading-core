[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / getOrSetPosition

# Function: getOrSetPosition()

> **getOrSetPosition**(`portfolio`, `currency`, `time?`): [`Position`](../interfaces/Position.md)

Defined in: [utils/portfolio.utils.ts:148](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/portfolio.utils.ts#L148)

Gets an existing position or creates a new one if it doesn't exist.

## Parameters

### portfolio

[`Portfolio`](../interfaces/Portfolio.md)

The portfolio to query or modify

### currency

`string`

The currency code for the position

### time?

`Date`

Optional timestamp for new position creation (defaults to current date)

## Returns

[`Position`](../interfaces/Position.md)

The existing or newly created Position

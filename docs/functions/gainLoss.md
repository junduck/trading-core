[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / gainLoss

# Function: gainLoss()

> **gainLoss**(`returns`, `threshold`): `number`

Defined in: [numeric/metrics.ts:100](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/metrics.ts#L100)

Computes gain/loss ratio: average_gain / average_loss.

## Parameters

### returns

`number`[]

Array of period returns

### threshold

`number` = `0`

Returns above this are gains, below are losses (default: 0)

## Returns

`number`

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / expectancy

# Function: expectancy()

> **expectancy**(`returns`, `threshold`): `number`

Defined in: [numeric/metrics.ts:118](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/metrics.ts#L118)

Computes expectancy: (win_rate × avg_gain) - (loss_rate × avg_loss).

## Parameters

### returns

`number`[]

Array of period returns

### threshold

`number` = `0`

Returns above this are gains, below are losses (default: 0)

## Returns

`number`

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / profitFactor

# Function: profitFactor()

> **profitFactor**(`returns`, `threshold`): `number`

Defined in: [numeric/metrics.ts:143](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/metrics.ts#L143)

Computes profit factor: sum_of_gains / sum_of_losses.

## Parameters

### returns

`number`[]

Array of period returns

### threshold

`number` = `0`

Returns above this are gains, below are losses (default: 0)

## Returns

`number`

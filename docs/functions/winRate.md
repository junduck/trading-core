[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / winRate

# Function: winRate()

> **winRate**(`returns`, `threshold`): `number`

Defined in: [numeric/metrics.ts:87](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/metrics.ts#L87)

Computes win rate (hit ratio): percentage of returns above threshold.

## Parameters

### returns

`number`[]

Array of period returns

### threshold

`number` = `0`

Returns above this are considered wins (default: 0)

## Returns

`number`

Win rate in [0, 1]

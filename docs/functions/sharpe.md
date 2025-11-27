[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / sharpe

# Function: sharpe()

> **sharpe**(`returns`, `riskfree`): `number`

Defined in: [numeric/metrics.ts:8](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/metrics.ts#L8)

Computes Sharpe ratio: (mean_return - riskfree) / stddev_return
Uses sample standard deviation (ddof=1) per industry convention.

## Parameters

### returns

`number`[]

Array of period returns

### riskfree

`number` = `0`

Risk-free rate per period (default: 0)

## Returns

`number`

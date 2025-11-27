[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / expWeightedCVaR

# Function: expWeightedCVaR()

> **expWeightedCVaR**(`ret`, `alpha`, `lambda`): `number`

Defined in: [numeric/CVaR.ts:60](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/CVaR.ts#L60)

Exponentially weighted CVaR.
Windowed weights over all observations (newest = highest), NOT infinite-window EMA.
Ensures reproducible regulatory calculations.

## Parameters

### ret

`number`[]

Array of returns (oldest first)

### alpha

`number` = `0.05`

Confidence level (0.05 = 5% worst cases)

### lambda

`number` = `0.996`

Decay factor (0.996 for RiskMetrics daily)

## Returns

`number`

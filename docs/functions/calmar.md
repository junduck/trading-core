[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / calmar

# Function: calmar()

> **calmar**(`returns`, `periodsPerYear`): `number`

Defined in: [numeric/metrics.ts:55](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/metrics.ts#L55)

Computes Calmar ratio: annualized_return / max_drawdown.
Measures return relative to worst drawdown.

## Parameters

### returns

`number`[]

Array of period returns

### periodsPerYear

`number`

Number of periods per year for annualization (e.g., 252 for daily, 12 for monthly)

## Returns

`number`

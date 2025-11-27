[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / historicalCVaR

# Function: historicalCVaR()

> **historicalCVaR**(`ret`, `alpha`): `number`

Defined in: [numeric/CVaR.ts:12](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/CVaR.ts#L12)

Historical CVaR (Conditional Value at Risk).
Mean of returns at or below the α-quantile.

## Parameters

### ret

`number`[]

Array of returns

### alpha

`number` = `0.05`

Confidence level (0.05 = 5% worst cases)

## Returns

`number`

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / parametricCVaR

# Function: parametricCVaR()

> **parametricCVaR**(`ret`, `alpha`): `number`

Defined in: [numeric/CVaR.ts:34](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/CVaR.ts#L34)

Parametric CVaR under normal distribution.
Formula: CVaR = μ - σ·φ(z)/α where z = Φ⁻¹(α)

## Parameters

### ret

`number`[]

Array of returns

### alpha

`number` = `0.05`

Confidence level (0.05 = 5% worst cases)

## Returns

`number`

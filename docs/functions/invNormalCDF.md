[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / invNormalCDF

# Function: invNormalCDF()

> **invNormalCDF**(`p`): `number`

Defined in: [numeric/utils.ts:174](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/utils.ts#L174)

Inverse standard normal CDF (quantile function).
Acklam's algorithm for Φ⁻¹(p).

## Parameters

### p

`number`

Probability (0 < p < 1)

## Returns

`number`

z-score such that Φ(z) = p

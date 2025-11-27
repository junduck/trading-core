[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / winsorize

# Function: winsorize()

> **winsorize**(`x`, `opts?`): `number`[]

Defined in: [numeric/series.ts:160](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/series.ts#L160)

Winsorize series by clamping extreme values at specified quantiles.

## Parameters

### x

`number`[]

### opts?

#### lower?

`number`

Lower quantile in [0, 1], default 0.05

#### upper?

`number`

Upper quantile in [0, 1], default 0.95

## Returns

`number`[]

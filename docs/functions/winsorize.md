[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / winsorize

# Function: winsorize()

> **winsorize**(`x`, `opts?`): `number`[]

Defined in: [numeric/series.ts:160](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/numeric/series.ts#L160)

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

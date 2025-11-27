[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / exp\_factor

# Function: exp\_factor()

> **exp\_factor**(`period`): `number`

Defined in: [numeric/accum.ts:70](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/accum.ts#L70)

Converts period to exponential smoothing factor (EMA-style).

## Parameters

### period

`number`

Smoothing period

## Returns

`number`

Smoothing factor: 2/(period+1)

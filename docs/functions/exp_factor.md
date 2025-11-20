[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / exp\_factor

# Function: exp\_factor()

> **exp\_factor**(`period`): `number`

Defined in: [utils/accum.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/accum.ts#L70)

Converts period to exponential smoothing factor (EMA-style).

## Parameters

### period

`number`

Smoothing period

## Returns

`number`

Smoothing factor: 2/(period+1)

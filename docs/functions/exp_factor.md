[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / exp\_factor

# Function: exp\_factor()

> **exp\_factor**(`period`): `number`

Defined in: [utils/accum.ts:70](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/accum.ts#L70)

Converts period to exponential smoothing factor (EMA-style).

## Parameters

### period

`number`

Smoothing period

## Returns

`number`

Smoothing factor: 2/(period+1)

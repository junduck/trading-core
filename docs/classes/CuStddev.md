[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / CuStddev

# Class: CuStddev

Defined in: [online/stats.ts:40](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L40)

O(1) cumulative standard deviation.

## Constructors

### Constructor

> **new CuStddev**(`opts?`): `CuStddev`

Defined in: [online/stats.ts:46](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L46)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuStddev`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [online/stats.ts:50](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L50)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

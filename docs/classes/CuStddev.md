[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / CuStddev

# Class: CuStddev

Defined in: [online/stats.ts:40](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L40)

O(1) cumulative standard deviation.

## Constructors

### Constructor

> **new CuStddev**(`opts?`): `CuStddev`

Defined in: [online/stats.ts:46](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L46)

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

Defined in: [online/stats.ts:50](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L50)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / CuCorr

# Class: CuCorr

Defined in: [online/stats.ts:98](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L98)

O(1) cumulative correlation between two series.

## Constructors

### Constructor

> **new CuCorr**(`opts?`): `CuCorr`

Defined in: [online/stats.ts:110](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L110)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuCorr`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [online/stats.ts:114](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L114)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### corr

> **corr**: `number`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

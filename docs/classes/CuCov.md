[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / CuCov

# Class: CuCov

Defined in: [online/stats.ts:60](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L60)

O(1) cumulative covariance between two series.

## Constructors

### Constructor

> **new CuCov**(`opts?`): `CuCov`

Defined in: [online/stats.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L70)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuCov`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [online/stats.ts:74](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/online/stats.ts#L74)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

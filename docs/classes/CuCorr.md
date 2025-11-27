[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CuCorr

# Class: CuCorr

Defined in: [online/stats.ts:111](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L111)

O(1) cumulative correlation between two series.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [online/stats.ts:120](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L120)

##### Returns

`object`

###### corr

> **corr**: `number`

###### cov

> **cov**: `number`

###### meanX

> **meanX**: `number`

###### meanY

> **meanY**: `number`

## Constructors

### Constructor

> **new CuCorr**(`opts?`): `CuCorr`

Defined in: [online/stats.ts:141](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L141)

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

Defined in: [online/stats.ts:145](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L145)

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

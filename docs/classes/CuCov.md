[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CuCov

# Class: CuCov

Defined in: [online/stats.ts:69](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L69)

O(1) cumulative covariance between two series.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [online/stats.ts:76](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L76)

##### Returns

`object`

###### cov

> **cov**: `number`

###### meanX

> **meanX**: `number`

###### meanY

> **meanY**: `number`

## Constructors

### Constructor

> **new CuCov**(`opts?`): `CuCov`

Defined in: [online/stats.ts:90](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L90)

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

Defined in: [online/stats.ts:94](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L94)

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

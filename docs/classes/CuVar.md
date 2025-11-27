[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CuVar

# Class: CuVar

Defined in: [online/stats.ts:7](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L7)

O(1) cumulative variance using Welford's online algorithm.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [online/stats.ts:13](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L13)

##### Returns

`object`

###### mean

> **mean**: `number`

###### variance

> **variance**: `number`

## Constructors

### Constructor

> **new CuVar**(`opts?`): `CuVar`

Defined in: [online/stats.ts:26](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L26)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuVar`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [online/stats.ts:30](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L30)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### variance

> **variance**: `number`

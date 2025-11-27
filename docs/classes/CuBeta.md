[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CuBeta

# Class: CuBeta

Defined in: [online/stats.ts:168](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L168)

O(1) cumulative beta coefficient (regression slope).

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [online/stats.ts:176](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L176)

##### Returns

`object`

###### beta

> **beta**: `number`

###### cov

> **cov**: `number`

###### meanX

> **meanX**: `number`

###### meanY

> **meanY**: `number`

## Constructors

### Constructor

> **new CuBeta**(`opts?`): `CuBeta`

Defined in: [online/stats.ts:192](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L192)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuBeta`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [online/stats.ts:196](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L196)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### beta

> **beta**: `number`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

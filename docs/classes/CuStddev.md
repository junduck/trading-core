[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CuStddev

# Class: CuStddev

Defined in: [online/stats.ts:44](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L44)

O(1) cumulative standard deviation.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [online/stats.ts:47](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L47)

##### Returns

`object`

###### mean

> **mean**: `number`

###### stddev

> **stddev**: `number`

## Constructors

### Constructor

> **new CuStddev**(`opts?`): `CuStddev`

Defined in: [online/stats.ts:55](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L55)

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

Defined in: [online/stats.ts:59](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/stats.ts#L59)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

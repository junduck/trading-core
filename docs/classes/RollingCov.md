[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingCov

# Class: RollingCov

Defined in: [rolling/stats.ts:225](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L225)

O(1) rolling covariance between two series.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:235](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L235)

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

> **new RollingCov**(`opts`): `RollingCov`

Defined in: [rolling/stats.ts:257](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L257)

#### Parameters

##### opts

###### ddof?

`number`

Delta degrees of freedom (default: 0)

###### period

`number`

Window size

#### Returns

`RollingCov`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:268](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L268)

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

## Properties

### bufferX

> `readonly` **bufferX**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:226](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L226)

***

### bufferY

> `readonly` **bufferY**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:227](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L227)

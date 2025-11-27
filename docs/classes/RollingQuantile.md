[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingQuantile

# Class: RollingQuantile

Defined in: [rolling/rank.ts:62](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L62)

Rolling quantile calculator. O(n·log(k)) per update where k is number of quantiles.
Returns undefined if window is not full.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`[] \| `undefined`

Defined in: [rolling/rank.ts:68](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L68)

##### Returns

`number`[] \| `undefined`

## Constructors

### Constructor

> **new RollingQuantile**(`opts`): `RollingQuantile`

Defined in: [rolling/rank.ts:75](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L75)

#### Parameters

##### opts

###### period

`number`

###### quantiles

`number`[]

#### Returns

`RollingQuantile`

## Methods

### update()

> **update**(`x`): `number`[] \| `undefined`

Defined in: [rolling/rank.ts:87](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L87)

#### Parameters

##### x

`number`

#### Returns

`number`[] \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/rank.ts:63](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L63)

***

### queue

> `readonly` **queue**: `number`[]

Defined in: [rolling/rank.ts:64](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L64)

***

### sortedIndices

> `readonly` **sortedIndices**: `object`[]

Defined in: [rolling/rank.ts:65](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L65)

#### outIdx

> **outIdx**: `number`

#### qidx

> **qidx**: `number`

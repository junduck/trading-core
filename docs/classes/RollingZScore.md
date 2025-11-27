[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingZScore

# Class: RollingZScore

Defined in: [rolling/stats.ts:169](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L169)

O(1) rolling z-score calculator.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:174](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L174)

##### Returns

`object`

###### mean

> **mean**: `number`

###### stddev

> **stddev**: `number`

###### zscore

> **zscore**: `number`

## Constructors

### Constructor

> **new RollingZScore**(`opts`): `RollingZScore`

Defined in: [rolling/stats.ts:179](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L179)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingZScore`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:184](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L184)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

##### zscore

> **zscore**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:171](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L171)

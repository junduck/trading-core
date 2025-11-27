[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMedian

# Class: RollingMedian

Defined in: [rolling/rank.ts:10](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L10)

Rolling median calculator. O(n) per update using QuickSelect.
For even periods, returns the average of the two middle elements.
Returns undefined if window is not full.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number` \| `undefined`

Defined in: [rolling/rank.ts:17](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L17)

##### Returns

`number` \| `undefined`

## Constructors

### Constructor

> **new RollingMedian**(`opts`): `RollingMedian`

Defined in: [rolling/rank.ts:21](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L21)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMedian`

## Methods

### update()

> **update**(`x`): `number` \| `undefined`

Defined in: [rolling/rank.ts:28](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L28)

#### Parameters

##### x

`number`

#### Returns

`number` \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/rank.ts:11](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L11)

***

### queue

> `readonly` **queue**: `number`[]

Defined in: [rolling/rank.ts:12](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/rank.ts#L12)

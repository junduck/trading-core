[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMinMax

# Class: RollingMinMax

Defined in: [rolling/minmax.ts:85](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L85)

Rolling minimum and maximum over a sliding window.
O(1) amortized time per update.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/minmax.ts:90](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L90)

##### Returns

`object`

###### max

> **max**: `number`

###### min

> **min**: `number`

## Constructors

### Constructor

> **new RollingMinMax**(`opts`): `RollingMinMax`

Defined in: [rolling/minmax.ts:97](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L97)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMinMax`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:105](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L105)

#### Parameters

##### x

`number`

#### Returns

`object`

##### max

> **max**: `number`

##### min

> **min**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:86](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L86)

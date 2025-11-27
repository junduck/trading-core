[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingArgMinMax

# Class: RollingArgMinMax

Defined in: [rolling/minmax.ts:243](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L243)

Rolling minimum and maximum with position tracking over a sliding window.
Returns both min/max values and their indices within the window (0 = oldest).
O(1) amortized time per update.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/minmax.ts:250](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L250)

##### Returns

`object`

###### max

> **max**: `object`

###### max.pos

> **pos**: `number`

###### max.val

> **val**: `number`

###### min

> **min**: `object`

###### min.pos

> **pos**: `number`

###### min.val

> **val**: `number`

## Constructors

### Constructor

> **new RollingArgMinMax**(`opts`): `RollingArgMinMax`

Defined in: [rolling/minmax.ts:267](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L267)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingArgMinMax`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:276](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L276)

#### Parameters

##### x

`number`

#### Returns

`object`

##### max

> **max**: `object`

###### max.pos

> **pos**: `number`

###### max.val

> **val**: `number`

##### min

> **min**: `object`

###### min.pos

> **pos**: `number`

###### min.val

> **val**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:244](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L244)

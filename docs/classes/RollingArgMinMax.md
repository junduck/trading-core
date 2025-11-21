[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingArgMinMax

# Class: RollingArgMinMax

Defined in: [rolling/minmax.ts:212](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L212)

Rolling minimum and maximum with position tracking over a sliding window.
Returns both min/max values and their indices within the window (0 = oldest).
O(1) amortized time per update.

## Constructors

### Constructor

> **new RollingArgMinMax**(`opts`): `RollingArgMinMax`

Defined in: [rolling/minmax.ts:219](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L219)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingArgMinMax`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:228](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L228)

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

Defined in: [rolling/minmax.ts:213](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L213)

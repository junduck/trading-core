[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingArgMax

# Class: RollingArgMax

Defined in: [rolling/minmax.ts:169](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L169)

Rolling maximum with position tracking over a sliding window.
Returns both maximum value and its index within the window (0 = oldest).
O(1) amortized time per update.

## Constructors

### Constructor

> **new RollingArgMax**(`opts`): `RollingArgMax`

Defined in: [rolling/minmax.ts:175](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L175)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingArgMax`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:182](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L182)

#### Parameters

##### x

`number`

#### Returns

`object`

##### pos

> **pos**: `number`

##### val

> **val**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:170](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L170)

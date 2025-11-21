[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingArgMin

# Class: RollingArgMin

Defined in: [rolling/minmax.ts:126](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L126)

Rolling minimum with position tracking over a sliding window.
Returns both minimum value and its index within the window (0 = oldest).
O(1) amortized time per update.

## Constructors

### Constructor

> **new RollingArgMin**(`opts`): `RollingArgMin`

Defined in: [rolling/minmax.ts:132](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L132)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingArgMin`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:139](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L139)

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

Defined in: [rolling/minmax.ts:127](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L127)

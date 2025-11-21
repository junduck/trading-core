[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMax

# Class: RollingMax

Defined in: [rolling/minmax.ts:43](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L43)

Rolling maximum over a sliding window using monotonic deque.
O(1) amortized time per update.

## Constructors

### Constructor

> **new RollingMax**(`opts`): `RollingMax`

Defined in: [rolling/minmax.ts:47](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L47)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMax`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/minmax.ts:53](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L53)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:44](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L44)

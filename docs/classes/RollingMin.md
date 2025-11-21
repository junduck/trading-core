[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMin

# Class: RollingMin

Defined in: [rolling/minmax.ts:9](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L9)

Rolling minimum over a sliding window using monotonic deque.
O(1) amortized time per update.

## Constructors

### Constructor

> **new RollingMin**(`opts`): `RollingMin`

Defined in: [rolling/minmax.ts:13](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L13)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMin`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/minmax.ts:19](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L19)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:10](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L10)

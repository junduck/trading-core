[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMinMax

# Class: RollingMinMax

Defined in: [rolling/minmax.ts:77](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L77)

Rolling minimum and maximum over a sliding window.
O(1) amortized time per update.

## Constructors

### Constructor

> **new RollingMinMax**(`opts`): `RollingMinMax`

Defined in: [rolling/minmax.ts:82](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L82)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMinMax`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:90](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L90)

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

Defined in: [rolling/minmax.ts:78](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/minmax.ts#L78)

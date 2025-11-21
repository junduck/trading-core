[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / SMA

# Class: SMA

Defined in: [rolling/average.ts:32](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L32)

O(1) simple moving average (SMA) using circular buffer.

## Constructors

### Constructor

> **new SMA**(`opts`): `SMA`

Defined in: [rolling/average.ts:37](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L37)

#### Parameters

##### opts

###### period

`number`

#### Returns

`SMA`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:42](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L42)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/average.ts:33](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L33)

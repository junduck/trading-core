[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingSum

# Class: RollingSum

Defined in: [rolling/average.ts:8](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L8)

O(1) moving sum using circular buffer and Kahan summation.

## Constructors

### Constructor

> **new RollingSum**(`opts`): `RollingSum`

Defined in: [rolling/average.ts:12](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L12)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingSum`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:16](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L16)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/average.ts:9](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L9)

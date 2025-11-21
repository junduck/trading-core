[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingStddev

# Class: RollingStddev

Defined in: [rolling/stats.ts:95](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L95)

O(1) rolling standard deviation.

## Constructors

### Constructor

> **new RollingStddev**(`opts`): `RollingStddev`

Defined in: [rolling/stats.ts:103](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L103)

#### Parameters

##### opts

###### ddof?

`number`

Delta degrees of freedom (default: 0)

###### period

`number`

Window size

#### Returns

`RollingStddev`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:108](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L108)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:97](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L97)

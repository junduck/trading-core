[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingBeta

# Class: RollingBeta

Defined in: [rolling/stats.ts:363](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L363)

O(1) rolling beta coefficient (regression slope).

## Constructors

### Constructor

> **new RollingBeta**(`opts`): `RollingBeta`

Defined in: [rolling/stats.ts:378](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L378)

#### Parameters

##### opts

###### ddof?

`number`

Delta degrees of freedom (default: 0)

###### period

`number`

Window size

#### Returns

`RollingBeta`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:391](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L391)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### beta

> **beta**: `number`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

## Properties

### bufferX

> `readonly` **bufferX**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:364](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L364)

***

### bufferY

> `readonly` **bufferY**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:365](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L365)

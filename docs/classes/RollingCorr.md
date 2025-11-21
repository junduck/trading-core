[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingCorr

# Class: RollingCorr

Defined in: [rolling/stats.ts:254](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L254)

O(1) rolling correlation between two series.

## Constructors

### Constructor

> **new RollingCorr**(`opts`): `RollingCorr`

Defined in: [rolling/stats.ts:270](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L270)

#### Parameters

##### opts

###### ddof?

`number`

Delta degrees of freedom (default: 0)

###### period

`number`

Window size

#### Returns

`RollingCorr`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:284](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L284)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### corr

> **corr**: `number`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

## Properties

### bufferX

> `readonly` **bufferX**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:255](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L255)

***

### bufferY

> `readonly` **bufferY**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:256](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L256)

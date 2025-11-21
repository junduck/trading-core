[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingCov

# Class: RollingCov

Defined in: [rolling/stats.ts:181](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L181)

O(1) rolling covariance between two series.

## Constructors

### Constructor

> **new RollingCov**(`opts`): `RollingCov`

Defined in: [rolling/stats.ts:195](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L195)

#### Parameters

##### opts

###### ddof?

`number`

Delta degrees of freedom (default: 0)

###### period

`number`

Window size

#### Returns

`RollingCov`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:206](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L206)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

## Properties

### bufferX

> `readonly` **bufferX**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:182](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L182)

***

### bufferY

> `readonly` **bufferY**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:183](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L183)

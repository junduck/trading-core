[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingZScore

# Class: RollingZScore

Defined in: [rolling/stats.ts:139](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L139)

O(1) rolling z-score calculator.

## Constructors

### Constructor

> **new RollingZScore**(`opts`): `RollingZScore`

Defined in: [rolling/stats.ts:143](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L143)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingZScore`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:148](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L148)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

##### zscore

> **zscore**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:141](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L141)

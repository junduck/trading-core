[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingVar

# Class: RollingVar

Defined in: [rolling/stats.ts:8](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L8)

O(1) rolling variance using Welford's online algorithm.

## Constructors

### Constructor

> **new RollingVar**(`opts`): `RollingVar`

Defined in: [rolling/stats.ts:20](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L20)

#### Parameters

##### opts

###### ddof?

`number`

Delta degrees of freedom (default: 0)

###### period

`number`

Window size

#### Returns

`RollingVar`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:30](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L30)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### variance

> **variance**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/stats.ts:9](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L9)

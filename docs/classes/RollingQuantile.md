[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingQuantile

# Class: RollingQuantile

Defined in: [rolling/rank.ts:54](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L54)

Rolling quantile calculator. O(n·log(k)) per update where k is number of quantiles.
Returns undefined if window is not full.

## Constructors

### Constructor

> **new RollingQuantile**(`opts`): `RollingQuantile`

Defined in: [rolling/rank.ts:59](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L59)

#### Parameters

##### opts

###### period

`number`

###### quantiles

`number`[]

#### Returns

`RollingQuantile`

## Methods

### update()

> **update**(`x`): `number`[] \| `undefined`

Defined in: [rolling/rank.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L70)

#### Parameters

##### x

`number`

#### Returns

`number`[] \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/rank.ts:55](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L55)

***

### queue

> `readonly` **queue**: `number`[]

Defined in: [rolling/rank.ts:56](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L56)

***

### sortedIndices

> `readonly` **sortedIndices**: `object`[]

Defined in: [rolling/rank.ts:57](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L57)

#### outIdx

> **outIdx**: `number`

#### qidx

> **qidx**: `number`

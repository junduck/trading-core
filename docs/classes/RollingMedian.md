[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMedian

# Class: RollingMedian

Defined in: [rolling/rank.ts:10](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L10)

Rolling median calculator. O(n) per update using QuickSelect.
For even periods, returns the average of the two middle elements.
Returns undefined if window is not full.

## Constructors

### Constructor

> **new RollingMedian**(`opts`): `RollingMedian`

Defined in: [rolling/rank.ts:16](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L16)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMedian`

## Methods

### update()

> **update**(`x`): `number` \| `undefined`

Defined in: [rolling/rank.ts:23](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L23)

#### Parameters

##### x

`number`

#### Returns

`number` \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/rank.ts:11](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L11)

***

### queue

> `readonly` **queue**: `number`[]

Defined in: [rolling/rank.ts:12](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/rank.ts#L12)

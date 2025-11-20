[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / EWMA

# Class: EWMA

Defined in: [rolling/average.ts:91](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/average.ts#L91)

O(1) exponential weighted moving average with fixed window.
Combines exponential weighting with sliding window.

## Constructors

### Constructor

> **new EWMA**(`opts`): `EWMA`

Defined in: [rolling/average.ts:99](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/average.ts#L99)

#### Parameters

##### opts

###### period

`number`

#### Returns

`EWMA`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:106](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/average.ts#L106)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/average.ts:92](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/average.ts#L92)

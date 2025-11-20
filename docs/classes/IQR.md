[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / IQR

# Class: IQR

Defined in: [rolling/deviation.ts:86](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L86)

Rolling Interquartile Range (IQR).
IQR = Q3 - Q1 (75th percentile - 25th percentile)

## Constructors

### Constructor

> **new IQR**(`opts`): `IQR`

Defined in: [rolling/deviation.ts:92](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L92)

#### Parameters

##### opts

###### period

`number`

#### Returns

`IQR`

## Methods

### update()

> **update**(`x`): \{ `iqr`: `number`; `q1`: `number`; `q3`: `number`; \} \| `null`

Defined in: [rolling/deviation.ts:99](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L99)

#### Parameters

##### x

`number`

#### Returns

\{ `iqr`: `number`; `q1`: `number`; `q3`: `number`; \} \| `null`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/deviation.ts:87](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L87)

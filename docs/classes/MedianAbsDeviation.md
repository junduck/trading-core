[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / MedianAbsDeviation

# Class: MedianAbsDeviation

Defined in: [rolling/deviation.ts:39](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/deviation.ts#L39)

Rolling Median Absolute Deviation (MAD).
MAD = median(|x_i - median(x)|)

## Constructors

### Constructor

> **new MedianAbsDeviation**(`opts`): `MedianAbsDeviation`

Defined in: [rolling/deviation.ts:46](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/deviation.ts#L46)

#### Parameters

##### opts

###### period

`number`

#### Returns

`MedianAbsDeviation`

## Methods

### update()

> **update**(`x`): \{ `mad`: `number`; `median`: `number`; \} \| `undefined`

Defined in: [rolling/deviation.ts:54](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/deviation.ts#L54)

#### Parameters

##### x

`number`

#### Returns

\{ `mad`: `number`; `median`: `number`; \} \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/deviation.ts:41](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/deviation.ts#L41)

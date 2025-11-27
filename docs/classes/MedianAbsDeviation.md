[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / MedianAbsDeviation

# Class: MedianAbsDeviation

Defined in: [rolling/deviation.ts:48](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L48)

Rolling Median Absolute Deviation (MAD).
MAD = median(|x_i - median(x)|)

## Accessors

### value

#### Get Signature

> **get** **value**(): \{ `mad`: `number`; `median`: `number`; \} \| `undefined`

Defined in: [rolling/deviation.ts:57](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L57)

##### Returns

\{ `mad`: `number`; `median`: `number`; \} \| `undefined`

## Constructors

### Constructor

> **new MedianAbsDeviation**(`opts`): `MedianAbsDeviation`

Defined in: [rolling/deviation.ts:64](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L64)

#### Parameters

##### opts

###### period

`number`

#### Returns

`MedianAbsDeviation`

## Methods

### update()

> **update**(`x`): \{ `mad`: `number`; `median`: `number`; \} \| `undefined`

Defined in: [rolling/deviation.ts:72](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L72)

#### Parameters

##### x

`number`

#### Returns

\{ `mad`: `number`; `median`: `number`; \} \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/deviation.ts:50](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L50)

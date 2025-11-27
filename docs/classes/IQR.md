[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / IQR

# Class: IQR

Defined in: [rolling/deviation.ts:103](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L103)

Rolling Interquartile Range (IQR).
IQR = Q3 - Q1 (75th percentile - 25th percentile)

## Accessors

### value

#### Get Signature

> **get** **value**(): \{ `iqr`: `number`; `q1`: `number`; `q3`: `number`; \} \| `undefined`

Defined in: [rolling/deviation.ts:111](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L111)

##### Returns

\{ `iqr`: `number`; `q1`: `number`; `q3`: `number`; \} \| `undefined`

## Constructors

### Constructor

> **new IQR**(`opts`): `IQR`

Defined in: [rolling/deviation.ts:118](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L118)

#### Parameters

##### opts

###### period

`number`

#### Returns

`IQR`

## Methods

### update()

> **update**(`x`): \{ `iqr`: `number`; `q1`: `number`; `q3`: `number`; \} \| `undefined`

Defined in: [rolling/deviation.ts:125](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L125)

#### Parameters

##### x

`number`

#### Returns

\{ `iqr`: `number`; `q1`: `number`; `q3`: `number`; \} \| `undefined`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/deviation.ts:104](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L104)

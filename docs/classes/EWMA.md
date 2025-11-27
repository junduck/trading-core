[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / EWMA

# Class: EWMA

Defined in: [rolling/average.ts:103](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L103)

O(1) exponential weighted moving average with fixed window.
Combines exponential weighting with sliding window.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [rolling/average.ts:111](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L111)

##### Returns

`number`

## Constructors

### Constructor

> **new EWMA**(`opts`): `EWMA`

Defined in: [rolling/average.ts:115](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L115)

#### Parameters

##### opts

###### period

`number`

#### Returns

`EWMA`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:122](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L122)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/average.ts:104](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L104)

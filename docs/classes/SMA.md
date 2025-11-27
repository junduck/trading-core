[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / SMA

# Class: SMA

Defined in: [rolling/average.ts:36](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L36)

O(1) simple moving average (SMA) using circular buffer.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [rolling/average.ts:41](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L41)

##### Returns

`number`

## Constructors

### Constructor

> **new SMA**(`opts`): `SMA`

Defined in: [rolling/average.ts:45](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L45)

#### Parameters

##### opts

###### period

`number`

#### Returns

`SMA`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:50](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L50)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/average.ts:37](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L37)

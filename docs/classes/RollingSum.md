[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingSum

# Class: RollingSum

Defined in: [rolling/average.ts:8](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L8)

O(1) moving sum using circular buffer and Kahan summation.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [rolling/average.ts:12](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L12)

##### Returns

`number`

## Constructors

### Constructor

> **new RollingSum**(`opts`): `RollingSum`

Defined in: [rolling/average.ts:16](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L16)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingSum`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:20](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L20)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/average.ts:9](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L9)

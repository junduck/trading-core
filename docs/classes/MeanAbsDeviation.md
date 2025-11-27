[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / MeanAbsDeviation

# Class: MeanAbsDeviation

Defined in: [rolling/deviation.ts:11](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L11)

Rolling Mean Absolute Deviation.
MeadAD = mean(|x_i - mean(x)|)

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/deviation.ts:16](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L16)

##### Returns

`object`

###### mad

> **mad**: `number`

###### mean

> **mean**: `number`

## Constructors

### Constructor

> **new MeanAbsDeviation**(`opts`): `MeanAbsDeviation`

Defined in: [rolling/deviation.ts:23](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L23)

#### Parameters

##### opts

###### period

`number`

#### Returns

`MeanAbsDeviation`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/deviation.ts:28](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L28)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mad

> **mad**: `number`

##### mean

> **mean**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/deviation.ts:13](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/deviation.ts#L13)

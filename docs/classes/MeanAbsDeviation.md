[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / MeanAbsDeviation

# Class: MeanAbsDeviation

Defined in: [rolling/deviation.ts:11](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L11)

Rolling Mean Absolute Deviation.
MeadAD = mean(|x_i - mean(x)|)

## Constructors

### Constructor

> **new MeanAbsDeviation**(`opts`): `MeanAbsDeviation`

Defined in: [rolling/deviation.ts:15](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L15)

#### Parameters

##### opts

###### period

`number`

#### Returns

`MeanAbsDeviation`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/deviation.ts:20](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L20)

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

Defined in: [rolling/deviation.ts:13](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/deviation.ts#L13)

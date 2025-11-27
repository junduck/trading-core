[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / Kahan

# Class: Kahan

Defined in: [numeric/accum.ts:6](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/accum.ts#L6)

Kahan summation algorithm for numerical stability.
Reduces floating-point rounding errors in sequential addition.

## Constructors

### Constructor

> **new Kahan**(): `Kahan`

#### Returns

`Kahan`

## Methods

### accum()

> **accum**(`x`): `number`

Defined in: [numeric/accum.ts:15](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/accum.ts#L15)

Accumulates a value to the sum with error compensation.

#### Parameters

##### x

`number`

Value to add

#### Returns

`number`

Current compensated sum

## Properties

### val

> **val**: `number` = `0`

Defined in: [numeric/accum.ts:7](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/accum.ts#L7)

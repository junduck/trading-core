[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / Kahan

# Class: Kahan

Defined in: [utils/accum.ts:6](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/accum.ts#L6)

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

Defined in: [utils/accum.ts:15](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/accum.ts#L15)

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

Defined in: [utils/accum.ts:7](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/accum.ts#L7)

[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / CuVar

# Class: CuVar

Defined in: [online/stats.ts:7](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L7)

O(1) cumulative variance using Welford's online algorithm.

## Constructors

### Constructor

> **new CuVar**(`opts?`): `CuVar`

Defined in: [online/stats.ts:16](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L16)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuVar`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [online/stats.ts:20](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L20)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### variance

> **variance**: `number`

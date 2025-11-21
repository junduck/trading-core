[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / CuBeta

# Class: CuBeta

Defined in: [online/stats.ts:151](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L151)

O(1) cumulative beta coefficient (regression slope).

## Constructors

### Constructor

> **new CuBeta**(`opts?`): `CuBeta`

Defined in: [online/stats.ts:162](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L162)

#### Parameters

##### opts?

###### ddof?

`number`

Delta degrees of freedom (default: 0)

#### Returns

`CuBeta`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [online/stats.ts:166](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/stats.ts#L166)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### beta

> **beta**: `number`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

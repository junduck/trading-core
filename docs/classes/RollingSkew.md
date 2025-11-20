[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingSkew

# Class: RollingSkew

Defined in: [rolling/moments.ts:63](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/moments.ts#L63)

O(1) rolling skewness.

## Constructors

### Constructor

> **new RollingSkew**(`opts`): `RollingSkew`

Defined in: [rolling/moments.ts:66](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/moments.ts#L66)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingSkew`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/moments.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/moments.ts#L70)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### skew

> **skew**: `number`

##### variance

> **variance**: `number`

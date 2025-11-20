[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingKurt

# Class: RollingKurt

Defined in: [rolling/moments.ts:81](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/moments.ts#L81)

O(1) rolling kurtosis.

## Constructors

### Constructor

> **new RollingKurt**(`opts`): `RollingKurt`

Defined in: [rolling/moments.ts:84](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/moments.ts#L84)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingKurt`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/moments.ts:88](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/moments.ts#L88)

#### Parameters

##### x

`number`

#### Returns

`object`

##### kurt

> **kurt**: `number`

##### mean

> **mean**: `number`

##### variance

> **variance**: `number`

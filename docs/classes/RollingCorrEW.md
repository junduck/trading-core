[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingCorrEW

# Class: RollingCorrEW

Defined in: [rolling/stats.ts:486](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L486)

Exponentially weighted correlation with infinite window.

## Constructors

### Constructor

> **new RollingCorrEW**(`opts`): `RollingCorrEW`

Defined in: [rolling/stats.ts:498](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L498)

#### Parameters

##### opts

\{ `period`: `number`; \}

###### period

`number`

Period to calculate alpha

|

\{ `alpha`: `number`; \}

###### alpha

`number`

Direct smoothing factor

#### Returns

`RollingCorrEW`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:506](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L506)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### corr

> **corr**: `number`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

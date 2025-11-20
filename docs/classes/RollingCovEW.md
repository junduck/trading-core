[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingCovEW

# Class: RollingCovEW

Defined in: [rolling/stats.ts:448](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L448)

Exponentially weighted covariance with infinite window.

## Constructors

### Constructor

> **new RollingCovEW**(`opts`): `RollingCovEW`

Defined in: [rolling/stats.ts:458](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L458)

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

`RollingCovEW`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:466](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L466)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`object`

##### cov

> **cov**: `number`

##### meanX

> **meanX**: `number`

##### meanY

> **meanY**: `number`

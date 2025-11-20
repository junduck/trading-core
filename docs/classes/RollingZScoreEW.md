[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingZScoreEW

# Class: RollingZScoreEW

Defined in: [rolling/stats.ts:159](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L159)

Exponentially weighted z-score with infinite window.

## Constructors

### Constructor

> **new RollingZScoreEW**(`opts`): `RollingZScoreEW`

Defined in: [rolling/stats.ts:166](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L166)

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

`RollingZScoreEW`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:170](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/stats.ts#L170)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

##### zscore

> **zscore**: `number`

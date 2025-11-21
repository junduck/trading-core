[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingBetaEW

# Class: RollingBetaEW

Defined in: [rolling/stats.ts:538](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L538)

Exponentially weighted beta coefficient with infinite window.

## Constructors

### Constructor

> **new RollingBetaEW**(`opts`): `RollingBetaEW`

Defined in: [rolling/stats.ts:549](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L549)

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

`RollingBetaEW`

## Methods

### update()

> **update**(`x`, `y`): `object`

Defined in: [rolling/stats.ts:557](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L557)

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

[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingStddevEW

# Class: RollingStddevEW

Defined in: [rolling/stats.ts:118](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L118)

Exponentially weighted standard deviation with infinite window.

## Constructors

### Constructor

> **new RollingStddevEW**(`opts`): `RollingStddevEW`

Defined in: [rolling/stats.ts:125](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L125)

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

`RollingStddevEW`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:129](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L129)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

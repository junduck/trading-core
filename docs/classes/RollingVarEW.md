[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingVarEW

# Class: RollingVarEW

Defined in: [rolling/stats.ts:61](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L61)

Exponentially weighted variance with infinite window.

## Constructors

### Constructor

> **new RollingVarEW**(`opts`): `RollingVarEW`

Defined in: [rolling/stats.ts:70](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L70)

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

`RollingVarEW`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/stats.ts:78](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/stats.ts#L78)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### variance

> **variance**: `number`

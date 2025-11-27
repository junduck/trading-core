[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingVarEW

# Class: RollingVarEW

Defined in: [rolling/stats.ts:74](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L74)

Exponentially weighted variance with infinite window.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:79](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L79)

##### Returns

`object`

###### mean

> **mean**: `number`

###### variance

> **variance**: `number`

## Constructors

### Constructor

> **new RollingVarEW**(`opts`): `RollingVarEW`

Defined in: [rolling/stats.ts:90](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L90)

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

Defined in: [rolling/stats.ts:98](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L98)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### variance

> **variance**: `number`

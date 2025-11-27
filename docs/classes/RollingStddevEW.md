[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingStddevEW

# Class: RollingStddevEW

Defined in: [rolling/stats.ts:143](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L143)

Exponentially weighted standard deviation with infinite window.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:146](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L146)

##### Returns

`object`

###### mean

> **mean**: `number`

###### stddev

> **stddev**: `number`

## Constructors

### Constructor

> **new RollingStddevEW**(`opts`): `RollingStddevEW`

Defined in: [rolling/stats.ts:155](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L155)

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

Defined in: [rolling/stats.ts:159](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L159)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

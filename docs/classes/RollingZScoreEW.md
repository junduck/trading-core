[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingZScoreEW

# Class: RollingZScoreEW

Defined in: [rolling/stats.ts:196](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L196)

Exponentially weighted z-score with infinite window.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:200](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L200)

##### Returns

`object`

###### mean

> **mean**: `number`

###### stddev

> **stddev**: `number`

###### zscore

> **zscore**: `number`

## Constructors

### Constructor

> **new RollingZScoreEW**(`opts`): `RollingZScoreEW`

Defined in: [rolling/stats.ts:209](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L209)

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

Defined in: [rolling/stats.ts:213](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L213)

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

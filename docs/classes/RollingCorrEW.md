[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingCorrEW

# Class: RollingCorrEW

Defined in: [rolling/stats.ts:604](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L604)

Exponentially weighted correlation with infinite window.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:612](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L612)

##### Returns

`object`

###### corr

> **corr**: `number`

###### cov

> **cov**: `number`

###### meanX

> **meanX**: `number`

###### meanY

> **meanY**: `number`

## Constructors

### Constructor

> **new RollingCorrEW**(`opts`): `RollingCorrEW`

Defined in: [rolling/stats.ts:629](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L629)

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

Defined in: [rolling/stats.ts:637](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L637)

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

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingBetaEW

# Class: RollingBetaEW

Defined in: [rolling/stats.ts:669](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L669)

Exponentially weighted beta coefficient with infinite window.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/stats.ts:676](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L676)

##### Returns

`object`

###### beta

> **beta**: `number`

###### cov

> **cov**: `number`

###### meanX

> **meanX**: `number`

###### meanY

> **meanY**: `number`

## Constructors

### Constructor

> **new RollingBetaEW**(`opts`): `RollingBetaEW`

Defined in: [rolling/stats.ts:692](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L692)

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

Defined in: [rolling/stats.ts:700](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/stats.ts#L700)

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

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / EMA

# Class: EMA

Defined in: [rolling/average.ts:68](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L68)

Exponential moving average (EMA) with infinite window.
EMA = alpha * x + (1 - alpha) * EMA_prev

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [rolling/average.ts:72](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L72)

##### Returns

`number`

## Constructors

### Constructor

> **new EMA**(`opts`): `EMA`

Defined in: [rolling/average.ts:80](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L80)

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

`EMA`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/average.ts:88](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/average.ts#L88)

#### Parameters

##### x

`number`

#### Returns

`number`

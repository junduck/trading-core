[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / EMA

# Class: EMA

Defined in: [rolling/average.ts:60](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L60)

Exponential moving average (EMA) with infinite window.
EMA = alpha * x + (1 - alpha) * EMA_prev

## Constructors

### Constructor

> **new EMA**(`opts`): `EMA`

Defined in: [rolling/average.ts:68](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L68)

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

Defined in: [rolling/average.ts:76](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/rolling/average.ts#L76)

#### Parameters

##### x

`number`

#### Returns

`number`

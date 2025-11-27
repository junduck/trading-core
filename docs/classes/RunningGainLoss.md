[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningGainLoss

# Class: RunningGainLoss

Defined in: [online/perf-metrics.ts:156](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L156)

Running gain/loss ratio: average_gain / average_loss.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [online/perf-metrics.ts:161](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L161)

##### Returns

`number`

## Constructors

### Constructor

> **new RunningGainLoss**(`opts?`): `RunningGainLoss`

Defined in: [online/perf-metrics.ts:171](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L171)

#### Parameters

##### opts?

###### threshold?

`number`

Returns above this are gains, below are losses (default: 0)

#### Returns

`RunningGainLoss`

## Methods

### update()

> **update**(`ret`): `number`

Defined in: [online/perf-metrics.ts:179](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L179)

#### Parameters

##### ret

`number`

Period return

#### Returns

`number`

Current gain/loss ratio, or 0 if no losses yet

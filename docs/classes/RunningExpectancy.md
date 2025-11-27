[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningExpectancy

# Class: RunningExpectancy

Defined in: [online/perf-metrics.ts:194](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L194)

Running expectancy: (win_rate × avg_gain) - (loss_rate × avg_loss).

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [online/perf-metrics.ts:202](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L202)

##### Returns

`number`

## Constructors

### Constructor

> **new RunningExpectancy**(`opts?`): `RunningExpectancy`

Defined in: [online/perf-metrics.ts:213](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L213)

#### Parameters

##### opts?

###### threshold?

`number`

Returns above this are gains, below are losses (default: 0)

#### Returns

`RunningExpectancy`

## Methods

### update()

> **update**(`ret`): `number`

Defined in: [online/perf-metrics.ts:221](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L221)

#### Parameters

##### ret

`number`

Period return

#### Returns

`number`

Current expectancy

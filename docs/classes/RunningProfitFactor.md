[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningProfitFactor

# Class: RunningProfitFactor

Defined in: [online/perf-metrics.ts:239](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L239)

Running profit factor: sum_of_gains / sum_of_losses.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [online/perf-metrics.ts:244](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L244)

##### Returns

`number`

## Constructors

### Constructor

> **new RunningProfitFactor**(`opts?`): `RunningProfitFactor`

Defined in: [online/perf-metrics.ts:252](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L252)

#### Parameters

##### opts?

###### threshold?

`number`

Returns above this are gains, below are losses (default: 0)

#### Returns

`RunningProfitFactor`

## Methods

### update()

> **update**(`ret`): `number`

Defined in: [online/perf-metrics.ts:260](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L260)

#### Parameters

##### ret

`number`

Period return

#### Returns

`number`

Current profit factor, or 0 if no losses yet

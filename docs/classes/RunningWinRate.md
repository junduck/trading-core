[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningWinRate

# Class: RunningWinRate

Defined in: [online/perf-metrics.ts:122](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L122)

Running win rate (hit ratio): percentage of positive returns.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [online/perf-metrics.ts:127](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L127)

##### Returns

`number`

## Constructors

### Constructor

> **new RunningWinRate**(`opts?`): `RunningWinRate`

Defined in: [online/perf-metrics.ts:134](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L134)

#### Parameters

##### opts?

###### threshold?

`number`

Returns above this are considered wins (default: 0)

#### Returns

`RunningWinRate`

## Methods

### update()

> **update**(`ret`): `number`

Defined in: [online/perf-metrics.ts:142](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L142)

#### Parameters

##### ret

`number`

Period return

#### Returns

`number`

Current win rate [0, 1]

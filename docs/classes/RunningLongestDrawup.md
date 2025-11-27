[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningLongestDrawup

# Class: RunningLongestDrawup\<T\>

Defined in: [online/perf-drawdown.ts:325](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L325)

Tracks longest drawup duration (time from trough to recovery).

## Type Parameters

### T

`T` = `Date`

Time type (default: Date)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:332](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L332)

##### Returns

[`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

## Constructors

### Constructor

> **new RunningLongestDrawup**\<`T`\>(`initValue`, `initTime`, `computeDuration?`): `RunningLongestDrawup`\<`T`\>

Defined in: [online/perf-drawdown.ts:341](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L341)

#### Parameters

##### initValue

`number`

Initial value

##### initTime

`T`

Initial time

##### computeDuration?

(`from`, `to`) => `number`

Function to compute duration between two time points (defaults to Date millisecond difference)

#### Returns

`RunningLongestDrawup`\<`T`\>

## Methods

### update()

> **update**(`value`, `time`): [`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:364](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L364)

#### Parameters

##### value

`number`

Current value

##### time

`T`

Current time

#### Returns

[`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

Current drawup duration, longest duration, and longest period [from, to]

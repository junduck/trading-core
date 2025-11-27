[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningLongestDrawdown

# Class: RunningLongestDrawdown\<T\>

Defined in: [online/perf-drawdown.ts:247](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L247)

Tracks longest drawdown duration (time from peak to recovery).

## Type Parameters

### T

`T` = `Date`

Time type (default: Date)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:254](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L254)

##### Returns

[`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

## Constructors

### Constructor

> **new RunningLongestDrawdown**\<`T`\>(`initValue`, `initTime`, `computeDuration?`): `RunningLongestDrawdown`\<`T`\>

Defined in: [online/perf-drawdown.ts:263](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L263)

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

`RunningLongestDrawdown`\<`T`\>

## Methods

### update()

> **update**(`value`, `time`): [`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:286](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L286)

#### Parameters

##### value

`number`

Current value

##### time

`T`

Current time

#### Returns

[`RunningDrawDurationResult`](../interfaces/RunningDrawDurationResult.md)\<`T`\>

Current drawdown duration, longest duration, and longest period [from, to]

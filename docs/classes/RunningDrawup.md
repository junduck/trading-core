[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningDrawup

# Class: RunningDrawup\<T\>

Defined in: [online/perf-drawdown.ts:71](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L71)

Tracks absolute drawup as value - trough.

## Type Parameters

### T

`T` = `Date`

Time type (default: Date)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:79](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L79)

##### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

## Constructors

### Constructor

> **new RunningDrawup**\<`T`\>(`initValue`, `initTime`): `RunningDrawup`\<`T`\>

Defined in: [online/perf-drawdown.ts:88](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L88)

#### Parameters

##### initValue

`number`

##### initTime

`T`

#### Returns

`RunningDrawup`\<`T`\>

## Methods

### update()

> **update**(`value`, `time`): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:100](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L100)

#### Parameters

##### value

`number`

Current value

##### time

`T`

Current time

#### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Current drawup, max drawup, and max period [from, to]

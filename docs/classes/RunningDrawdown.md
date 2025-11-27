[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningDrawdown

# Class: RunningDrawdown\<T\>

Defined in: [online/perf-drawdown.ts:17](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L17)

Tracks absolute drawdown as peak - value.

## Type Parameters

### T

`T` = `Date`

Time type (default: Date)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:25](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L25)

##### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

## Constructors

### Constructor

> **new RunningDrawdown**\<`T`\>(`initValue`, `initTime`): `RunningDrawdown`\<`T`\>

Defined in: [online/perf-drawdown.ts:34](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L34)

#### Parameters

##### initValue

`number`

##### initTime

`T`

#### Returns

`RunningDrawdown`\<`T`\>

## Methods

### update()

> **update**(`value`, `time`): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:46](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L46)

#### Parameters

##### value

`number`

Current value

##### time

`T`

Current time

#### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Current drawdown, max drawdown, and max period [from, to]

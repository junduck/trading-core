[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningRelDrawdown

# Class: RunningRelDrawdown\<T\>

Defined in: [online/perf-drawdown.ts:127](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L127)

Tracks relative drawdown as (peak - value) / peak.

## Throws

If initValue <= 0

## Note

Mathematically invalid if values cross zero

## Type Parameters

### T

`T` = `Date`

Time type (default: Date)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:135](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L135)

##### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

## Constructors

### Constructor

> **new RunningRelDrawdown**\<`T`\>(`initValue`, `initTime`): `RunningRelDrawdown`\<`T`\>

Defined in: [online/perf-drawdown.ts:144](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L144)

#### Parameters

##### initValue

`number`

##### initTime

`T`

#### Returns

`RunningRelDrawdown`\<`T`\>

## Methods

### update()

> **update**(`value`, `time`): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:156](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L156)

#### Parameters

##### value

`number`

Current value

##### time

`T`

Current time

#### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Current relative drawdown, max drawdown, and max period [from, to]

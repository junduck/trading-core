[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningRelDrawup

# Class: RunningRelDrawup\<T\>

Defined in: [online/perf-drawdown.ts:183](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L183)

Tracks relative drawup as (value - trough) / trough.

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

Defined in: [online/perf-drawdown.ts:191](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L191)

##### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

## Constructors

### Constructor

> **new RunningRelDrawup**\<`T`\>(`initValue`, `initTime`): `RunningRelDrawup`\<`T`\>

Defined in: [online/perf-drawdown.ts:199](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L199)

#### Parameters

##### initValue

`number`

##### initTime

`T`

#### Returns

`RunningRelDrawup`\<`T`\>

## Methods

### update()

> **update**(`value`, `time`): [`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Defined in: [online/perf-drawdown.ts:211](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-drawdown.ts#L211)

#### Parameters

##### value

`number`

Current value

##### time

`T`

Current time

#### Returns

[`RunningDrawResult`](../interfaces/RunningDrawResult.md)\<`T`\>

Current relative drawup, max drawup, and max period [from, to]

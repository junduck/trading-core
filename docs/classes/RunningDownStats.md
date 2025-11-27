[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningDownStats

# Class: RunningDownStats

Defined in: [online/perf-metrics.ts:10](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L10)

Tracks downside mean and standard deviation (semi-deviation).
Only considers returns below the threshold (typically riskfree rate).

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [online/perf-metrics.ts:14](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L14)

##### Returns

`object`

###### mean

> **mean**: `number`

###### stddev

> **stddev**: `number`

## Constructors

### Constructor

> **new RunningDownStats**(`opts?`): `RunningDownStats`

Defined in: [online/perf-metrics.ts:21](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L21)

#### Parameters

##### opts?

###### threshold?

`number`

Returns below this are considered downside (default: 0)

#### Returns

`RunningDownStats`

## Methods

### setThreshold()

> **setThreshold**(`threshold`): `void`

Defined in: [online/perf-metrics.ts:37](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L37)

#### Parameters

##### threshold

`number`

#### Returns

`void`

***

### update()

> **update**(`ret`): `object`

Defined in: [online/perf-metrics.ts:30](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L30)

#### Parameters

##### ret

`number`

Return value

#### Returns

`object`

Mean and stddev of downside returns, 0 if no downside yet

##### mean

> **mean**: `number`

##### stddev

> **stddev**: `number`

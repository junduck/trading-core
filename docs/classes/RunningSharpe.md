[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningSharpe

# Class: RunningSharpe

Defined in: [online/perf-metrics.ts:47](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L47)

Running Sharpe ratio: (mean_return - riskfree) / stddev_return
Uses sample standard deviation (ddof=1) per industry convention.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [online/perf-metrics.ts:51](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L51)

##### Returns

`number`

## Constructors

### Constructor

> **new RunningSharpe**(`opts?`): `RunningSharpe`

Defined in: [online/perf-metrics.ts:61](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L61)

#### Parameters

##### opts?

###### riskfree?

`number`

Risk-free rate per period (default: 0)

#### Returns

`RunningSharpe`

## Methods

### update()

> **update**(`ret`): `number`

Defined in: [online/perf-metrics.ts:70](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L70)

#### Parameters

##### ret

`number`

Period return (e.g., (price_t - price_{t-1}) / price_{t-1}), not cumulative

#### Returns

`number`

Current Sharpe ratio

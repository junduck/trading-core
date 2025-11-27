[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RunningSortino

# Class: RunningSortino

Defined in: [online/perf-metrics.ts:84](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L84)

Running Sortino ratio: (mean_return - riskfree) / downside_stddev
Similar to Sharpe but only penalizes downside volatility.
Uses sample standard deviation (ddof=1) per industry convention.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [online/perf-metrics.ts:89](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L89)

##### Returns

`number`

## Constructors

### Constructor

> **new RunningSortino**(`opts?`): `RunningSortino`

Defined in: [online/perf-metrics.ts:100](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L100)

#### Parameters

##### opts?

###### riskfree?

`number`

Risk-free rate per period (default: 0)

#### Returns

`RunningSortino`

## Methods

### update()

> **update**(`ret`): `number`

Defined in: [online/perf-metrics.ts:109](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/perf-metrics.ts#L109)

#### Parameters

##### ret

`number`

Period return (e.g., (price_t - price_{t-1}) / price_{t-1}), not cumulative

#### Returns

`number`

Current Sortino ratio

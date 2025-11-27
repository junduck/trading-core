[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / DrawdownResult

# Interface: DrawdownResult

Defined in: [numeric/drawdown.ts:7](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/drawdown.ts#L7)

Result of drawdown/drawup calculation

## Properties

### from

> **from**: `number`

Defined in: [numeric/drawdown.ts:11](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/drawdown.ts#L11)

Index of the extremum (peak for drawdown, trough for drawup)

***

### to

> **to**: `number`

Defined in: [numeric/drawdown.ts:13](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/drawdown.ts#L13)

Index where maximum movement occurred

***

### value

> **value**: `number`

Defined in: [numeric/drawdown.ts:9](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/drawdown.ts#L9)

The drawdown/drawup value

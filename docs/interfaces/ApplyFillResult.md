[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / ApplyFillResult

# ~~Interface: ApplyFillResult~~

Defined in: [utils/fill.utils.ts:61](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L61)

Result of applying fill(s) to a position.

## Deprecated

Use FillEffect with processFill instead. This interface will be removed in v3.0.

## Properties

### ~~cashFlow~~

> **cashFlow**: `number`

Defined in: [utils/fill.utils.ts:65](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L65)

Cumulative cash flow from the fills (negative for buying, positive for selling)

***

### ~~fills~~

> **fills**: [`Fill`](../type-aliases/Fill.md)[]

Defined in: [utils/fill.utils.ts:63](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L63)

The fills that were applied

***

### ~~realisedPnL~~

> **realisedPnL**: `number`

Defined in: [utils/fill.utils.ts:67](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L67)

Cumulative realized PnL from the fills (0 for opening positions, actual PnL for closing)

[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / ApplyFillResult

# Interface: ApplyFillResult

Defined in: [utils/fill.utils.ts:15](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/fill.utils.ts#L15)

Result of applying fill(s) to a position.

## Properties

### cashFlow

> **cashFlow**: `number`

Defined in: [utils/fill.utils.ts:19](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/fill.utils.ts#L19)

Cumulative cash flow from the fills (negative for buying, positive for selling)

***

### fills

> **fills**: [`Fill`](../type-aliases/Fill.md)[]

Defined in: [utils/fill.utils.ts:17](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/fill.utils.ts#L17)

The fills that were applied

***

### realisedPnL

> **realisedPnL**: `number`

Defined in: [utils/fill.utils.ts:21](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/fill.utils.ts#L21)

Cumulative realized PnL from the fills (0 for opening positions, actual PnL for closing)

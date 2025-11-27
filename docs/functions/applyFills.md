[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / applyFills

# ~~Function: applyFills()~~

> **applyFills**(`position`, `fills`, `closeStrategy`): [`ApplyFillResult`](../interfaces/ApplyFillResult.md)

Defined in: [utils/fill.utils.ts:191](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L191)

Applies multiple fills to a position sequentially.
Returns cumulative result with all fills, total cash flow, and total realized PnL.

## Parameters

### position

[`Position`](../interfaces/Position.md)

The position to modify

### fills

[`Fill`](../type-aliases/Fill.md)[]

The fills to apply in order

### closeStrategy

[`CloseStrategy`](../type-aliases/CloseStrategy.md) = `"FIFO"`

Lot closing strategy for closing positions (default: "FIFO")

## Returns

[`ApplyFillResult`](../interfaces/ApplyFillResult.md)

Cumulative result with all fills and totals

## Throws

Error if any fill cannot be applied

## Deprecated

Use processFill with map/reduce instead. This function will be removed in v3.0.

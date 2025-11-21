[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / applyFills

# Function: applyFills()

> **applyFills**(`position`, `fills`, `closeStrategy`): [`ApplyFillResult`](../interfaces/ApplyFillResult.md)

Defined in: [utils/fill.utils.ts:110](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/fill.utils.ts#L110)

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

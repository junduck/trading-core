[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / applyFill

# ~~Function: applyFill()~~

> **applyFill**(`position`, `fill`, `closeStrategy`): [`ApplyFillResult`](../interfaces/ApplyFillResult.md)

Defined in: [utils/fill.utils.ts:167](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L167)

Applies a single fill to update a position.
Routes to appropriate position utility based on fill effect.

## Parameters

### position

[`Position`](../interfaces/Position.md)

The position to modify

### fill

[`Fill`](../type-aliases/Fill.md)

The fill to apply

### closeStrategy

[`CloseStrategy`](../type-aliases/CloseStrategy.md) = `"FIFO"`

Lot closing strategy for closing positions (default: "FIFO")

## Returns

[`ApplyFillResult`](../interfaces/ApplyFillResult.md)

Result with fill, cash flow, and realized PnL

## Deprecated

Use processFill instead. This function will be removed in v3.0.

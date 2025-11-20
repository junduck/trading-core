[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / applyFill

# Function: applyFill()

> **applyFill**(`position`, `fill`, `closeStrategy`): [`ApplyFillResult`](../interfaces/ApplyFillResult.md)

Defined in: [utils/fill.utils.ts:33](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/fill.utils.ts#L33)

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

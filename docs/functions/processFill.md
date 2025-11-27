[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / processFill

# Function: processFill()

> **processFill**(`position`, `fill`, `closeStrategy`): [`FillEffect`](../interfaces/FillEffect.md)

Defined in: [utils/fill.utils.ts:90](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L90)

Processes a single fill to update a position and returns its effect.
Routes to appropriate position utility based on fill effect.

## Parameters

### position

[`Position`](../interfaces/Position.md)

The position to modify

### fill

[`Fill`](../type-aliases/Fill.md)

The fill to process

### closeStrategy

[`CloseStrategy`](../type-aliases/CloseStrategy.md) = `"FIFO"`

Lot closing strategy for closing positions (default: "FIFO")

## Returns

[`FillEffect`](../interfaces/FillEffect.md)

Effect of the fill including cash flow and realized PnL

## Remarks

This function delegates to low-level position primitives that operate permissively without
enforcing business logic or validation. It will:
- Route fills to openLong, closeLong, openShort, or closeShort based on fill.effect
- Not prevent contradictory operations (e.g., opening short while holding long)
- Not validate sufficient cash, margin, or asset availability
- Not enforce trading strategy rules or constraints

Validation and business logic enforcement is the caller's responsibility.

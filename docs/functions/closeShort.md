[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / closeShort

# Function: closeShort()

> **closeShort**(`pos`, `symbol`, `price`, `quant`, `comm`, `strat`, `time?`): `number`

Defined in: [utils/position.utils.ts:434](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/position.utils.ts#L434)

Closes a short position by buying back the asset.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### symbol

`string`

The asset symbol

### price

`number`

The price per unit

### quant

`number`

The quantity to buy back

### comm

`number` = `0`

The commission paid (default: 0)

### strat

[`CloseStrategy`](../type-aliases/CloseStrategy.md) = `"FIFO"`

The lot closing strategy (default: "FIFO")

### time?

`Date`

The transaction time (default: current date)

## Returns

`number`

The realised profit or loss

## Remarks

This is a low-level primitive that operates permissively on position state without enforcing
business logic or validation. It executes the requested operation as instructed:
- Does not validate if the quantity exceeds available short holdings (will process the requested amount)
- Does not enforce trading strategy rules or constraints
- Only throws error if no short position exists at all

Validation and business logic enforcement is the caller's responsibility.

## Throws

Error if no short position exists for the asset

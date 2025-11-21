[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / closeShort

# Function: closeShort()

> **closeShort**(`pos`, `symbol`, `price`, `quant`, `comm`, `strat`, `time?`): `number`

Defined in: [utils/position.utils.ts:394](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/position.utils.ts#L394)

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

## Throws

Error if no short position exists for the asset

[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / closeLong

# Function: closeLong()

> **closeLong**(`pos`, `symbol`, `price`, `quant`, `comm`, `strat`, `time?`): `number`

Defined in: [utils/position.utils.ts:263](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/position.utils.ts#L263)

Closes a long position by selling an asset.

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

The quantity to sell

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

Error if no long position exists for the asset

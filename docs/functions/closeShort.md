[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / closeShort

# Function: closeShort()

> **closeShort**(`pos`, `symbol`, `price`, `quant`, `comm`, `strat`, `time?`): `number`

Defined in: [utils/position.utils.ts:388](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/position.utils.ts#L388)

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

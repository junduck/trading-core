[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / openLong

# Function: openLong()

> **openLong**(`pos`, `symbol`, `price`, `quant`, `comm`, `time?`, `disableLot?`): `number`

Defined in: [utils/position.utils.ts:214](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/position.utils.ts#L214)

Opens a long position by purchasing an asset.

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

The quantity to purchase

### comm

`number` = `0`

The commission paid (default: 0)

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`number`

The cash flow (negative value representing cost)

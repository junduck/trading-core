[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / openShort

# Function: openShort()

> **openShort**(`pos`, `symbol`, `price`, `quant`, `comm`, `time?`, `disableLot?`): `number`

Defined in: [utils/position.utils.ts:375](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/position.utils.ts#L375)

Opens a short position by borrowing and selling an asset.

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

The quantity to short

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

The cash proceeds from the short sale

## Remarks

This is a low-level primitive that operates permissively on position state without enforcing
business logic or validation. It executes the requested operation as instructed:
- Does not prevent opening short while holding long in the same symbol (spot market contradiction)
- Does not validate margin requirements or borrowing availability
- Does not enforce trading strategy rules or constraints

Validation and business logic enforcement is the caller's responsibility.

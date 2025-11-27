[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / openLong

# Function: openLong()

> **openLong**(`pos`, `symbol`, `price`, `quant`, `comm`, `time?`, `disableLot?`): `number`

Defined in: [utils/position.utils.ts:224](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/position.utils.ts#L224)

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

## Remarks

This is a low-level primitive that operates permissively on position state without enforcing
business logic or validation. It executes the requested operation as instructed:
- Does not prevent opening long while holding short in the same symbol
- Does not validate sufficient cash availability
- Does not enforce trading strategy rules or constraints

Validation and business logic enforcement is the caller's responsibility.

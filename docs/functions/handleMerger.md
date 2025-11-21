[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / handleMerger

# Function: handleMerger()

> **handleMerger**(`pos`, `symbol`, `newSymbol`, `ratio`, `cashComponent`, `time?`, `disableLot?`): `number`

Defined in: [utils/stock.utils.ts:219](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/stock.utils.ts#L219)

Handles a corporate merger by exchanging positions to the acquiring company.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The source position

### symbol

`string`

The asset symbol being acquired

### newSymbol

`string`

The acquiring company symbol

### ratio

`number`

The exchange ratio of new shares per old share

### cashComponent

`number` = `0`

The cash amount per share (default: 0)

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`number`

The net cash flow from the merger

## Throws

Error if the merger ratio is not positive or cash component is negative

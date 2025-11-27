[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / handleSpinoff

# Function: handleSpinoff()

> **handleSpinoff**(`pos`, `symbol`, `newSymbol`, `ratio`, `time?`, `disableLot?`): `void`

Defined in: [utils/stock.utils.ts:150](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/stock.utils.ts#L150)

Handles a corporate spinoff by creating positions in the new company.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The source position

### symbol

`string`

The original asset symbol

### newSymbol

`string`

The spun-off company symbol

### ratio

`number`

The number of new shares per original share

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`void`

## Throws

Error if the spinoff ratio is not positive

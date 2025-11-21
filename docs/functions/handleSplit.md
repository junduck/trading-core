[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / handleSplit

# Function: handleSplit()

> **handleSplit**(`pos`, `symbol`, `ratio`, `time?`): `void`

Defined in: [utils/stock.utils.ts:22](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/stock.utils.ts#L22)

Handles a stock split by adjusting position quantities and costs.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### symbol

`string`

The asset symbol undergoing the split

### ratio

`number`

The split ratio (e.g., 2 for a 2-for-1 split)

### time?

`Date`

The transaction time (default: current date)

## Returns

`void`

## Throws

Error if the split ratio is not positive

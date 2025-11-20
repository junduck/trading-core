[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / handleSplit

# Function: handleSplit()

> **handleSplit**(`pos`, `symbol`, `ratio`, `time?`): `void`

Defined in: [utils/stock.utils.ts:22](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/stock.utils.ts#L22)

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

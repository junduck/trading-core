[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / updateSnapshotBar

# Function: updateSnapshotBar()

> **updateSnapshotBar**(`snapshot`, `bar`): [`MarketSnapshot`](../interfaces/MarketSnapshot.md)

Defined in: [utils/market.utils.ts:234](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/market.utils.ts#L234)

Updates a MarketSnapshot with a new MarketBar using the close price.
The function updates the price for the symbol in the snapshot with the bar's close price
and ensures the timestamp reflects the most recent data.

## Parameters

### snapshot

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

The MarketSnapshot to update

### bar

[`MarketBar`](../interfaces/MarketBar.md)

The MarketBar containing the new price data

## Returns

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

The updated MarketSnapshot

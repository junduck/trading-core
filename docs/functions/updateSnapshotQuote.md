[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / updateSnapshotQuote

# Function: updateSnapshotQuote()

> **updateSnapshotQuote**(`snapshot`, `quote`): [`MarketSnapshot`](../interfaces/MarketSnapshot.md)

Defined in: [utils/market.utils.ts:209](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/market.utils.ts#L209)

Updates a MarketSnapshot with a new MarketQuote using LOCF (Last Observation Carried Forward).
The function updates the price for the symbol in the snapshot and ensures the timestamp
reflects the most recent data.

## Parameters

### snapshot

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

The MarketSnapshot to update

### quote

[`MarketQuote`](../interfaces/MarketQuote.md)

The MarketQuote containing the new price data

## Returns

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

The updated MarketSnapshot

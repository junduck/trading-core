[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / Asset

# Interface: Asset

Defined in: [types/asset.ts:6](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L6)

Represents a tradable asset in a SPOT market.
Contains metadata and trading specifications for the asset.

## Properties

### currency

> **currency**: `string`

Defined in: [types/asset.ts:20](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L20)

Base currency used for pricing (e.g., "USD", "USDT")

***

### exchange?

> `optional` **exchange**: `string`

Defined in: [types/asset.ts:17](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L17)

Exchange or trading venue where the asset is traded

***

### lotSize?

> `optional` **lotSize**: `number`

Defined in: [types/asset.ts:23](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L23)

Minimum quantity increment for trading (minimum order size)

***

### name?

> `optional` **name**: `string`

Defined in: [types/asset.ts:14](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L14)

Human-readable name of the asset

***

### symbol

> **symbol**: `string`

Defined in: [types/asset.ts:8](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L8)

Unique identifier for the asset (e.g., "BTCUSDT", "AAPL")

***

### tickSize?

> `optional` **tickSize**: `number`

Defined in: [types/asset.ts:26](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L26)

Minimum price increment (smallest price movement allowed)

***

### type?

> `optional` **type**: `string`

Defined in: [types/asset.ts:11](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L11)

Type of asset (e.g., "crypto", "stock", "forex")

***

### validFrom?

> `optional` **validFrom**: `Date`

Defined in: [types/asset.ts:29](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L29)

Date from which this asset becomes valid/tradable (null means always valid)

***

### validUntil?

> `optional` **validUntil**: `Date`

Defined in: [types/asset.ts:32](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/asset.ts#L32)

Date until which this asset is valid/tradable (null means no expiry)

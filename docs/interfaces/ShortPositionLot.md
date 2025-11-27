[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / ShortPositionLot

# Interface: ShortPositionLot

Defined in: [types/position.ts:44](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L44)

Represents a single lot (trade) within a short position.
Used for tracking individual short sales with their specific price and commission.

## Properties

### price

> **price**: `number`

Defined in: [types/position.ts:49](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L49)

Sale price per unit at which this lot was opened

***

### quantity

> **quantity**: `number`

Defined in: [types/position.ts:46](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L46)

Quantity of the asset in this lot

***

### totalProceeds

> **totalProceeds**: `number`

Defined in: [types/position.ts:52](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L52)

Total proceeds from this lot after commission (proceeds = price * quantity - commission). This is deducted proportionally when closing positions.

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / LongPositionLot

# Interface: LongPositionLot

Defined in: [types/position.ts:6](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L6)

Represents a single lot (trade) within a long position.
Used for tracking individual purchases with their specific price and commission.

## Properties

### price

> **price**: `number`

Defined in: [types/position.ts:11](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L11)

Purchase price per unit at which this lot was acquired

***

### quantity

> **quantity**: `number`

Defined in: [types/position.ts:8](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L8)

Quantity of the asset in this lot

***

### totalCost

> **totalCost**: `number`

Defined in: [types/position.ts:14](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/position.ts#L14)

Total cost for this lot including commission (cost = price * quantity + commission). This is deducted proportionally when closing positions.

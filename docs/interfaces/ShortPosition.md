[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / ShortPosition

# Interface: ShortPosition

Defined in: [types/position.ts:60](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L60)

Represents a short position for book-keeping.
Aggregates multiple lots to track overall short holdings, and profit/loss.

## Properties

### lots

> **lots**: [`ShortPositionLot`](ShortPositionLot.md)[]

Defined in: [types/position.ts:71](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L71)

Individual lots that make up this position. New lots are pushed to the end. Quantities are mutated in-place when closing positions.

***

### modified

> **modified**: `Date`

Defined in: [types/position.ts:74](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L74)

Timestamp when this position was last modified

***

### quantity

> **quantity**: `number`

Defined in: [types/position.ts:62](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L62)

Total open quantity of this short position

***

### realisedPnL

> **realisedPnL**: `number`

Defined in: [types/position.ts:68](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L68)

Realised profit and loss accumulated when reducing position size

***

### totalProceeds

> **totalProceeds**: `number`

Defined in: [types/position.ts:65](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L65)

Total proceeds from all open lots combined (sum of all lot totalProceeds). This is deducted when closing positions.

[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / LongPosition

# Interface: LongPosition

Defined in: [types/position.ts:22](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L22)

Represents a long position for book-keeping.
Aggregates multiple lots to track overall holdings, and profit/loss.

## Properties

### lots

> **lots**: [`LongPositionLot`](LongPositionLot.md)[]

Defined in: [types/position.ts:33](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L33)

Individual lots that make up this position. New lots are pushed to the end. Quantities are mutated in-place when closing positions.

***

### modified

> **modified**: `Date`

Defined in: [types/position.ts:36](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L36)

Timestamp when this position was last modified

***

### quantity

> **quantity**: `number`

Defined in: [types/position.ts:24](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L24)

Total open quantity of this position

***

### realisedPnL

> **realisedPnL**: `number`

Defined in: [types/position.ts:30](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L30)

Realised profit and loss accumulated when reducing position size

***

### totalCost

> **totalCost**: `number`

Defined in: [types/position.ts:27](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/position.ts#L27)

Total cost of all open lots combined (sum of all lot totalCosts). This is deducted when closing positions.

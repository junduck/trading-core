[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / calculateUnrealisedPnL

# Variable: calculateUnrealisedPnL()

> `const` **calculateUnrealisedPnL**: (`position`, `snapshot`) => `number` = `calculateUnrealizedPnL`

Defined in: [utils/market.utils.ts:180](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/market.utils.ts#L180)

Alias for [calculateUnrealizedPnL](../functions/calculateUnrealizedPnL.md) using British/AU spelling.
Provided for consistency with interface field naming (`realisedPnL`).

Calculates unrealized profit and loss for a position.
Long: currentPrice × quantity - totalCost
Short: totalProceeds - currentPrice × quantity

## Parameters

### position

[`Position`](../interfaces/Position.md)

Position to calculate unrealized P&L for

### snapshot

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

Market snapshot with current prices

## Returns

`number`

Total unrealized P&L across all positions

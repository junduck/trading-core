[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / calculateUnrealizedPnL

# Function: calculateUnrealizedPnL()

> **calculateUnrealizedPnL**(`position`, `snapshot`): `number`

Defined in: [utils/market.utils.ts:149](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/market.utils.ts#L149)

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

[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / calculateUnrealizedPnL

# Function: calculateUnrealizedPnL()

> **calculateUnrealizedPnL**(`position`, `snapshot`): `number`

Defined in: [utils/market.utils.ts:149](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/market.utils.ts#L149)

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

[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / appraisePosition

# Function: appraisePosition()

> **appraisePosition**(`position`, `snapshot`): `number`

Defined in: [utils/market.utils.ts:92](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/market.utils.ts#L92)

Appraises a single position by calculating its total value.
Sums cash + long positions - short positions.

## Parameters

### position

[`Position`](../interfaces/Position.md)

Position to appraise

### snapshot

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

Market snapshot with current prices

## Returns

`number`

Total position value

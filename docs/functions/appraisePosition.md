[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / appraisePosition

# Function: appraisePosition()

> **appraisePosition**(`position`, `snapshot`): `number`

Defined in: [utils/market.utils.ts:92](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/market.utils.ts#L92)

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

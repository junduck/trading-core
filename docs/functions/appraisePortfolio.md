[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / appraisePortfolio

# Function: appraisePortfolio()

> **appraisePortfolio**(`portfolio`, `snapshot`): `Map`\<`string`, `number`\>

Defined in: [utils/market.utils.ts:126](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/market.utils.ts#L126)

Appraises a portfolio by calculating its total value across currencies.
Sums cash + long positions - short positions per currency.

## Parameters

### portfolio

[`Portfolio`](../interfaces/Portfolio.md)

Portfolio to appraise

### snapshot

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

Market snapshot with current prices

## Returns

`Map`\<`string`, `number`\>

Map of currency to total portfolio value

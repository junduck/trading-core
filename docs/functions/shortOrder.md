[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / shortOrder

# Function: shortOrder()

> **shortOrder**(`opts`): [`Order`](../type-aliases/Order.md)

Defined in: [utils/order.utils.ts:103](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/order.utils.ts#L103)

Creates a SELL order to open a short position.
Order type is determined by price parameters:
- No price/stopPrice → MARKET
- price only → LIMIT
- stopPrice only → STOP

## Parameters

### opts

[`OrderOpts`](../type-aliases/OrderOpts.md)

## Returns

[`Order`](../type-aliases/Order.md)

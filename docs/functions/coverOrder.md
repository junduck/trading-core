[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / coverOrder

# Function: coverOrder()

> **coverOrder**(`opts`): [`Order`](../type-aliases/Order.md)

Defined in: [utils/order.utils.ts:143](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/order.utils.ts#L143)

Creates a BUY order to close a short position (cover).
Order type is determined by price parameters:
- No price/stopPrice → MARKET
- price only → LIMIT
- stopPrice only → STOP

## Parameters

### opts

[`OrderOpts`](../type-aliases/OrderOpts.md)

## Returns

[`Order`](../type-aliases/Order.md)

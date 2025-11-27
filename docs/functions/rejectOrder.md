[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / rejectOrder

# Function: rejectOrder()

> **rejectOrder**(`order`, `time?`): [`OrderState`](../type-aliases/OrderState.md)

Defined in: [utils/order.utils.ts:201](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/order.utils.ts#L201)

Rejects an order and creates OrderState with rejected status.

## Parameters

### order

[`Order`](../type-aliases/Order.md)

The order to reject

### time?

`Date`

Optional rejection timestamp (defaults to current time)

## Returns

[`OrderState`](../type-aliases/OrderState.md)

New OrderState marked as rejected

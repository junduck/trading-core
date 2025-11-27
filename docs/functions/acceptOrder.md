[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / acceptOrder

# Function: acceptOrder()

> **acceptOrder**(`order`, `time?`): [`OrderState`](../type-aliases/OrderState.md)

Defined in: [utils/order.utils.ts:183](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/order.utils.ts#L183)

Accepts an order and creates OrderState ready for execution.
Initializes tracking with status "OPEN" and quantity counters.

## Parameters

### order

[`Order`](../type-aliases/Order.md)

The order to accept

### time?

`Date`

Optional acceptance timestamp (defaults to current time)

## Returns

[`OrderState`](../type-aliases/OrderState.md)

New OrderState ready to be filled

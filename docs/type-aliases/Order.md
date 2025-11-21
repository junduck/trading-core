[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / Order

# Type Alias: Order

> **Order** = [`OrderAction`](OrderAction.md) & `object`

Defined in: [types/order.ts:48](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/types/order.ts#L48)

Order represents the intent to trade.
Contains immutable order parameters that don't change during execution.
Uses OrderAction to ensure type-safe side/effect combinations.

## Type Declaration

### created?

> `optional` **created**: `Date`

When the order was created (optional - intent time, not audit time)

### id

> **id**: `string`

Unique identifier for this order

### price?

> `optional` **price**: `number`

Limit price (for LIMIT and STOP_LIMIT orders)

### quantity

> **quantity**: `number`

Total quantity intended to trade

### stopPrice?

> `optional` **stopPrice**: `number`

Stop price (for STOP and STOP_LIMIT orders)

### symbol

> **symbol**: `string`

Symbol being traded (e.g., "BTCUSDT", "AAPL")

### type

> **type**: [`OrderType`](OrderType.md)

Type of order

[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / Fill

# Type Alias: Fill

> **Fill** = [`OrderAction`](OrderAction.md) & `object`

Defined in: [types/order.ts:97](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/order.ts#L97)

Fill represents an actual execution of an order.
Multiple fills can occur for a single order (partial fills).
Uses OrderAction to ensure type-safe side/effect combinations.

## Type Declaration

### commission

> **commission**: `number`

Commission paid for this fill

### created

> **created**: `Date`

When this fill occurred

### id

> **id**: `string`

Unique identifier for this fill (for audit trail)

### orderId

> **orderId**: `string`

Reference to the order that was filled

### price

> **price**: `number`

Actual fill price (with slippage applied)

### quantity

> **quantity**: `number`

Quantity filled in this execution

### symbol

> **symbol**: `string`

Symbol being traded

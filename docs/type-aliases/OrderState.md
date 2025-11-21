[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / OrderState

# Type Alias: OrderState

> **OrderState** = [`Order`](Order.md) & `object`

Defined in: [types/order.ts:77](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/types/order.ts#L77)

OrderState extends Order with execution state.
Tracks the current state of order execution (GTC - Good Till Cancelled).
Can be partially filled over multiple Fill records.

## Type Declaration

### filledQuantity

> **filledQuantity**: `number`

Quantity filled so far

### modified

> **modified**: `Date`

When the order state was modified

### remainingQuantity

> **remainingQuantity**: `number`

Remaining quantity to fill

### status

> **status**: [`OrderStatus`](OrderStatus.md)

Current status of the order

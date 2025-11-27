[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / OrderState

# Type Alias: OrderState

> **OrderState** = [`Order`](Order.md) & `object`

Defined in: [types/order.ts:77](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/order.ts#L77)

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

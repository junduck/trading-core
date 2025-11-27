[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / FillEffect

# Interface: FillEffect

Defined in: [types/order.ts:124](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/order.ts#L124)

Effect of processing a single fill on a position.

## Properties

### cashFlow

> **cashFlow**: `number`

Defined in: [types/order.ts:128](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/order.ts#L128)

Cash flow from the fill (negative for buying, positive for selling)

***

### fill

> **fill**: [`Fill`](../type-aliases/Fill.md)

Defined in: [types/order.ts:126](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/order.ts#L126)

The fill that was processed

***

### realisedPnL

> **realisedPnL**: `number`

Defined in: [types/order.ts:130](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/order.ts#L130)

Realized PnL from the fill (0 for opening positions, actual PnL for closing)

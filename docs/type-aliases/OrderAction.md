[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / OrderAction

# Type Alias: OrderAction

> **OrderAction** = \{ `effect`: `"OPEN_LONG"`; `side`: `"BUY"`; \} \| \{ `effect`: `"CLOSE_SHORT"`; `side`: `"BUY"`; \} \| \{ `effect`: `"CLOSE_LONG"`; `side`: `"SELL"`; \} \| \{ `effect`: `"OPEN_SHORT"`; `side`: `"SELL"`; \}

Defined in: [types/order.ts:24](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/types/order.ts#L24)

Order action combining side and position effect.
Type-safe combinations ensure BUY can only open long or close short,
and SELL can only close long or open short.

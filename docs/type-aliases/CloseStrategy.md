[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / CloseStrategy

# Type Alias: CloseStrategy

> **CloseStrategy** = `"FIFO"` \| `"LIFO"`

Defined in: [types/trade.ts:7](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/types/trade.ts#L7)

Strategy for determining which lots to close when reducing a position.
- FIFO: First In, First Out - closes the oldest lots first
- LIFO: Last In, First Out - closes the newest lots first

[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / CloseStrategy

# Type Alias: CloseStrategy

> **CloseStrategy** = `"FIFO"` \| `"LIFO"`

Defined in: [types/trade.ts:7](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/trade.ts#L7)

Strategy for determining which lots to close when reducing a position.
- FIFO: First In, First Out - closes the oldest lots first
- LIFO: Last In, First Out - closes the newest lots first

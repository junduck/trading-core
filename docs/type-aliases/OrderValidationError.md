[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / OrderValidationError

# Type Alias: OrderValidationError

> **OrderValidationError** = \{ `available`: `number`; `required`: `number`; `type`: `"INSUFFICIENT_CASH"`; \} \| \{ `available`: `number`; `positionType`: `"LONG"` \| `"SHORT"`; `required`: `number`; `symbol`: `string`; `type`: `"INSUFFICIENT_POSITION"`; \} \| \{ `positionType`: `"LONG"` \| `"SHORT"`; `symbol`: `string`; `type`: `"POSITION_NOT_FOUND"`; \} \| \{ `type`: `"INVALID_PRICE"`; `value?`: `number`; \} \| \{ `type`: `"INVALID_QUANTITY"`; `value`: `number`; \} \| \{ `type`: `"INVALID_STOP_PRICE"`; `value?`: `number`; \} \| \{ `type`: `"MISSING_PRICE"`; \} \| \{ `type`: `"MISSING_STOP_PRICE"`; \} \| \{ `symbol`: `string`; `type`: `"MARKET_DATA_MISSING"`; \} \| \{ `currentPrice`: `number`; `expectedDirection`: `"ABOVE"` \| `"BELOW"`; `stopPrice`: `number`; `type`: `"INVALID_STOP_DIRECTION"`; \}

Defined in: [utils/order.validation.ts:10](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/order.validation.ts#L10)

Structured validation errors for order validation failures.
Each error type contains relevant fields to describe the failure.

[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / validateOrder

# Function: validateOrder()

> **validateOrder**(`order`, `position`, `snapshot`): [`OrderValidationResult`](../interfaces/OrderValidationResult.md)

Defined in: [utils/order.validation.ts:315](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/order.validation.ts#L315)

Main dispatcher for order validation.
Validates order structure and delegates to type-specific validators.

## Parameters

### order

[`Order`](../type-aliases/Order.md)

The order to validate

### position

[`Position`](../interfaces/Position.md)

Current position in the currency

### snapshot

[`MarketSnapshot`](../interfaces/MarketSnapshot.md)

Current market prices (optional, but recommended)

## Returns

[`OrderValidationResult`](../interfaces/OrderValidationResult.md)

Validation result with structured error if invalid

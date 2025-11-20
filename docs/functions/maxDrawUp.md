[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / maxDrawUp

# Function: maxDrawUp()

> **maxDrawUp**(`buffer`): [`DrawdownResult`](../interfaces/DrawdownResult.md)

Defined in: [utils/drawdown.ts:87](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/drawdown.ts#L87)

Calculates the maximum absolute drawup (trough to peak increase) in a numeric buffer.

## Parameters

### buffer

[`NumericBuffer`](../interfaces/NumericBuffer.md)

The numeric buffer to analyze

## Returns

[`DrawdownResult`](../interfaces/DrawdownResult.md)

The drawup result with value and position indices

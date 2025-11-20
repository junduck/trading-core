[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / maxDrawDown

# Function: maxDrawDown()

> **maxDrawDown**(`buffer`): [`DrawdownResult`](../interfaces/DrawdownResult.md)

Defined in: [utils/drawdown.ts:67](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/drawdown.ts#L67)

Calculates the maximum absolute drawdown (peak to trough decline) in a numeric buffer.

## Parameters

### buffer

[`NumericBuffer`](../interfaces/NumericBuffer.md)

The numeric buffer to analyze

## Returns

[`DrawdownResult`](../interfaces/DrawdownResult.md)

The drawdown result with value and position indices

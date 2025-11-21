[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / maxRelDrawUp

# Function: maxRelDrawUp()

> **maxRelDrawUp**(`buffer`): [`DrawdownResult`](../interfaces/DrawdownResult.md)

Defined in: [utils/drawdown.ts:97](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/drawdown.ts#L97)

Calculates the maximum relative drawup (trough to peak increase as percentage) in a numeric buffer.

## Parameters

### buffer

[`NumericBuffer`](../interfaces/NumericBuffer.md)

The numeric buffer to analyze

## Returns

[`DrawdownResult`](../interfaces/DrawdownResult.md)

The drawup result with value and position indices

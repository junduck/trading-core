[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / maxRelDrawUp

# Function: maxRelDrawUp()

> **maxRelDrawUp**(`buffer`): [`DrawdownResult`](../interfaces/DrawdownResult.md)

Defined in: [numeric/drawdown.ts:97](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/drawdown.ts#L97)

Calculates the maximum relative drawup (trough to peak increase as percentage) in a numeric buffer.

## Parameters

### buffer

[`NumericBuffer`](../interfaces/NumericBuffer.md)

The numeric buffer to analyze

## Returns

[`DrawdownResult`](../interfaces/DrawdownResult.md)

The drawup result with value and position indices

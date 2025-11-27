[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / maxRelDrawDown

# Function: maxRelDrawDown()

> **maxRelDrawDown**(`buffer`): [`DrawdownResult`](../interfaces/DrawdownResult.md)

Defined in: [numeric/drawdown.ts:77](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/numeric/drawdown.ts#L77)

Calculates the maximum relative drawdown (peak to trough decline as percentage) in a numeric buffer.

## Parameters

### buffer

[`NumericBuffer`](../interfaces/NumericBuffer.md)

The numeric buffer to analyze

## Returns

[`DrawdownResult`](../interfaces/DrawdownResult.md)

The drawdown result with value and position indices

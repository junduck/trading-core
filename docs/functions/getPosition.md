[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / getPosition

# Function: getPosition()

> **getPosition**(`portfolio`, `currency`): [`Position`](../interfaces/Position.md) \| `undefined`

Defined in: [utils/portfolio.utils.ts:56](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/portfolio.utils.ts#L56)

Gets the position for a specific currency.

## Parameters

### portfolio

[`Portfolio`](../interfaces/Portfolio.md)

The portfolio to query

### currency

`string`

The currency code to look up

## Returns

[`Position`](../interfaces/Position.md) \| `undefined`

The Position for that currency, or undefined if not found

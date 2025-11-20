[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / getCash

# Function: getCash()

> **getCash**(`portfolio`, `currency`): `number`

Defined in: [utils/portfolio.utils.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/portfolio.utils.ts#L70)

Gets the cash balance for a specific currency.

## Parameters

### portfolio

[`Portfolio`](../interfaces/Portfolio.md)

The portfolio to query

### currency

`string`

The currency code to look up

## Returns

`number`

The cash balance, or 0 if currency not found
